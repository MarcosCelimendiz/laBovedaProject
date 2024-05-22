import { Component, OnInit } from '@angular/core';
import { ResenaModel } from '../../Models/resena.model';
import { ResenasService } from '../../services/resenas.service';
import Notiflix from 'notiflix';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quien-somos',
  templateUrl: './quien-somos.component.html',
  styleUrls: ['./quien-somos.component.scss']
})
export class QuienSomosComponent implements OnInit {
  resena: ResenaModel = new ResenaModel();
  resenas: ResenaModel[] = [];
  resenasChunks: ResenaModel[][] = [];
  mostrarOtraPantalla: boolean = false;

  constructor(private datePipe: DatePipe, private resenasService: ResenasService) {}

  ngOnInit(): void {
    this.resenasService.getResenas().subscribe(resp => {
      this.resenas = resp;
      this.resenas.sort((a, b) => new Date(b.diaResena).getTime() - new Date(a.diaResena).getTime());
      const lastTwoReviews = this.resenas.slice(0, 2);
      this.resenasChunks = this.chunkArray(lastTwoReviews, 2);
    });
  }
  
  

  guardar(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAllAsTouched();
      });
      Notiflix.Notify.failure('Por favor, complete todos los campos obligatorios.');
      return;
    }

    Notiflix.Loading.dots('Creando reseña...', {
      svgColor: 'rgba(244,204,123,255)'
    });

    let peticion: Observable<any>;
    const fechaResena: Date | null = this.datePipe.transform(this.resena.diaResena, 'yyyy-MM-dd') as Date | null;

    if (fechaResena !== null) {
      this.resena.diaResena = fechaResena;
    } else {
      console.error('Error al convertir la fecha seleccionada a Date');
      Notiflix.Loading.remove();
      Notiflix.Notify.failure('Error al procesar la fecha.');
      return;
    }

    peticion = this.resenasService.crearResena(this.resena);
    peticion.subscribe(
      (resp: ResenaModel) => {
        this.cerrarPantalla();
        Notiflix.Loading.remove();
        Notiflix.Notify.success('Reseña creada');
        form.reset();
        window.location.reload();
      },
      error => {
        console.error('Error al crear la reseña:', error);
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('Error al crear la reseña.');
      }
    );
  }

  mostrarPantalla() {
    this.mostrarOtraPantalla = true;
  }

  cerrarPantalla() {
    this.mostrarOtraPantalla = false;
  }

  actualizarValoracion(valoracion: number) {
    this.resena.valoracion = valoracion;
  }

  verMas() {
    const reseñasAAgregar = 2;
    const indiceInicio = this.resenasChunks.length * reseñasAAgregar;
    
    if (indiceInicio < this.resenas.length) {
      const nuevasResenas = this.resenas.slice(indiceInicio, indiceInicio + reseñasAAgregar);
      if (nuevasResenas.length > 0) {
        this.resenasChunks.push(...this.chunkArray(nuevasResenas, 2));
      } else {
        console.log('No hay más reseñas disponibles');
      }
    } else {
      console.log('No hay más reseñas disponibles');
    }
  }
  


  // Función para dividir un array en grupos de tamaño dado
  chunkArray(array: any[], size: number): any[][] {
    return array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);
  }
}
