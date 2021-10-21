import { Component, OnInit } from '@angular/core';
import { Venta } from 'src/app/model/Venta';
import { VentaService } from 'src/app/servicio/venta.service';

declare var $: any;

@Component({
  selector: 'app-form-borrar-venta',
  templateUrl: './form-borrar-venta.component.html',
  styleUrls: ['./form-borrar-venta.component.css']
})
export class FormBorrarVentaComponent implements OnInit {

  constructor(private venta: VentaService) { }

  ngOnInit() {
  }

  borrar() {
    $('#formBorrarVenta').modal('hide');
    this.venta.borrarVenta(this.venta.unaVenta);
    this.vaciarCampos();
  }

  cancelar() {
    $('#formBorrarVenta').modal('hide');
    this.vaciarCampos();
  }

  vaciarCampos() {
    this.venta.unaVenta = new Venta(null, null, new Date(), 0, 0, 0);
  }

}