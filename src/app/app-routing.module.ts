import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomepageComponent } from './homepage/homepage.component';
import { Homepage2Component } from './homepage2/homepage2.component';
import { QuotesComponent } from './quotes/quotes.component';
import { QuotinmobileComponent } from './quotinmobile/quotinmobile.component';
import { Quotinmobile2Component } from './quotinmobile2/quotinmobile2.component';
import { Cart1Component } from './cart/cart1/cart1.component';
import { Cart2Component } from './cart/cart2/cart2.component';
import { Cart3Component } from './cart/cart3/cart3.component';

import { FaqsComponent } from './pages/faqs/faqs.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';


const routes: Routes = [
	//{ path: 'cotiza-tu-seguro-de-auto-por-kilometro', component: Homepage2Component },
	//{ path: 'cotiza-seguro-auto-mobile', component: QuotinmobileComponent },
	{ path: 'cotiza-seguro-auto-mobile2', component: Quotinmobile2Component },
	{ path: 'cotizaciones/:id', component: QuotesComponent },
	{ path: 'compra-kilometros/:id/:package', component: Cart1Component },
	{ path: 'compra-kilometros/:id/:package/2', component: Cart2Component },
	{ path: 'compra-kilometros/:id/:package/3', component: Cart3Component },
	{ path: 'preguntas-frecuentes' , component: FaqsComponent },
	{ path: 'acerca-de' , component: AboutComponent },
	{ path: 'terminos-y-condiciones', component: TermsComponent },	
	{ path: 'aviso-de-privacidad', component: PrivacyComponent },
	//Default
	{ path: '**', component: HomepageComponent }
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
