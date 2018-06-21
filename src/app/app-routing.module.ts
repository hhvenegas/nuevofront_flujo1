import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcercaComponent } from './acerca/acerca.component';
import { AvisoComponent } from './aviso/aviso.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { FichapagoComponent } from './fichapago/fichapago.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PreguntasfrecuentesComponent } from './preguntasfrecuentes/preguntasfrecuentes.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';
import { TerminosComponent } from './terminos/terminos.component';  


//const routes: Routes = [];
const routes: Routes = [
	//Homepage
	{ path: 'seguro-de-auto-por-kilometro', component: HomepageComponent },
	//Cotizador
	{
		path: 'cotiza-tu-seguro-de-auto-por-kilometro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
	//Cotizador
	{
		path: 'cotiza-tu-seguro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
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
		path: ':url/:id_quote/:id/ticket',
		component: FichapagoComponent ,
		data: {
		}
	},
	//Pantalla de centro de ayuda
	{
		path: 'preguntas-frecuentes',
		component: PreguntasfrecuentesComponent ,
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
