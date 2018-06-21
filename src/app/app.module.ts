import { WindowModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    TerminosComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    WindowModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class AppModule { }
