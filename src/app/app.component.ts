import { Component } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
  	constructor(meta: Meta, title: Title) {
  		title.setTitle('Seguro por kilometro - sxkm');
  		meta.addTags([
			{ name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
		  	{ name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
		  	{ name: 'description', content: 'SXKM - Ahorra en tu seguro de auto por kilometro pagando por kilómetro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
		]);
	}

}
