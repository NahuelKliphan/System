const { app, BrowserWindow, ipcMain } = require('electron');
const { Client } = require('pg');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const Actualizador = require('./base/Actualizador');
const printer = require('./printer/printer');

//Ruta de la app
const ruta = app.getPath('userData');

//Ventana principal.
let win;
//Ventana printer
let printerWindow;
//Conector a pg
let client;

function createWindow() {
  //Crea la ventana principal.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`,
    webPreferences: { nodeIntegration: true },
    show: true
  });
  //Carga el index.html de angular
  try {
    if (JSON.parse(process.env.npm_config_argv).original[1] == "develectron") {
      win.loadURL('http://localhost:4200');
    } else {
      win.loadURL("file://" + __dirname + "/dist/index.html");
    }
  } catch (error) {
    win.loadURL("file://" + __dirname + "/dist/index.html");
  }
  if (!isDev) {
    win.setMenu(null);
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    autoUpdater.checkForUpdates();
  }
  ConectarBD();
  // Evento cuando se cierra la ventana.
  win.on('closed', function () {
    win = null;
  });
  win.on('resize', function () {
    win.webContents.send('cambio');
  });
}

async function createWindowPrint() {
  //Crea la ventana para imprimir
  printerWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });

  let pathTemplatePrint = "";

  const consulta = "select v.valor from variables v where v.nombre = 'Formato Impresion Venta';";
  const res = await client.query(consulta);
  let formatoImpresion = res.rows[0].valor.toUpperCase();

  switch (formatoImpresion) {
    case '58MM':
      pathTemplatePrint = "file://" + __dirname + "/printer/templates/template58mm.html";
      break;
    case 'A4':
      pathTemplatePrint = "file://" + __dirname + "/printer/templates/templateA4.html";
      break;
    default:
      pathTemplatePrint = "file://" + __dirname + "/printer/templates/templateA4.html";
      break;
  }

  printerWindow.loadURL(pathTemplatePrint);

}

// Evento que ejecuta el metodo para crear la ventana.
app.on('ready', function () {
  createWindow();
  createWindowPrint();
  win.maximize();
  sendStatusBaseToWindow(client._connected);
  checkBase();
});

// Libera los recursos de la ventana
app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
  win.removeAllListeners('close');
  win.close();
});

app.on('activate', function () {
  // Proceso especifico de macOS.
  if (win === null) {
    createWindow();
  }
})

ipcMain.on('salir', () => {
  DesconectarBD();
  app.quit();
});

ipcMain.on('refrescar', () => {
  win.reload();
});

function sendStatusToWindow(text) {
  win.webContents.send('update', text);
}

function sendStatuspercentToWindow(text) {
  win.webContents.send('percent', text);
}

function sendStatusBaseToWindow(text) {
  win.webContents.send('BaseStatus', text);
}

//Version
ipcMain.on('version', (e) => {
  e.returnValue = app.getVersion();
});

//Autoupdate

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Buscando Actualizaciones');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Actualización disponible');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Actualización no disponible');
});
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error de Actualización ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Descargando ' + Number.parseFloat(progressObj.percent).toFixed(2) + '%';
  sendStatusToWindow(log_message);
  sendStatuspercentToWindow(progressObj.percent);
});
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Actualización descargada');
  autoUpdater.quitAndInstall();
});


//Metodo para conectar la base de datos.
async function ConectarBD() {
  client = new Client(LeerBase());
  await client.connect(err => {
    if (err) {
      console.error('Error al conectar Base de datos.', err.stack);
      ConectarBD();
    } else {
      console.log('Base de datos conectada.');
    }
  });
}

//Metodos consulta BD
ipcMain.on('base', (e, consulta) => {
  client.query(consulta, function (err, res) {
    e.returnValue = (err ? ['error', err] : ['ok', res.rows]);
  });
});

async function DesconectarBD() {
  await client.end();
}

function LeerBase() {
  const fs = require("fs");
  let data = fs.readFileSync(ruta + '\\base.txt').toString().split(';');
  return JSON.parse(data[0]);
}

async function checkBase() {

  var consulta = "SELECT VALOR FROM VARIABLES WHERE NOMBRE = 'Version';";
  var ret = await client.query(consulta);
  if (ret.rows.length > 0) {
    if (ret.rows[0].valor != app.getVersion()) {
      Actualizador.Actualizar(LeerBase(), app.getVersion());
    }
  } else {
    console.log("No se encontro version");
  }
}

//Imprimir
ipcMain.on('print', (e, data) => {

  const consulta = `select v1.valor as formato, v2.valor as impresora 
                    from variables v1, variables v2 
                    where v1.nombre = 'Formato Impresion Venta' 
                    and v2.nombre  = 'Impresora por Defecto';`;
  client.query(consulta, function (err, res) {
    data.impresion = res.rows[0];
    printer.imprimirDelegator(printerWindow, data);
    e.returnValue = 'ok';
  });  

});

process.on('uncaughtException', (error) => {
  if (error.code == "57P01") {
    ConectarBD();
  }
});