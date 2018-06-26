import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms';
import { Meta, Title } from "@angular/platform-browser";
import {Api} from "../api.constants";

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//import * as $ from 'jquery';

// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $:any;

import Swiper from 'swiper';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  casoTitle='Carlos vive muy cerca de su trabajo';
  casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 250 km al mes y paga $100 MXN más $299 MXN de suscripción.';
  url_cotizar_btn = Api.COTIZADOR_V2;
  btn_cotizar:any=Api.COTIZADOR_V2;

  constructor( private router: ActivatedRoute, private location: Location,private http: HttpClient, private frmbuilder:FormBuilder, meta: Meta, title: Title) {
    title.setTitle('Seguro por kilometro - SXKM');
    meta.addTags([
      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
      { name: 'description', content: 'Ahorra en tu seguro de auto pagando por kilometro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
    ]);
  }
  ngOnInit() {
    console.log("url: "+this.router.url);
    var url_string = this.router.url ;
    console.log(url_string);
    //if(url_string==Api.HOMEPAGE_V2){
    //  this.url_cotizar_btn = Api.HOMEPAGE_V2+"#cotiza-tu-seguro";
    //}
    
    let angular_this = this;
    this.ocultar();

    var mySwiper = new Swiper ('#swipe-container1', {
      slidesPerView: 2,
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
    var mySwiper2 = new Swiper ('#swipe-container2', {
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
    var mySwiper3 = new Swiper('#swipe-container3', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    var mySwiper4 = new Swiper('#swipe-container4', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    var mySwiper5 = new Swiper('#swipe-container5', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  ocultar(){
    $("#idCaso1Image1").hide();
    $("#idCaso1Image3").hide();
    $("#idCaso2Image1").hide();
    $("#idCaso2Image2").hide();
    $("#idCaso3Image2").hide();
    $("#idCaso3Image3").hide();
  }
  // action triggered when user swipes
  swipe(carousel, action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      $("#"+carousel).carousel('prev');
      console.log("Derecha");
    }
    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      $("#"+carousel).carousel('next');
      console.log("Izquierda");
    }
  }
  casoChange(div,number){
    var active = $("#idCaso1ImageActive").val();
    $("#idCaso"+div+"Image"+number).hide();
    for (var i = 1; i <= 3; i++) {
      $("#idCaso1Image"+i).hide();
    }
    $("#idCaso1Image"+number).show();
    $("#idCaso"+div+"Image"+active).show();
    $("#idCaso1ImageActive").val(number);


    if (number == 1) {
      this.casoTitle = 'Fernanda trabaja por su cuenta.';
      this.casoText = 'Generalmente usa su auto los fines de semana para salir de la Ciudad con su perro. Más o menos recorre 1000 km al mes y paga $217 MXN más $299 MXN de suscripción.';
    }
    if (number==2) {
      this.casoTitle='Carlos vive muy cerca de su trabajo.';
      this.casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 250 km al mes y paga $100 MXN más $299 MXN de suscripción.';
    }
    if (number==3) {
      this.casoTitle='En casa de Julio tienen tres coches.';
      this.casoText='Cuando se trata de salir en plan familiar la camioneta de su esposa es perfecta.\nRecorre muy pocos km al mes y ahora paga menos del 50% de lo que pagaba antes por su seguro.';
    }
  }
  casoHover(div,number){
      if(number==1)
        $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-color"+number+".jpg");
      else
        $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-color"+number+".png");
  }
  casoHoverOut(div,number){
      if(number==1)
        $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-blanco"+number+".jpg");
      else
        $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-blanco"+number+".png");
  }
  ejecutarClick(id,id_ant){
      $("#"+id).trigger("click");
      $("#"+id+"2").trigger("click");
      $("#"+id_ant).removeClass('active');
      $("#"+id).addClass('active');
      $("#"+id_ant+"2").removeClass('active');
      $("#"+id+"2").addClass('active');
  }
  comenzarVideo(){
      let src = "https://www.youtube.com/embed/MIdM9qOMCrU?autoplay=1";
      $('#idModalVideo iframe').attr('src', src);
  }
  siguiente(){
    $('body,html').stop(true,true).animate({        
      scrollTop: $("#pantalla2").offset().top
    },1000);
  }

  subir(){
    $('body,html').stop(true,true).animate({        
       scrollTop: 0
    },1000);
  }
}
