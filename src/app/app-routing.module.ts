import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';

const routes: Routes = [
	{ path: '', component: HomepageComponent },
	{ 
		path: 'cotizaciones/:tipo', 
		component: CotizacionesComponent ,
		data: {}
	},
	{ path: 'cotizacion/:id',      component: CotizacionesComponent },
	{
		path: 'homepage',
		component: HomepageComponent,
		data: { title: 'Heroes List'
		}
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