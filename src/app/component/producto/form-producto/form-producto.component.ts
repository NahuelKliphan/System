import { Component, HostListener, OnInit } from '@angular/core';
import { Producto } from 'src/app/model/Producto';
import { BaseService } from 'src/app/servicio/base.service';
import { CategoriaService } from 'src/app/servicio/categoria.service';
import { ProductoService } from 'src/app/servicio/producto.service';

declare var $: any;
declare var alertify: any;

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})

export class FormProductoComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = null;
  cargar: boolean = true;
  mostrarAumentoPrecioVenta: boolean = false;
  aumentoPrecioVenta: number = null;

  constructor(private producto: ProductoService, private base: BaseService, private categoria: CategoriaService) {
    $("#foto").prop("value", "");
    this.fileData = null;
    this.previewUrl = null;
    this.cargar = true;
  }

  ngOnInit() {
    $('.special.cards .image').dimmer({
      on: 'hover'
    });
    this.categoria.getCategorias();
  }

  guardar() {
    if (this.producto.editar) {
      if (this.formCompleto()) {
        this.producto.editarProducto(this.producto.unProducto);
        this.vaciarCampos();
        this.producto.editar = false;
      }
    } else {
      if (this.formCompleto()) {
        if (this.producto.verificarCodigoProducto(this.producto.unProducto.codigo)) {
          this.producto.guardarProducto(new Producto(this.producto.unProducto.id, this.producto.unProducto.codigo, this.producto.unProducto.nombre, this.base.adaptarDecimal(this.producto.unProducto.precio_costo), this.base.adaptarDecimal(this.producto.unProducto.precio_venta), this.producto.unProducto.cantidad, this.producto.unProducto.descripcion, this.producto.unProducto.foto, this.producto.unProducto.id_categoria));
          this.vaciarCampos();
        }
      }
      this.producto.editar = false;
    }
  }

  @HostListener('keydown.escape')
  cancelar() {
    $('#formProducto').modal('hide').modal('hide dimmer');
    this.vaciarCampos();
    this.producto.editar = false;
    this.producto.getProductos();
  }

  formCompleto() {

    let ret = true;

    //Codigo
    if (this.producto.unProducto.codigo == null || this.producto.unProducto.codigo == "") {
      ret = false;
      alertify.notify('Codigo no válido', 'error', 5);
      return false;
    }

    //Nombre
    if (this.producto.unProducto.nombre == null || this.producto.unProducto.nombre == "") {
      ret = false;
      alertify.notify('Nombre no válido', 'error', 5);
      return false;
    }

    //Precio Costo
    if (this.producto.unProducto.precio_costo < 0 || !this.base.isNumber(this.producto.unProducto.precio_costo)) {
      ret = false;
      alertify.notify('Precio costo no válido', 'error', 5);
      return false;
    }

    //Precio Venta
    if (this.producto.unProducto.precio_venta < 0 || !this.base.isNumber(this.producto.unProducto.precio_venta)) {
      ret = false;
      alertify.notify('Precio venta no válido', 'error', 5);
      return false;
    }

    //Cantidad
    if (this.producto.unProducto.cantidad == null || !this.base.isNumber(this.producto.unProducto.cantidad) || !Number.isInteger(Number(this.producto.unProducto.cantidad)) || this.producto.unProducto.cantidad < 0) {
      ret = false;
      alertify.notify('Cantidad no válida', 'error', 5);
      return false;
    }

    return ret;

  }

  vaciarCampos() {
    this.producto.unProducto = new Producto(null, null, null, null, null, null, null, null, null);
    this.mostrarAumentoPrecioVenta = false;
    this.aumentoPrecioVenta = null;
  }

  cargarFoto(fileInput: any) {
    if (this.cargar) {
      this.fileData = <File>fileInput.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.fileData);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;
        this.producto.unProducto.foto = this.previewUrl;
      }
    }
  }

  borrarFoto() {
    $("#foto").prop("value", "");
    this.cargar = false;
    this.producto.unProducto.foto = null;
    this.cargar = true;
  }

  abrirModalPorcentaje() {
    if (this.mostrarAumentoPrecioVenta) {
      this.mostrarAumentoPrecioVenta = false;
    } else {
      this.mostrarAumentoPrecioVenta = true;
    }
  }

  calcularPrecioVenta() {
    if (this.base.isNumber(this.producto.unProducto.precio_costo) && this.base.isNumber(this.aumentoPrecioVenta)) {
      this.aumentoPrecioVenta = (this.aumentoPrecioVenta / 100) + 1;
      this.mostrarAumentoPrecioVenta = false;
      this.producto.unProducto.precio_venta = parseFloat((this.producto.unProducto.precio_costo * this.aumentoPrecioVenta).toFixed(2));
      this.aumentoPrecioVenta = null;
    } else {
      alertify.notify('No se pudo calcular el precio venta', 'error', 5);
    }
  }

  generarCodigo() {
    let codigoBase = this.base.getVariable("Contador de codigo autogenerado");
    this.producto.unProducto.codigo = codigoBase;
  }

}
