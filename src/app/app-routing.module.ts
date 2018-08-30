import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomepageComponent } from './homepage/homepage.component';
import { Homepage2Component } from './homepage2/homepage2.component';
import { QuotesComponent } from './quotes/quotes.component';
import { QuotinmobileComponent } from './quotinmobile/quotinmobile.component';
import { Quotinmobile2Component } from './quotinmobile2/quotinmobile2.component';


const routes: Routes = [
	{ path: 'cotiza-tu-seguro-de-auto-por-kilometro', component: Homepage2Component },
	{ path: 'cotiza-seguro-auto-mobile', component: QuotinmobileComponent },
	{ path: 'cotiza-seguro-auto-mobile2', component: Quotinmobile2Component },
	{ path: 'cotizaciones/:id', component: QuotesComponent },
	//Default
	{ path: '**', component: HomepageComponent }
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
