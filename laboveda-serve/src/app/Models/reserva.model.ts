export class ReservaModel{
    id: string = '';
    nombre: string = '';
    apellido: string = '';
    gmail: string = '';
    tel: string = '';
    diaReserva: Date = new Date();
    horaResrva: string = 'Seleccione la hora';
    comensales: string = 'Seleccione una mesa';
    conocido:string = '';
    peticion:string = '';

    constructor(){}

}