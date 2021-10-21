import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BaseService } from 'src/app/servicio/base.service';
import { EmpresaService } from 'src/app/servicio/empresa.service';
import { ItemService } from 'src/app/servicio/item.service';
import { VentaService } from 'src/app/servicio/venta.service';

declare var alertify: any;

@Component({
  selector: 'app-lista-item',
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css']
})
export class ListaItemComponent implements OnInit {

  constructor(private item: ItemService, private venta: VentaService, private base: BaseService, private ipc: ElectronService, private empresa: EmpresaService) { }

  ngOnInit() {
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
    let response = this.ipc.ipcRenderer.sendSync('print', data);
  }

}
