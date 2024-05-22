import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { QuienSomosComponent } from './componentes/quien-somos/quien-somos.component';
import { CartaComponent } from './componentes/carta/carta.component';
import { GaleriaRestauranteComponent } from './componentes/galeria-restaurante/galeria-restaurante.component';
import { GaleriaPlatosComponent } from './componentes/galeria-platos/galeria-platos.component';
import { ReservasComponent } from './componentes/reservas/reservas.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';

const routes: Routes = [
  {path: "inicio", component: InicioComponent},
  {path: "quien-somos", component: QuienSomosComponent},
  {path: "carta", component: CartaComponent},
  {path: "galeria-restaurante", component: GaleriaRestauranteComponent},
  {path: "galeria-platos", component: GaleriaPlatosComponent},
  {path: "reservas", component: ReservasComponent},
  {path: "contacto", component: ContactoComponent},
  {path: "usuario", component: UsuarioComponent},
  {path: 'login'   , component: LoginComponent },
  {path: 'registro', component: RegistroComponent },
  {path: "**", pathMatch: 'full', redirectTo:"inicio"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
