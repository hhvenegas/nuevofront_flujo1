import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { Cart1Component } from './cart/cart1/cart1.component';
import { Cart2Component } from './cart/cart2/cart2.component';
import { Cart3Component } from './cart/cart3/cart3.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage/homepage.component';
import { LoadingComponent } from './loading/loading.component';
import { Quotes1Component } from './quotes/quotes1/quotes1.component';
import { Quotes2Component } from './quotes/quotes2/quotes2.component';
import { PrensaComponent } from './pages/prensa/prensa.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TicketComponent } from './cart/ticket/ticket.component';
import { Loading1Component } from './loaders/loading1/loading1.component';
import { LoadingError1Component } from './loaders/loading-error1/loading-error1.component';
import { PanelquotesComponent } from './panel/panelquotes/panelquotes.component';
import { PanelComponent } from './panel/panel/panel.component';
import { LoginComponent } from './pages/login/login.component';
import { PanelpoliciesComponent } from './panel/panelpolicies/panelpolicies.component';
import { PaneluserComponent } from './panel/paneluser/paneluser.component';
import { PanelpolicyComponent } from './panel/panelpolicy/panelpolicy.component';
import { PanelcartComponent } from './panel/panelcart/panelcart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersComponent } from './users/users.component';
import { PanelusersComponent } from './users/panelusers/panelusers.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RecargacompletaComponent } from './users/recargacompleta/recargacompleta.component';
import { MensualidadcompletaComponent } from './users/mensualidadcompleta/mensualidadcompleta.component';
import { MensualidadesComponent } from './users/mensualidades/mensualidades.component';
import { RechargeComponent } from './users/recharge/recharge.component';
import { RecargaComponent } from './users/recarga/recarga.component';
import { CarupdateComponent } from './users/carupdate/carupdate.component';
import { PanelticketComponent } from './panel/panelticket/panelticket.component';
import { PerfilComponent } from './panel/perfil/perfil.component';
import { PanelpromotionsComponent } from './panel/panelpromotions/panelpromotions.component';
import { PanelsellersComponent } from './panel/panelsellers/panelsellers.component';
import { DevicesComponent } from './panel/devices/devices.component';
import { PanelcalldetailsComponent } from './panel/panelcalldetails/panelcalldetails.component';
import { Landing2Component } from './homepage/landing2/landing2.component';
import { PerfiluserComponent } from './users/perfiluser/perfiluser.component';
import { AppoliciesComponent } from './panel/apPolicies/appolicies.component';
import { PanelapPoliciesComponent } from './panelap-policies/panelap-policies.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PayMembershipComponent } from './pay-membership/pay-membership.component';
import { PanelCollectionComponent } from './panel/panel-collection/panel-collection.component';
import { SendCollectionComponent } from './panel/panel-collection/send-collection/send-collection.component';
import { MonitorComponent } from './monitor/monitor.component';
import { SinistersComponent } from './sinisters/sinisters.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FaqsComponent,
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
    Cart1Component,
    Cart2Component,
    Cart3Component,
    FooterComponent,
    HomepageComponent,
    LoadingComponent,
    Quotes1Component,
    Quotes2Component,
    PrensaComponent,
    ContactComponent,
    TicketComponent,
    Loading1Component,
    LoadingError1Component,
    PanelquotesComponent,
    PanelComponent,
    LoginComponent,
    PanelpoliciesComponent,
    PaneluserComponent,
    PanelpolicyComponent,
    PanelcartComponent,
    UsersComponent,
    PanelusersComponent,
    RecargacompletaComponent,
    MensualidadcompletaComponent,
    MensualidadesComponent,
    RechargeComponent,
    RecargaComponent,
    CarupdateComponent,
    PanelticketComponent,
    PerfilComponent,
    PanelpromotionsComponent,
    PanelsellersComponent,
    DevicesComponent,
    PanelcalldetailsComponent,
    Landing2Component,
    PerfiluserComponent,
    AppoliciesComponent,
    PanelapPoliciesComponent,
    PayMembershipComponent,
    PanelCollectionComponent,
    SendCollectionComponent,
    MonitorComponent,
    SinistersComponent
  ],
  imports:[
  	CommonModule,
    AutocompleteLibModule,
	  NgtUniversalModule,
    NgxPaginationModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
  //providers: [{ provide: LOCALE_ID, useValue: 'es-Ar' }],//
})
export class AppModule { }
