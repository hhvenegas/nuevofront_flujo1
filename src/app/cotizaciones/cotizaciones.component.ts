import { Component, OnInit , Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import {Api} from "../api.constants";

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import * as $ from 'jquery';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
  tipo_flujo = Api.TIPO_FLUJO; //Distinguir si es el caso A o B de las cotizaciones
  /** Valores para caso A **/
  idActive= 1000;

  id_quote:any;
  id:any;
  year : any ;
  maker : any ;
  url_foto: any;
  model: any;
  model_first :string="";
  version: any;
  zip_code: any;
  birth_date: any;
  gender: any;
  email: any;
  cellphone: any;
  packages: any;
  cotizacion: any;
  token: any;
  fecha_vig_cotizacion: any;
  fecha_boolean:any;
  precio_km: any;
  precio_km_selected:any;
  //Plan seleccionado
  package_select: any;
  vigency_select: any;
  precio_select: any;

  //HUBSPOT
  vid_parent:any = "";
  vid:       any = "";
  form:      any = Array();
  vistas_cotizaciones: number = 1;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router : Router, private http: HttpClient, meta: Meta, title: Title) { 
    title.setTitle('Cotizaciones de seguro de auto por kilometro - Seguro por kilometro');
    meta.addTags([
      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
      { name: 'description', content: 'Ahorra en tu seguro de auto pagando por kilometro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
    ]);
  }
  ngOnInit() {
    var url_string = this.router.url ;
    var splitted = url_string.split("/");
    this.id_quote = splitted[2];
    this.get_quotation();
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
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem("ref"))
        console.log(localStorage.getItem("ref"));
      if(localStorage.getItem("promo_code"))
        console.log(localStorage.getItem("promo_code"));
    }
  }

  get_quotation(){
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+this.id_quote).subscribe(
      (data:any) =>{
        console.log(data);
        if(data.quote.promo_code){
          localStorage.setItem("promo_code",data.quote.promo_code);
        }
        this.cotizacion = data;
        this.year=this.cotizacion.aig.year;
        this.maker=this.cotizacion.aig.maker;
        this.url_foto= "/assets/img/makers/"+this.cotizacion.aig.maker+".png";
        this.model=this.cotizacion.aig.model;
        this.version=this.cotizacion.aig.version;
        this.zip_code=this.cotizacion.quote.zipcode_id;
        this.precio_km = this.cotizacion.quote.cost_by_km.toFixed(2);

        var fecha_hoy = new Date();
        var fecha_vig_cot = new Date(this.cotizacion.fecha_vigencia);

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        this.fecha_vig_cotizacion = fecha_vig_cot.toLocaleDateString("es-ES", options)
        if(fecha_vig_cot >= fecha_hoy)
          this.fecha_boolean=true;
        else  this.fecha_boolean=false;
        this.packages=this.cotizacion.cotizaciones;
        this.precio_km = this.cotizacion.quote.cost_by_km;
        this.packages.forEach( item => {
          if(item.package==250){
            this.package_select = item.package;
            this.vigency_select = item.vigency;
            this.precio_select  = item.cost_by_package;
          }
        });
        console.log(this.packages);
        this.get_contact_email();
      },
      error => console.log(error)  // error path
    );
  }
  cambiarPlan(id){
    this.packages.forEach( item => {
      if(item.package==id){
        this.package_select=item.package;
        this.vigency_select=item.vigency;
        this.precio_select=item.cost_by_package;
      }
    });
  }

  cambiarActivo(id){
    this.idActive = id;
    this.package_select=id;
  }

  //HUBSPOT
  hubspot(){
    let cotizaciones = "";
    this.form = Array();
    let form = Array();

    this.packages.forEach( 
      item => {
        cotizaciones+="Paquete "+item.package+": $"+item.cost_by_package+"\n";
      }
    );
    //Datos para enviar a cotizador
    form.push(
      {
        "property": "email",
        "value": this.cotizacion.quote.email
      }
    );
    form.push(
      {
        "property": "cost_by_km",
        "value": this.cotizacion.quote.cost_by_km
      }
    );
    
    form.push(
      {
        "property": "cotizaciones",
        "value": cotizaciones
      }
    );
    form.push(
      {
        "property": "vistas_cotizaciones",
        "value": this.vistas_cotizaciones
      }
    );
    this.form = {
      "properties": form
    }
    console.log(this.form);
    this.update_contact_vid();
  }
  get_contact_email(){
    console.log("Obtener contacto email");
    let url = "https://api.hubapi.com/contacts/v1/contact/email/"+this.cotizacion.quote.email+"/profile?hapikey="+Api.HAPIKEY;
    this.http.get(url).subscribe(
      (data: any) => {
        console.log(data);
        this.vid = data.vid
        this.vistas_cotizaciones += +data.properties.vistas_cotizaciones.value;
        this.hubspot();
      },
      (error: any) => {
        console.log(error.error.error);
      }
    );
  }
  update_contact_vid(){
      console.log("Modificar contacto vid");
      let url = "https://api.hubapi.com/contacts/v1/contact/vid/"+this.vid+"/profile?hapikey="+Api.HAPIKEY;
      this.http.post(url,this.form).subscribe(
          (data: any) => {
          //localStorage.setItem("vid",data.vid);
          console.log(data);
        },
        (error: any) => {
          console.log(error);
          //console.log(error.error.error);
          //if(error.error.error=='CONTACT_EXISTS')
            //this.get_contact_email();
        }
      );
  }
}