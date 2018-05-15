import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';
import { FichapagoComponent } from './fichapago/fichapago.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { AcercaComponent } from './acerca/acerca.component';
import { AvisoComponent } from './aviso/aviso.component';
import { TerminosComponent } from './terminos/terminos.component';

const routes: Routes = [
	//Homepage
	{ path: '', component: HomepageComponent },
	
	//Cotizador
	{
		path: 'v2-cotiza-tu-seguro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
	//Cotizador
	{
		path: 'cotiza-tu-seguro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
	{
		path: 'cotizar-seguro-auto-por-kilometro',
		component: CotizadorComponent
	},
	//Cotizaciones
	{
		path: 'costo-paquetes-kilometros/:tipo',
		component: CotizacionesComponent ,
		data: {
			title: "Cotizaciones flujo A"
		}
	},
	{ path: 'cotizaciones-seguro-de-auto-por-kilometro/:id',      component: CotizacionesComponent },

	//Carrito de compras
	{
		path: 'comprar-seguro-kilometro/:id',
		component: ProcesopagoComponent ,
		data: {}
	},
	//Pantalla de compra - Ficha de pago con tarjeta d
	{
		path: ':url/:id_quote/:id/ficha',
		component: FichapagoComponent ,
		data: {
		}
	},
	//Pantalla de centro de ayuda
	{
		path: 'preguntas-frecuentes',
		component: AyudaComponent ,
		data: {}
	},
	//Pantalla de Acerca De
	{
		path: 'acerca-de',
		component: AcercaComponent ,
		data: {}
	},
	//Aviso de privacidad
	{
		path: 'aviso-de-privacidad',
		component: AvisoComponent ,
		data: {}
	},
	//Términos y condiciones
	{
		path: 'terminos-y-condiciones',
		component: TerminosComponent ,
		data: {}
	},
	{
		path: 'error',
		redirectTo: '/heroes',
		pathMatch: 'full'
	},
	//Default
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
