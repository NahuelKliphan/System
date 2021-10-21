const { Client } = require('pg');
var client;

async function Actualizar(base, version) {

    client = new Client(base);
    await client.connect(err => {
        if (err) {
            console.error('Error al correr actualizador.', err.stack);
        } else {
            console.log('Actualizador corriendo.');
            ActualizarBase(version);
        }
    });
}

async function ActualizarBase(version) {

    await ActualizadorINC0010();
    await ActualizadorINC0013(version);
    await ActualizadorINC0015();
    await ActualizadorINC0018();
    await ActualizadorINC0022();
    await ActualizadorINC0024();
    await ActualizadorINC0025();
    await ActualizadorImpresoraLaser();
    await ActualizadorAddCampoSubTotal();

    await ActualizarVersion(version);
    console.log("Base actualizada");
    await client.end();

}

async function ActualizarVersion(version) {
    let consulta = `update variables set valor = '${version}' where nombre = 'Version';`;
    await client.query(consulta);
}

async function ActualizadorINC0010() {

    let consulta = `DO $$ BEGIN IF EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='items' and column_name='precio') THEN
        alter table items rename column precio to precio_venta; 
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='items' and column_name='precio_costo') THEN
        alter table items add column precio_costo decimal; 
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='items' and column_name='ganancia') THEN
        alter table items add column ganancia decimal;
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='ventas' and column_name='ganancia') THEN
        alter table ventas add column ganancia decimal;
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorINC0013(version) {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='variables') THEN
        create table variables(id serial, nombre varchar(50), valor varchar(50), tipo varchar(10), primary key(id));
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Version') THEN
        insert into variables (nombre, valor, tipo) values ('Version', '${version}', 'texto');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Scanner') THEN
        insert into variables (nombre, valor, tipo) values ('Scanner', 'N', 'texto');
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorINC0015() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color sidebar') THEN
        insert into variables (nombre, valor, tipo) values ('Color sidebar', 'blue', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color navbar') THEN
        insert into variables (nombre, valor, tipo) values ('Color navbar', 'blue', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color tabla') THEN
        insert into variables (nombre, valor, tipo) values ('Color tabla', 'blue', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton aceptar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton aceptar', 'green', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton cancelar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton cancelar', 'grey', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton editar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton editar', 'black', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton eliminar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton eliminar', 'red', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton agregar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton agregar', 'blue', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton buscar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton buscar', 'grey', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton imprimir') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton imprimir', 'teal', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton salir') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton salir', 'red', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton vender') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton vender', 'green', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton guardar') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton guardar', 'blue', 'color');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color icono categoria') THEN
        insert into variables (nombre, valor, tipo) values ('Color icono categoria', 'blue', 'color');
        END IF; END $$;`;

    await client.query(consulta);
}

async function ActualizadorINC0018() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Color boton estadistica') THEN
        insert into variables (nombre, valor, tipo) values ('Color boton estadistica', 'blue', 'color');
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorINC0022() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Cantidad limite de productos') THEN
        insert into variables (nombre, valor, tipo) values ('Cantidad limite de productos', '20', 'texto');
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorINC0024() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Contador de codigo autogenerado') THEN
        insert into variables (nombre, valor, tipo) values ('Contador de codigo autogenerado', '0000000000000', 'texto');
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorINC0025() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Cantidad de segundos para ver producto') THEN
        insert into variables (nombre, valor, tipo) values ('Cantidad de segundos para ver producto', '10', 'texto');
        END IF; END $$;`;
    await client.query(consulta);
}

async function ActualizadorImpresoraLaser() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Formato Impresion Venta') THEN
        insert into variables (nombre, valor, tipo) values ('Formato Impresion Venta', '58mm', 'texto');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Impresora por Defecto') THEN
        insert into variables (nombre, valor, tipo) values ('Impresora por Defecto', 'FK58 Printer', 'texto');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='entidades' and column_name='logo_imprimir') THEN
        alter table entidades add column logo_imprimir text NULL;
        END IF; END $$;`;

    await client.query(consulta);
}

async function ActualizadorAddCampoSubTotal() {

    let consulta = `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='ventas' and column_name='subtotal') THEN
        alter table ventas add column subtotal numeric;
        update ventas set subtotal = total where subtotal is null;
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM information_schema.columns
        WHERE table_name='ventas' and column_name='forma_pago') THEN
        alter table ventas add column forma_pago varchar(30);
        update ventas set forma_pago = 'Efectivo' where forma_pago is null;
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Descuento pago con Efectivo') THEN
        insert into variables (nombre, valor, tipo) values ('Descuento pago con Efectivo', '5', 'texto');
        END IF; END $$;`;
    consulta += `DO $$ BEGIN IF NOT EXISTS(SELECT * FROM variables
        WHERE nombre='Recargo pago con Credito') THEN
        insert into variables (nombre, valor, tipo) values ('Recargo pago con Credito', '20', 'texto');
        END IF; END $$;`;

    await client.query(consulta);
}

module.exports.Actualizar = Actualizar;