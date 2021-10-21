import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Venta } from 'src/app/model/Venta';
import { BaseService } from 'src/app/servicio/base.service';
import { ItemService } from 'src/app/servicio/item.service';
import { VentaService } from 'src/app/servicio/venta.service';

declare var $: any;

@Component({
  selector: 'app-lista-venta',
  templateUrl: './lista-venta.component.html',
  styleUrls: ['./lista-venta.component.css']
})
export class ListaVentaComponent implements OnInit {

  constructor(private venta: VentaService, private item: ItemService, private base: BaseService, private ipc: ElectronService) { }

  ngOnInit() {
    var pantalla = $(window).height();
    pantalla = pantalla - 135;
    $('.pantalla').css('height', `${pantalla}px`);
    pantalla = pantalla - 240;
    $('.tabla-ventas').css('height', `${pantalla}px`);
    this.venta.getVentas();
    this.item.listadoItem = [];
  }

  eliminarVenta(unaVenta: Venta) {
    this.venta.unaVenta = unaVenta;
    $('#formBorrarVenta').modal({ closable: false }).modal('show');
  }

  buscarItems(unaVenta: Venta) {
    this.item.getItems(unaVenta);
    this.venta.unaVenta = unaVenta;
    $("#ventanaItems").modal("show");
  }

  buscarVentas() {
    if (this.venta.desde != "" && this.venta.hasta != "") {
      this.venta.getVentasEntreFechas(this.venta.desde, this.venta.hasta);
    }
  }

  abrirModalEstadisticas(){
    $('#estadisticasModal').modal({ closable: false }).modal('show');
  }

}