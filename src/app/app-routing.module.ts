import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomepageComponent } from './homepage/homepage.component';
import { Homepage2Component } from './homepage2/homepage2.component';
import { QuotesComponent } from './quotes/quotes.component';


const routes: Routes = [
	{ path: 'cotiza-tu-seguro-de-auto-por-kilometro', component: Homepage2Component },
	{ path: 'cotizaciones/:id', component: QuotesComponent },
	//Default
	{ path: '**', component: HomepageComponent }
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
