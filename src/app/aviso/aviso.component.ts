import { Component, OnInit } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent implements OnInit {
	constructor(meta: Meta, title: Title) {
      title.setTitle('Aviso de Privacidad - Seguro por kilometro');
    	meta.addTags([
      		{ name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
        	{ name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
        	{ name: 'description', content: 'Su privacidad y confianza son muy importantes para nosotros, por tal motivo este Aviso de Privacidad (el “Aviso de Privacidad”) está diseñado para informar a nuestros clientes la forma en que se recaba la información y el uso que se le da a la misma, con el objeto de salvaguardar la privacidad, integridad, tratamiento y protección de sus datos personales, en apego a la Ley Federal de Protección de Datos Personales en Posesión de Particulares, el Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de Particulares y demás normatividad aplicable. ' }
    	]);
  }

  ngOnInit() {
  }

}
