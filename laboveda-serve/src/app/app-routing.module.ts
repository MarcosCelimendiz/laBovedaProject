import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasComponent } from './paginas/reservas/reservas.component';
import { ReservaComponent } from './paginas/reserva/reserva.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';

const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  {path:'reservas', component:ReservasComponent},
  {path: 'reserva/:id', component: ReservaComponent},
  {path:'**', pathMatch:  'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
