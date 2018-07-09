import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms';
import { Meta, Title } from "@angular/platform-browser";
import {Api} from "../api.constants";

//import { ActivatedRoute } from '@angular/router';
//import { Location } from '@angular/common';
import * as $ from 'jquery';

// Declaramos las variables para jQuery
//declare var jQuery:any;
//declare var $:any;

import Swiper from 'swiper';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  casoActivo = 2;
  casoInactivo1 = 1;
  casoInactivo2 = 3;
  casoTitle='Carlos vive muy cerca de su trabajo';
  casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 250 km al mes y paga $100 MXN más $299 MXN de suscripción.';


  url_foto_caso_inactivo1="/assets/img/sxkm-caso-blanco1.jpg";
  url_foto_caso_inactivo2="/assets/img/sxkm-caso-blanco3.png";

  url_bn_caso1="/assets/img/sxkm-caso-blanco1.jpg";
  url_hover_caso1="/assets/img/sxkm-caso-color1.jpg";

  url_bn_caso2="/assets/img/sxkm-caso-blanco2.png";
  url_hover_caso2="/assets/img/sxkm-caso-color2.png";

  url_bn_caso3="/assets/img/sxkm-caso-blanco3.png";
  url_hover_caso3="/assets/img/sxkm-caso-color3.png";

  url_cotizar_btn = Api.COTIZADOR_V2;
  btn_cotizar:any=Api.COTIZADOR_V2;


  constructor(private frmbuilder:FormBuilder, meta: Meta, title: Title) {
    title.setTitle('Seguro por kilometro - SXKM');
    meta.addTags([
      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
      { name: 'description', content: 'Ahorra en tu seguro de auto pagando por kilometro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
    ]);
  }
  ngOnInit() {
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
        delay: 4000,
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
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    var mySwiper4 = new Swiper('#swipe-container4', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    var mySwiper5 = new Swiper('#swipe-container5', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
    var mySwiper6 = new Swiper('#swipe-container6', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 0,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  cambiarCaso(div,tipo){
    console.log("div:"+div+" y el tipo: "+tipo);
    var activo = this.casoActivo;
    var inactivo1 = this.casoInactivo1;
    var inactivo2 = this.casoInactivo2;

    if(tipo=="change"){
      if(div==1){
        this.casoActivo = inactivo1;
        this.casoInactivo1 = activo;
        if(activo==1) this.url_foto_caso_inactivo1 = this.url_bn_caso1; 
        if(activo==2) this.url_foto_caso_inactivo1 = this.url_bn_caso2 ;
        if(activo==3) this.url_foto_caso_inactivo1 = this.url_bn_caso3 ;
      }
      else{
        this.casoActivo = inactivo2;
        this.casoInactivo2 = activo;
        if(activo==1) this.url_foto_caso_inactivo2 = this.url_bn_caso1; 
        if(activo==2) this.url_foto_caso_inactivo2 = this.url_bn_caso2 ;
        if(activo==3) this.url_foto_caso_inactivo2 = this.url_bn_caso3 ;
      }
      if (this.casoActivo == 1) {
        this.casoTitle = 'Fernanda trabaja por su cuenta.';
        this.casoText = 'Generalmente usa su auto los fines de semana para salir de la Ciudad con su perro. Más o menos recorre 1000 km al mes y paga $217 MXN más $299 MXN de suscripción.';
      }
      if (this.casoActivo==2) {
        this.casoTitle='Carlos vive muy cerca de su trabajo.';
        this.casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 250 km al mes y paga $100 MXN más $299 MXN de suscripción.';
      }
      if (this.casoActivo==3) {
        this.casoTitle='En casa de Julio tienen tres coches.';
        this.casoText='Cuando se trata de salir en plan familiar la camioneta de su esposa es perfecta.\nRecorre muy pocos km al mes y ahora paga menos del 50% de lo que pagaba antes por su seguro.';
      }
    }
    if(tipo=="hover"){
      if(div==1){
        if(inactivo1==1) this.url_foto_caso_inactivo1 = this.url_hover_caso1; 
        if(inactivo1==2) this.url_foto_caso_inactivo1 = this.url_hover_caso2 ;
        if(inactivo1==3) this.url_foto_caso_inactivo1 = this.url_hover_caso3 ;
      }
      else{
        if(inactivo2==1) this.url_foto_caso_inactivo2 = this.url_hover_caso1; 
        if(inactivo2==2) this.url_foto_caso_inactivo2 = this.url_hover_caso2 ;
        if(inactivo2==3) this.url_foto_caso_inactivo2 = this.url_hover_caso3 ;
      }
    }
    if(tipo=="hoverout"){
      if(div==1){
        if(inactivo1==1) this.url_foto_caso_inactivo1 = this.url_bn_caso1; 
        if(inactivo1==2) this.url_foto_caso_inactivo1 = this.url_bn_caso2 ;
        if(inactivo1==3) this.url_foto_caso_inactivo1 = this.url_bn_caso3 ;
      }
      else{
        if(inactivo2==1) this.url_foto_caso_inactivo2 = this.url_bn_caso1; 
        if(inactivo2==2) this.url_foto_caso_inactivo2 = this.url_bn_caso2 ;
        if(inactivo2==3) this.url_foto_caso_inactivo2 = this.url_bn_caso3 ;
      }
    }
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
      let src = "https://www.youtube.com/embed/BnNa75vvN1Y?autoplay=1";
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
