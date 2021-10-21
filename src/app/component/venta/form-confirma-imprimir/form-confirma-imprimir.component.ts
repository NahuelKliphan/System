import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { EmpresaService } from 'src/app/servicio/empresa.service';
import { ItemService } from 'src/app/servicio/item.service';
import { VentaService } from 'src/app/servicio/venta.service';

declare var $: any;

@Component({
  selector: 'app-form-confirma-imprimir',
  templateUrl: './form-confirma-imprimir.component.html',
  styleUrls: ['./form-confirma-imprimir.component.css']
})
export class FormConfirmaImprimirComponent implements OnInit {

  constructor(private item: ItemService, private ipc: ElectronService, private empresa: EmpresaService, private venta: VentaService) { }

  ngOnInit() {
  }

  cancelar() {
    this.item.listadoItem = [];
    $('#formImrpimirVenta').modal('hide');
  }

  imprimir() {
    var data = {
      empresa_nombre: this.empresa.unaEmpresa.nombre,
      empresa_direccion: this.empresa.unaEmpresa.direccion,
      empresa_logo: this.empresa.unaEmpresa.logo_imprimir,
      venta_subtotal: this.venta.unaVenta.subtotal,
      venta_total: this.venta.unaVenta.total,
      venta_forma_pago: this.venta.unaVenta.forma_pago,
      listado: [...this.item.listadoItem]
    }
    this.ipc.ipcRenderer.sendSync('print', data);
    this.item.listadoItem = [];
    $('#formImrpimirVenta').modal('hide');
  }

}
