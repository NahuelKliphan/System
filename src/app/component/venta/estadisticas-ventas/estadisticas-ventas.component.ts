import { Component, OnInit } from '@angular/core';
import { Venta } from 'src/app/model/Venta';
import { BaseService } from 'src/app/servicio/base.service';
import { VentaService } from 'src/app/servicio/venta.service';

declare var $: any;

@Component({
  selector: 'app-estadisticas-ventas',
  templateUrl: './estadisticas-ventas.component.html',
  styleUrls: ['./estadisticas-ventas.component.css']
})
export class EstadisticasVentasComponent implements OnInit {

  constructor(private venta: VentaService, private base: BaseService) { }

  date: string;
  listadoVenta: Venta[] = [];

  ngOnInit() {
    const date = new Date();
    const year = date.getFullYear();
    const month = Number(date.getMonth() + 1);
    this.date = year + "-" + (month <= 9 ? "0" + month : month);
    this.mostrarEstadisticas();
  }

  changeMonth($event) {
    this.date = $event;
    this.mostrarEstadisticas();
  }

  mostrarEstadisticas() {
    const dates = this.date.split('-');
    const year = dates[0];
    const month = dates[1];
    this.listadoVenta = this.venta.getVentasPorMes(month, year);
    this.venta.totalVentas = 0;
    this.venta.totalCostos = 0;
    this.venta.totalGanancias = 0;
    this.listadoVenta.forEach(venta => {
      this.venta.totalVentas += Number(venta.total);
      this.venta.totalGanancias += Number(venta.ganancia);
    });
    this.venta.totalCostos += Number(this.venta.totalVentas - this.venta.totalGanancias);
  }
}
