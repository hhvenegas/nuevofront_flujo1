import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QuotesComponent } from './quotes/quotes.component';
import { Homepage2Component } from './homepage2/homepage2.component';
import { Quotinmobile2Component } from './quotinmobile2/quotinmobile2.component';
import { QuotinmobileComponent } from './quotinmobile/quotinmobile.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    QuotesComponent,
    Homepage2Component,
    Quotinmobile2Component,
    QuotinmobileComponent,
    FaqsComponent,
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
    CartComponent
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
