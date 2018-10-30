import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

import { HomepageComponent } from './homepage/homepage/homepage.component';
import { LoadingComponent } from './loading/loading.component';
import { Quotes1Component } from './quotes/quotes1/quotes1.component';
import { Quotes2Component } from './quotes/quotes2/quotes2.component';
import { Cart1Component } from './cart/cart1/cart1.component';
import { Cart2Component } from './cart/cart2/cart2.component';
import { Cart3Component } from './cart/cart3/cart3.component';

import { FaqsComponent } from './pages/faqs/faqs.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { PrensaComponent } from './pages/prensa/prensa.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TicketComponent } from './cart/ticket/ticket.component';
import { Loading1Component } from './loaders/loading1/loading1.component';
import { LoadingError1Component } from './loaders/loading-error1/loading-error1.component';
import { LoginComponent } from './pages/login/login.component';
import { PanelComponent } from './panel/panel/panel.component';
import { PanelquotesComponent } from './panel/panelquotes/panelquotes.component';
import { PanelpoliciesComponent } from './panel/panelpolicies/panelpolicies.component';
import { PaneluserComponent } from './panel/paneluser/paneluser.component';
import { PanelpolicyComponent } from './panel/panelpolicy/panelpolicy.component';
import { PanelcartComponent } from './panel/panelcart/panelcart.component';
import { UsersComponent } from './users/users.component';
import { PanelusersComponent } from './users/panelusers/panelusers.component';

const routes: Routes = [
	{ path: 'cotiza-tu-seguro-de-auto-por-kilometro', component: HomepageComponent },
	{ path: 'cotizando' , component: LoadingComponent },
	{ path: 'cotizaciones/:id', component: Quotes1Component },
	{ path: 'costo-paquetes-kilometros/:id', component: Quotes1Component },
	{ path: 'cotizaciones2/:id', component: Quotes2Component },
	{ path: 'compra-kilometros/:id/:package', component: Cart1Component },
	{ path: 'compra-kilometros/:id/:package/2', component: Cart2Component },
	{ path: 'compra-kilometros/:id/:package/3', component: Cart3Component },
	{ path: 'comprando' , component: Loading1Component },
	{ path: 'error/:id/:package', component: LoadingError1Component},
	{ path: 'ficha/:metodo/:store/:quote_id/:transaction_id', component: TicketComponent},
	{ path: 'ficha/:metodo/:quote_id/:transaction_id', component: TicketComponent},
	{ path: 'preguntas-frecuentes' , component: FaqsComponent },
	{ path: 'acerca-de' , component: AboutComponent },
	{ path: 'terminos-y-condiciones', component: TermsComponent },	
	{ path: 'aviso-de-privacidad', component: PrivacyComponent },
	{ path: 'prensa', component: PrensaComponent },
	{ path: 'contacto', component: ContactComponent },
	{ path: 'user/detalles/:id_car', component: UsersComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent},
	{ path: 'user', component: PanelusersComponent, canActivate: [AuthGuard]},
	{ path: 'panel', component: PanelComponent, canActivate: [AuthGuard]},
	{ path: 'panel/cotizaciones', component: PanelquotesComponent,canActivate: [AuthGuard]},
	{ path: 'panel/polizas', component: PanelpoliciesComponent, canActivate: [AuthGuard]},
	{ path: 'panel/perfil/editar/:user_id', component: PaneluserComponent, canActivate: [AuthGuard]},
	{ path: 'panel/poliza/editar/:policy_id', component: PanelpolicyComponent, canActivate: [AuthGuard] },
	{ path: 'panel/pago/:action/:id', component: PanelcartComponent, canActivate: [AuthGuard]},
	//Default
	{ path: '**', component: HomepageComponent }
	
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
