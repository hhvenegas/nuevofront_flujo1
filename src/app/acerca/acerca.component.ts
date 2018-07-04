import { Component, OnInit } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";
declare var jQuery:any;
declare var $ :any;
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swiper from 'swiper';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  constructor(private router : Router,meta: Meta, title: Title) {
      title.setTitle('Acerca de - Seguro por kilometro');
      meta.addTags([
        {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
        { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
        { name: 'description', content: 'Somos la nueva forma de mantener tu auto siempre protegido y beneficiar tu economia. En SEGURO X KILOMETRO, trabajamos con tecnología de punta para ofrecerte un servicio innovador que, además de medir sólo los kilometros que recorres, ayudamos a que mejores tus hábitos de manejo.' }
      ]);
  }

  ngOnInit() {
    var url_string = this.router.url ;
    //console.log(url_string);
    //console.log("La url es: "+url_string);
    var mySwiper = new Swiper ('#swipe-container1', {
      slidesPerView: 1,
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,
      },
    });

    if(url_string=="/contacto"){
      $('body,html').stop(true,true).animate({        
        scrollTop: $("#contacto").offset().top
      },1000);
    }
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

