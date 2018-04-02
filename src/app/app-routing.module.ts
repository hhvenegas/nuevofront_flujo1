import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';

const routes: Routes = [
	{ path: '', component: HomepageComponent },
	{
		path: 'cotizaciones/:tipo',
		component: CotizacionesComponent ,
		data: {}
	},
	{
		path: 'comprar/:token',
		component: ProcesopagoComponent ,
		data: {}
	},
	{ path: 'cotizacion/:id',      component: CotizacionesComponent },
	{
		path: 'cotizar-seguro-auto-por-kilometro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
	{
		path: 'error',
		redirectTo: '/heroes',
		pathMatch: 'full'
	},
	{ path: '**', component: HomepageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
