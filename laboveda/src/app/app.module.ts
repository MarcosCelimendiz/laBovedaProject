import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { QuienSomosComponent } from './componentes/quien-somos/quien-somos.component';
import { CartaComponent } from './componentes/carta/carta.component';
import { ReservasComponent } from './componentes/reservas/reservas.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { AvisoLegalComponent } from './componentes/aviso-legal/aviso-legal.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { GaleriaRestauranteComponent } from './componentes/galeria-restaurante/galeria-restaurante.component';
import { GaleriaPlatosComponent } from './componentes/galeria-platos/galeria-platos.component';
import { ErrorComponent } from './componentes/error/error.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselComponent } from './componentes/inicio/carousel/carousel.component';
import { JefeComponent } from './componentes/inicio/jefe/jefe.component';
import { InstalacionesComponent } from './componentes/inicio/instalaciones/instalaciones.component';
import { PlatosComponent } from './componentes/inicio/platos/platos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { StarRatingComponent } from './componentes/star-rating/star-rating.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    InicioComponent,
    QuienSomosComponent,
    CartaComponent,
    ReservasComponent,
    ContactoComponent,
    AvisoLegalComponent,
    PiePaginaComponent,
    GaleriaRestauranteComponent,
    GaleriaPlatosComponent,
    ErrorComponent,
    CarouselComponent,
    JefeComponent,
    InstalacionesComponent,
    PlatosComponent,
    UsuarioComponent,
    LoginComponent,
    RegistroComponent,
    StarRatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
