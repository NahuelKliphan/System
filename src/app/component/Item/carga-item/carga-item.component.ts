import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/model/Item';
import { Producto } from 'src/app/model/Producto';
import { BaseService } from 'src/app/servicio/base.service';
import { ItemService } from 'src/app/servicio/item.service';
import { ProductoService } from 'src/app/servicio/producto.service';
import { VentaService } from 'src/app/servicio/venta.service';

declare var $: any;
declare var alertify: any;

@Component({
  selector: 'app-carga-item',
  templateUrl: './carga-item.component.html',
  styleUrls: ['./carga-item.component.css']
})
export class CargaItemComponent implements OnInit {

  constructor(private base: BaseService, private producto: ProductoService, private item: ItemService, private venta: VentaService) { }

  ngOnInit() {
  }


  cargar() {

    if (this.formCompleto()) {

      $('#cargaItemModal').modal('hide');
      this.item.unItem = new Item(this.item.idItemTemp, 1, this.producto.unProducto.precio_venta * this.item.unItem.cantidad, this.producto.unProducto.codigo, this.producto.unProducto.nombre, this.item.unItem.cantidad, this.producto.unProducto.precio_venta, this.producto.unProducto.precio_costo, this.producto.unProducto.precio_venta * this.item.unItem.cantidad - this.producto.unProducto.precio_costo * this.item.unItem.cantidad);
      this.item.idItemTemp++;
      this.venta.unaVenta.items.push(this.item.unItem);
      this.venta.calcularPrecio();
      alertify.notify('Item cargado', 'success', 5);
      $('#cargaItemModal').modal({ closable: false }).modal('show');
      this.vaciarForm();
    }
  }


  salir() {
    $('#cargaItemModal').modal('hide');
    this.producto.unProducto = new Producto(-1, "-1", "", null, null, 1, "", "", null);
  }

  formCompleto() {

    let ret = true;

    //Nombre
    if (this.producto.unProducto.nombre == null || this.producto.unProducto.nombre == "") {
      ret = false;
      alertify.notify('Nombre no válido', 'error', 5);
      return false;
    }

    //Precio Costo
    if (this.producto.unProducto.precio_venta < 0 || !this.base.isNumber(this.producto.unProducto.precio_venta)) {
      ret = false;
      alertify.notify('Precio no válido', 'error', 5);
      return false;
    }

    //Cantidad
    if (this.item.unItem.cantidad == null || !this.base.isNumber(this.item.unItem.cantidad) || !Number.isInteger(Number(this.item.unItem.cantidad)) || this.item.unItem.cantidad < 0) {
      ret = false;
      alertify.notify('Cantidad no válida', 'error', 5);
      return false;
    }

    return ret;
  }

  vaciarForm() {
    this.item.unItem = new Item(null, null, null, null, null, 1, null, null, null);
    this.producto.unProducto = new Producto(-1, "-1", "", null, null, null, "", "", null);
    this.producto.busqueda = "";
  }

}
