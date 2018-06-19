import { Component, OnInit } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {
	constructor(meta: Meta, title: Title) { 
		title.setTitle('Términos y Condiciones - Seguro por kilómetro');
	    meta.addTags([
	      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
	      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
	      { name: 'description', content: 'Ahorra en tu seguro de auto pagando por kilometro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
	    ]);
  	}

  ngOnInit() {
  }

}
