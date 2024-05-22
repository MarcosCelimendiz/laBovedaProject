import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'laboveda';

  mostrarBoton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica la posición de desplazamiento
    if (window.scrollY > 100) { // Cambia 100 por la posición deseada en píxeles
      this.mostrarBoton = true;
    } else {
      this.mostrarBoton = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
