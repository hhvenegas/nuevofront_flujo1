import { Component, OnInit } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";
declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  constructor(meta: Meta, title: Title) {
      title.setTitle('Acerca de - Seguro por kilometro');
      meta.addTags([
        {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
        { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
        { name: 'description', content: 'Somos la nueva forma de mantener tu auto siempre protegido y beneficiar tu economia. En SEGURO X KILOMETRO, trabajamos con tecnología de punta para ofrecerte un servicio innovador que, además de medir sólo los kilometros que recorres, ayudamos a que mejores tus hábitos de manejo.' }
      ]);
  }

  ngOnInit() {
  }
  // action triggered when user swipes
  swipe(carousel, action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      $("#"+carousel).carousel('prev');
      console.log("DErecha");
    }
    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      $("#"+carousel).carousel('next');
      console.log("Izquierda0");
    }
  }

}
