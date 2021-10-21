const { ipcMain } = require('electron');

var printing = false;

function print58mm(printerWindow, data) {

    var option = {
        printBackground: true,
        silent: true,
        deviceName: data.impresion.impresora,
        margins: { marginType: 'custom', top: 0, bottom: 0, left: 0, right: 0 }
    };
    
    printerWindow.webContents.send("printPDF", data.contenido);
    ipcMain.on("readyToPrint58mm", (event) => {
        if (!printing) {
            printing = true;
            setTimeout(() => {
                printing = false;
            }, 2000);
            printerWindow.webContents.print(option).then(data => {
                printing = false;
            });
        }
    });
}

function printA4(printerWindow, data) {

    var option = {
        silent: true,
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        landscape: false,
        pageSize: 'A4',
        scaleFactor: 100,
        deviceName: data.impresion.impresora,
    };

    printerWindow.webContents.send("printPDF", data.contenido);
    ipcMain.on("readyToPrintA4", (event) => {
        if (!printing) {
            printing = true;
            setTimeout(() => {
                printing = false;
            }, 2000);
            printerWindow.webContents.print(option).then(data => {
                printing = false;
            });
        }
    });
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function currencyFormat(value) {
    value = Number(value);
    if (!Number.isInteger(value)) {
        value = value.toFixed(2);
    }
    var aux = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    var partes = aux.split(".");
    var ret = replaceAll(partes[0], ',', '.') + ",";
    if (partes[1] != undefined) {
        ret += partes[1];
    } else {
        ret += "00";
    }
    return ret;
}

function imprimirDelegator(printerWindow, data) {

    switch (data.impresion.formato) {
        case '58mm': {
            data.contenido = generarHtmlVenta58mm(data);
            print58mm(printerWindow, data)
            break;
        }
        case 'a4': {
            data.contenido = generarHtmlVentaA4(data);
            printA4(printerWindow, data);
            break;
        }
    }
}

function generarHtmlVentaA4(data) {
    var html = `
    <h2>${data.empresa_nombre}</h2>
    <table class='table striped'>
    <thead>
    <tr>
    <th>Nombre</th>
    <th style="text-align: center;">Cantidad</th>
    <th>Precio</th>
    <th>Total</th>
    </tr>
    </thead>
    <tbody>`;
    var total = 0;
    data.listado.forEach(item => {
        total += Number(item.total);
        html += `<tr>
        <td>${item.nombre}</td>
        <td style="text-align: center;">${item.cantidad}</td>
        <td>$${currencyFormat(item.precio_venta)}</td>
        <td>$${currencyFormat(item.total)}</td>
        </tr>`;
    });
    html += `</tbody>
    <tfoot>
    <tr>
    <td></td>
    <td></td>
    <td>Total:</td>
    <td>$${currencyFormat(total)}</td>
    </tr>
    </tfoot>
    </table>`;
    return html;
}

function generarHtmlVenta58mm(data) {

    const fecha = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
    var html = `<div class="ticket">`;
    if (!data.empresa_logo) {
        html += `<h1 class="centrado titulo">${data.empresa_nombre}</h1>`;
    } else {
        html += `<img src="${data.empresa_logo}">`;
        html += `<p class="centrado"> ${data.empresa_nombre} </p>`;
    }
    html += `<p class="centrado"> ${data.empresa_direccion} </p>
        <p class="centrado"> ${fecha} </p> 
        <table>
            <thead>
                <tr>
                    <th class="cantidad">CAN</th>
                    <th class="producto">PRODUCTO</th>
                    <th class="precio">$$</th>
                </tr>
            </thead>
            <tbody>`;
    data.listado.forEach(item => {
        html += `<tr>
                <td class="cantidad">${item.cantidad}</td>
                <td class="producto">${item.nombre}</td>
                <td class="precio">$${currencyFormat(item.total)}</td>
                </tr>`;
    });
    html += `
            <tr>
            <td class="cantidad"></td>
            <td class="producto">PAGO</td>
            <td class="precio">${data.venta_forma_pago}</td>
            </tr>
            <tr>
            <td class="cantidad"></td>
            <td class="producto">SUBTOTAL</td>
            <td class="precio">$${currencyFormat(data.venta_subtotal)}</td>
            </tr>`;
    if (data.venta_forma_pago == 'Efectivo') {
        html += `
        <tr>
        <td class="cantidad"></td>
        <td class="producto">DESCUENTO</td>
        <td class="precio">- $${currencyFormat((Number(data.venta_subtotal) - Number(data.venta_total)))}</td>
        </tr>
        <tr>`;
    }
    if (data.venta_forma_pago == 'Credito') {
        html += `
        <tr>
        <td class="cantidad"></td>
        <td class="producto">RECARGO</td>
        <td class="precio">+ $${currencyFormat((Number(data.venta_total) - Number(data.venta_subtotal)))}</td>
        </tr>
        <tr>`;
    }
    html += `
            <tr>
            <td class="cantidad"></td>
            <td class="producto">TOTAL</td>
            <td class="precio">$${currencyFormat(data.venta_total)}</td>
            </tr>
            </tbody>
        </table>
        <p class="centrado">¡GRACIAS POR SU COMPRA! </p>
        <div class="espacio-10"></div>
        <div>.</div>
    </div>`;

    return html;
}

module.exports.imprimirDelegator = imprimirDelegator;
