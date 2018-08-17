import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './auth/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AcercaComponent } from './acerca/acerca.component';
import { AvisoComponent } from './aviso/aviso.component';
import { PreguntasfrecuentesComponent } from './preguntasfrecuentes/preguntasfrecuentes.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { FichapagoComponent } from './fichapago/fichapago.component';
import { FooterComponent } from './footer/footer.component';
import { ModalsComponent } from './modals/modals.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';
import { TerminosComponent } from './terminos/terminos.component';
import { PrensaComponent } from './prensa/prensa.component';
import { PruebaComponent } from './prueba/prueba.component';
import { CompraComponent } from './compra/compra.component';
import { BlogComponent } from './blog/blog.component';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { ContactoComponent } from './contacto/contacto.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AcercaComponent,
    AvisoComponent,
    PreguntasfrecuentesComponent,
    CotizacionesComponent,
    CotizadorComponent,
    FichapagoComponent,
    FooterComponent,
    ModalsComponent,
    NavbarComponent,
    ProcesopagoComponent,
    TerminosComponent,
    PrensaComponent,
    PruebaComponent,
    CompraComponent,
    BlogComponent,
    LoginComponent,
    PanelComponent,
    ContactoComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [ AppComponent ],
  providers: [AuthGuard]
})
export class AppModule { }
