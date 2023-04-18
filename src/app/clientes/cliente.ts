import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {

    id: number;
    nombre: string;
    apellido: string;
    email: string;
    createAt: string;
    foto: string;
    region: Region;
    facturas: Factura[] = [];

}
