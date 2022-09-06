import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/servicio/base.service';
import { CategoriaService } from 'src/app/servicio/categoria.service';
import { ProductoService } from 'src/app/servicio/producto.service';
import { RegistroPrecioService } from 'src/app/servicio/registro-precio.service';


declare var $: any;
declare var alertify: any;

@Component({
  selector: 'app-modificar-precio-producto',
  templateUrl: './modificar-precio-producto.component.html',
  styleUrls: ['./modificar-precio-producto.component.css']
})
export class ModificarPrecioProductoComponent implements OnInit {

  porcentaje: boolean = true;
  monto: boolean = false;
  aumentar: boolean = true;
  bajar: boolean = false;
  precio_costo: boolean = true;
  precio_venta: boolean = false;
  redondeo: boolean = null;

  constructor(private categoria: CategoriaService, private base: BaseService, private registroPrecio: RegistroPrecioService, private producto: ProductoService) { }

  ngOnInit() {

    $('#filtrar').dropdown();
    this.categoria.getCategorias();
    this.producto.filtro = '';

  }

  aceptar() {

    if (this.formCompleto()) {
      var consulta = "UPDATE PRODUCTOS SET ";
      if (this.aumentar) {
        this.registroPrecio.unRegistroPrecio.operacion = '+';
      } else {
        this.registroPrecio.unRegistroPrecio.operacion = "-";
      }
      if (this.precio_costo) {
        this.registroPrecio.unRegistroPrecio.tipo_precio = "precio_costo";
      } else {
        this.registroPrecio.unRegistroPrecio.tipo_precio = "precio_venta";
      }
      if (this.porcentaje) {
        this.registroPrecio.unRegistroPrecio.valor = this.registroPrecio.unRegistroPrecio.valor / 100;
        this.registroPrecio.unRegistroPrecio.tipo_valor = 'Porcentaje';
        if (this.redondeo) {
          consulta += `${this.registroPrecio.unRegistroPrecio.tipo_precio} = case when mod((${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}),10) = 0 then (${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}) else case when mod((${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}),10) <= 5 then (${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}) - mod((${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}),10) else (${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}) + (10 - mod((${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor}),10)) end end `;
        } else {
          consulta += `${this.registroPrecio.unRegistroPrecio.tipo_precio} =  ${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} *${this.registroPrecio.unRegistroPrecio.valor} `;
        }
      } else {
        this.registroPrecio.unRegistroPrecio.tipo_valor = 'Monto';
        if (this.redondeo) {
          consulta += `${this.registroPrecio.unRegistroPrecio.tipo_precio} = case when mod(${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio},10) = 0 then ${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio} else case when mod(${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio},10) <= 5 then ${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio} - mod(${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio},10) else ${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio} ${this.registroPrecio.unRegistroPrecio.operacion} (10 - mod(${this.registroPrecio.unRegistroPrecio.valor} + ${this.registroPrecio.unRegistroPrecio.tipo_precio},10)) end end `;
        } else {
          consulta += `${this.registroPrecio.unRegistroPrecio.tipo_precio} = ${this.registroPrecio.unRegistroPrecio.valor} ${this.registroPrecio.unRegistroPrecio.operacion} ${this.registroPrecio.unRegistroPrecio.tipo_precio} `;
        }
      }
      if (this.registroPrecio.unRegistroPrecio.id_categoria) {
        consulta += ` where id_categoria = ${this.registroPrecio.unRegistroPrecio.id_categoria} `;
      }
      consulta += ";";
      let registro = `INSERT INTO REGISTRO_PRECIOS (fecha, operacion, tipo_valor, tipo_precio , valor, id_categoria) 
      VALUES (current_date, '${this.registroPrecio.unRegistroPrecio.operacion}', '${this.registroPrecio.unRegistroPrecio.tipo_valor}', '${this.registroPrecio.unRegistroPrecio.tipo_precio}', ${this.registroPrecio.unRegistroPrecio.valor}, ${this.registroPrecio.unRegistroPrecio.id_categoria});`;
      consulta += registro;
      $('#modificarPrecioProducto').modal('hide').modal('hide dimmer');
      this.vaciarForm();
      this.producto.modificarPrecioProducto(consulta);
    }
  }

  cancelar() {
    this.vaciarForm();
    $('#modificarPrecioProducto').modal('hide').modal('hide dimmer');
  }

  selectPercent() {
    this.monto = false;
    $("#iconoValor").removeClass("dollar sign");
    $("#iconoValor").addClass("percent");
  }

  selectMotno() {
    this.porcentaje = false;
    $("#iconoValor").removeClass("percent");
    $("#iconoValor").addClass("dollar sign");
  }

  selectAumentar() {
    this.bajar = false;
  }

  selectBajar() {
    this.aumentar = false;
  }

  selectPrecioCosto() {
    this.precio_venta = false;
  }

  selectPrecioVenta() {
    this.precio_costo = false;
  }

  setFiltro() {
    this.producto.setFiltro(this.registroPrecio.unRegistroPrecio.id_categoria);
  }

  formCompleto() {

    let ret = true;

    //Valor
    if (this.registroPrecio.unRegistroPrecio.valor == null || !this.base.isNumber(this.registroPrecio.unRegistroPrecio.valor) || this.registroPrecio.unRegistroPrecio.valor < 1) {
      ret = false;
      alertify.notify('Valor no válido', 'error', 5);
      return false;
    }

    return ret;

  }

  vaciarForm() {
    this.registroPrecio.unRegistroPrecio.valor = null;
    this.registroPrecio.unRegistroPrecio.id_categoria = null;
    this.porcentaje = true;
    this.monto = false;
    this.aumentar = true;
    this.bajar = false;
    this.producto.filtro = '';
    this.redondeo = false;
    $('#idFiltro').dropdown('set selected', '-1');
  }

}
