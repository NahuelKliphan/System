import { Item } from './Item';

export class Venta {

    id: number;
    cliente_nombre: string;
    fecha: Date;
    ganancia: number;
    subtotal: number;
    total: number;
    forma_pago: string;
    items: Item[];

    constructor(id: number, cliente_nombre: string, fecha: Date, total: number, subtotal: number, ganancia: number) {

        this.id = id;
        this.cliente_nombre = cliente_nombre;
        this.fecha = fecha;
        this.ganancia = ganancia;
        this.subtotal = subtotal;
        this.total = total;
        this.items = [];
        this.forma_pago = 'Debito';
    }

}