import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    PanelpoliciesComponent
  ],
  imports:[
  	CommonModule,
	  NgtUniversalModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
})
export class AppModule { }
