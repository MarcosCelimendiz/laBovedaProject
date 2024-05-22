import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css'
})
export class CartaComponent {
  
  entrantes:string[] = ['SELECCIÓN DE QUESOS','PIZZARRA JAMÓN DE BELLOTA','PIZZARRA CECINA DE LEÓN','ALCACHOFAS FRITAS','PASTEL DE BORRAJA','CREP DE MORCILLA','REVUELTO SETAS','HUEVOS CAMPEROS ROTOS','REVUELTO TRIGUEROS','ESPAGUETI PARMESANO','TARTAR DE ATÚN','STEAK TARTAR','PAN BAO RABO DE TORO','ZAMBURIÑAS'];
  ensaladas:string[] = ['EL ECCE-HOMO','LA TOLEDANA','EL MERCADO'];
  mar:string[] = ['TATAKI','PULPO A LA BRASA','PESCADO DEL DÍA'];
  carnes:string[] = ['CHULETÓN SELECCIÓN','ENTRECOT','SOLOMILLO TERNERA','COCHINILLO','MILANESA TRUFADA','CACHOPO"A"','CACHOPO"S"','CACHOPO"G"','CACHOPO"N"'];
  postres:string[] = ['TIRAMISÚ','TARTAR DE QUESOS','CREP NUTELLA','HELADOS EN BOLAS','SECRETO DE TURRÓN','DIVO DE LIMÓN','ENSALADA DE FRUTA']

  constructor(private http: HttpClient) {}

  downloadPDF() {
    const pdfUrl = 'assets/pdf/Carta_LB.pdf'; 
    const pdfName = 'carta_laboveda.pdf'; 

    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((blob) => {
      saveAs(blob, pdfName);
    }, error => {
      console.error('Error al descargar el PDF', error);
    });
  }

}
