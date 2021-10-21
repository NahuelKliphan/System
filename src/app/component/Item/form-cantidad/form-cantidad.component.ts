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
  selector: 'app-form-cantidad',
  templateUrl: './form-cantidad.component.html',
  styleUrls: ['./form-cantidad.component.css']
})
export class FormCantidadComponent implements OnInit {

  constructor(private item: ItemService, private venta: VentaService, private producto: ProductoService, private base: BaseService) { }

  ngOnInit() {
  }

  aceptar() {
    if (this.item.unItem.cantidad > 0) {

      if (this.comprobarCantidad()) {

        $('#formCantidadItem').modal('hide');
        this.item.unItem = new Item(this.item.idItemTemp, 1, this.producto.unProducto.precio_venta * this.item.unItem.cantidad, this.producto.unProducto.codigo, this.producto.unProducto.nombre, this.item.unItem.cantidad, this.producto.unProducto.precio_venta, this.producto.unProducto.precio_costo, this.producto.unProducto.precio_venta * this.item.unItem.cantidad - this.producto.unProducto.precio_costo * this.item.unItem.cantidad);
        this.item.idItemTemp++;
        this.venta.unaVenta.items.push(this.item.unItem);
        this.venta.calcularPrecio();
        alertify.notify('Item cargado', 'success', 5);
        $('#listaProducto').modal({ closable: false }).modal('show');
        this.vaciarForm();
      } else {
        alertify.notify('No hay suficiente cantidad', 'error', 5);
      }
    } else {
      alertify.notify('Cantidad invalida', 'error', 5);
    }
  }

  cancelar() {
    $('#formCantidadItem').modal('hide');
    this.vaciarForm();
  }


  vaciarForm() {
    this.item.unItem = new Item(null, null, null, null, null, 1, null, null, null);
    this.producto.unProducto = new Producto(null, null, null, null, null, null, null, null, null);
    this.producto.busqueda = "";
  }

  cantidad: number = 0;

  comprobarCantidad() {

    this.cantidad = 0;
    this.item.listadoItem.forEach(unItem => {
      if (unItem.codigo == this.producto.unProducto.codigo) {
        this.cantidad = Number(this.cantidad) + Number(unItem.cantidad);
      }
    });
    this.cantidad = Number(this.cantidad) + Number(this.item.unItem.cantidad);
    if (this.producto.unProducto.codigo == '-1' || this.producto.consultarCantidadProducto(this.producto.unProducto) >= this.cantidad) {
      return true;
    } else {
      return false;
    }
  }
}