import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Venta } from '../model/Venta';
import { BaseService } from './base.service';
import { ItemService } from './item.service';
import { ProductoService } from './producto.service';

declare var alertify: any;

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private ipc: ElectronService, private producto: ProductoService, private item: ItemService, private base: BaseService) { }

  //Venta
  listadoVenta: Venta[] = [];
  unaVenta: Venta = new Venta(1, null, new Date(), 0, 0, 0);
  desde: string = "";
  hasta: string = "";
  totalVentas: number = 0;
  totalCostos: number = 0;
  totalGanancias: number = 0;
  filtro: string = "";
  redondear: boolean = true;

  //Metodos de Venta

  getVentas() {
    const consulta = "SELECT * FROM VENTAS ORDER BY id DESC LIMIT 100";
    let res = this.ipc.ipcRenderer.sendSync('base', consulta);
    if (res[0] == 'ok') {
      this.listadoVenta = res[1];
    } else {
      alertify.notify('Error ' + res[1].code, 'warning', 5);
    }
  }

  getVentasEntreFechas(desde: string, hasta: string) {
    const consulta = `SELECT * FROM VENTAS WHERE fecha BETWEEN '${desde}' and '${hasta}' ORDER BY id DESC`;
    let res = this.ipc.ipcRenderer.sendSync('base', consulta);
    if (res[0] == 'ok') {
      this.listadoVenta = res[1];
    } else {
      alertify.notify('Error ' + res[1].code, 'warning', 5);
    }
  }

  guardarVenta(unaVenta: Venta) {
    this.item.insertItems = "";
    this.producto.updateProductos = "";
    unaVenta.cliente_nombre = ((unaVenta.cliente_nombre != null && unaVenta.cliente_nombre != '') ? "'" + unaVenta.cliente_nombre + "'" : null);
    const consulta = `INSERT INTO VENTAS (cliente_nombre, fecha, total, ganancia, subtotal, forma_pago) VALUES (${unaVenta.cliente_nombre},'${new Date(unaVenta.fecha).toDateString()}', ${unaVenta.total}, ${unaVenta.ganancia}, ${unaVenta.subtotal}, '${unaVenta.forma_pago}') RETURNING ID;`;
    let res = this.ipc.ipcRenderer.sendSync('base', consulta);
    if (res[0] == 'ok') {
      let id = res[1][0].id;
      unaVenta.items.forEach(unItem => {
        unItem.id_venta = id;
        this.item.insertItems = this.item.insertItems + `INSERT INTO ITEMS (id_venta, total, codigo, nombre, cantidad, precio_venta, precio_costo, ganancia) values (${unItem.id_venta},${unItem.total},'${unItem.codigo}','${unItem.nombre}',${unItem.cantidad},${unItem.precio_venta}, ${unItem.precio_costo}, ${unItem.ganancia});`;
        this.producto.updateProductos = this.producto.updateProductos + `UPDATE PRODUCTOS P SET cantidad = cantidad - ${unItem.cantidad}  WHERE P.codigo = '${unItem.codigo}';`;
      });
      this.item.guardarItemsActualizarCantidad(this.item.insertItems + this.producto.updateProductos);
      this.producto.updateProductos = "";
      this.item.insertItems = "";
      this.producto.getProductos();
      alertify.notify('Vendido', 'success', 5);
      this.unaVenta.items = [];
    } else {
      alertify.notify('Error ' + res[1].code, 'warning', 5);
    }
  }

  borrarVenta(unaVenta: Venta) {

    let consultaItems = `select itm.codigo, itm.cantidad from items itm where id_venta = ${unaVenta.id}`;
    let itemsResponse = this.ipc.ipcRenderer.sendSync('base', consultaItems);
    if (itemsResponse[0] == 'ok') {
      let items = itemsResponse[1];
      var eliminarVentaActualizarProductos = ``;
      items.forEach(unItem => {
        eliminarVentaActualizarProductos += `update productos set cantidad = cantidad + ${unItem.cantidad} where codigo = '${unItem.codigo}'; `;
      });
      eliminarVentaActualizarProductos += `delete from ventas where id = '${unaVenta.id}';`
    } else {
      alertify.notify('Error ' + itemsResponse[1].code, 'warning', 5);
    }
    let res = this.ipc.ipcRenderer.sendSync('base', eliminarVentaActualizarProductos);
    if (res[0] == 'ok') {
      alertify.notify('Venta eliminada', 'error', 5);
      if (this.desde != '' && this.hasta != '') {
        this.getVentasEntreFechas(this.desde, this.hasta);
      } else {
        this.getVentas();
      }
    } else {
      alertify.notify('Error ' + res[1].code, 'warning', 5);
    }
  }

  getEstadisticas(year: string) {
    const consulta = `select cast(date_part('month', fecha) as integer) as mes, count(id) as cantidad, trunc(sum(total)) as ventas, trunc(sum(ganancia)) as ganancias, trunc((sum(total) - sum (ganancia))) as costos
    from ventas
    where date_part('year', fecha) = '${year}'
    group by 1`;
    let res = this.ipc.ipcRenderer.sendSync('base', consulta);
    if (res[0] == 'ok') {
      return res[1];
    } else {
      alertify.notify('Error ' + res[1].code, 'warning', 5);
      return [];
    }
  }

  calcularPrecio() {
    this.unaVenta.total = 0;
    this.unaVenta.subtotal = 0;
    this.unaVenta.ganancia = 0;
    this.unaVenta.items.forEach(i => {
      this.unaVenta.subtotal = this.unaVenta.subtotal + i.total;
      this.unaVenta.ganancia = this.unaVenta.ganancia + i.ganancia;
    });
    if (this.unaVenta.forma_pago == 'Debito') {
      this.unaVenta.total = this.unaVenta.subtotal;
    }
    if (this.unaVenta.forma_pago == 'Efectivo') {
      let descuento = this.base.getVariable("Descuento pago con Efectivo");
      this.unaVenta.total = this.unaVenta.subtotal - (this.unaVenta.subtotal * (Number(descuento) / 100));
      if (this.redondear) {
        this.unaVenta.total = this.base.redondearPrecio(10, this.unaVenta.total);
      }
    }
    if (this.unaVenta.forma_pago == 'Credito') {
      let recargo = this.base.getVariable("Recargo pago con Credito");
      this.unaVenta.total = this.unaVenta.subtotal + (this.unaVenta.subtotal * (Number(recargo) / 100));
      if (this.redondear) {
        this.unaVenta.total = this.base.redondearPrecio(10, this.unaVenta.total);
      }
    }
  }

}
