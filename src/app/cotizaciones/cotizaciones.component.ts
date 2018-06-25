import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
declare var jquery:any;
declare var $ :any;
import {Api} from "../api.constants";

import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
	// constant for swipe action: left or right
  	SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  	tipo_flujo = Api.TIPO_FLUJO; //Distinguir si es el caso A o B de las cotizaciones
  	/** Valores para caso A **/
  	idActive= 1000;
  	//colExt = 10;
  	//col = 3; //Tamaño de las columnas
  	col=2;
  	colExt=12;

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

	constructor(private router : Router, private http: HttpClient, meta: Meta, title: Title) { 
		title.setTitle('Cotizaciones de seguro de auto por kilometro - Seguro por kilometro');
	    meta.addTags([
	      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
	      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
	      { name: 'description', content: 'Ahorra en tu seguro de auto pagando por kilometro. Protege tu auto con todos los beneficios de un seguro de cobertura amplia y el respaldo de AIG.' }
	    ]);
	}

  	ngOnInit() {
  		var url_string = this.router.url ;
      console.log(url_string);
      console.log("La url es: "+url_string);
      var splitted = url_string.split("/");
      console.log("id: "+splitted[2]);
	    //var token = url.searchParams.get("token");
	    this.id_quote = splitted[2];
      console.log("Es el id:"+this.id_quote);
	    //this.token= token;
	    this.get_quotation();
	    var angular_this = this;
  		/**Valores para caso B**/
  		if(this.tipo_flujo==2){
  			this.idActive=1000;
  			this.col=2;
  			this.colExt=12;
  		}
      $('body,html').stop(true,true).animate({        
        scrollTop: 0
      },1000);
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

  	cambiarActivo(number){
      function activeCards(number){
        $("#idPaqueteHeader"+number).removeClass("inactive");
        $("#idPaqueteHeader"+number).removeClass("inactive");
        $("#idPaqueteBody"+number).removeClass("inactive");
        $("#idPaqueteBodyPrice"+number).removeClass("span-price-paquetes");
        $("#idPaqueteFooter"+number).removeClass("inactive");
        $("#idPaqueteBoton"+number).removeClass("btn-gray");


        $("#idPaqueteHeader"+number).addClass("active2");
        $("#idPaqueteBody"+number).addClass("active2");
        $("#idPaqueteBodyPrice"+number).addClass("span-price-paquetes-active");
        $("#idPaqueteFooter"+number).addClass("active2");
        $("#idPaqueteFooter"+number).addClass("card-footer-active ");
        $("#idPaqueteBoton"+number).addClass("btn-green");
        $("#idPaquete"+number).addClass("active-card");
      }
      function inactiveCards(number){
        $("#idPaqueteHeader"+number).removeClass("active2");
        $("#idPaqueteBody"+number).removeClass("active2");
        $("#idPaqueteBodyPrice"+number).removeClass("span-price-paquetes-active");
        $("#idPaqueteFooter"+number).removeClass("active2");
        $("#idPaqueteFooter"+number).removeClass("card-footer-active ");
        $("#idPaqueteBoton"+number).removeClass("btn-green");
        $("#idPaquete"+number).removeClass("active-card");


        $("#idPaqueteHeader"+number).addClass("inactive");
        $("#idPaqueteBody"+number).addClass("inactive");
        $("#idPaqueteBodyPrice"+number).addClass("span-price-paquetes");
        $("#idPaqueteFooter"+number).addClass("inactive");
        $("#idPaqueteBoton"+number).addClass("btn-gray");
      }
      this.packages.forEach( function(valor, indice, array) {
          if(valor.package==number) activeCards(valor.package);
          else inactiveCards(valor.package);
          //console.log("En el índice " + indice + " hay este valor: " + valor.package);
      });
  	}

  get_quotation(){
    console.log("Cotizacion:) "+this.id_quote);
    var angular_this = this;
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+angular_this.id_quote).subscribe(
      data => {
        console.log(data);
        this.cotizacion = data;
        //this.id = this.cotizacion.id;
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
        console.log("Fecha vigencia: "+this.fecha_vig_cotizacion);
        if(fecha_vig_cot >= fecha_hoy)
          this.fecha_boolean=true;
        else  this.fecha_boolean=false;
        this.packages=this.cotizacion.cotizaciones;
        this.packages.forEach( function(valor, indice, array) {
          if(indice==0){
            angular_this.precio_km = valor.cost_by_package;
            angular_this.package_select = valor.package;
            angular_this.vigency_select = valor.vigency;
            angular_this.precio_select  = valor.cost_by_package;
          }
          if(angular_this.precio_km > valor.cost_by_km)
            angular_this.precio_km = valor.cost_by_km;
          console.log(valor.cost_by_km);
        });
        
      },
      error => console.log(error)  // error path
    );
  }

  cambiarPlan(id){
    console.log(id);
    var angular_this = this;
    this.packages.forEach( function(valor, indice, array) {
      if(id==valor.package){
        angular_this.package_select=valor.package;
        angular_this.vigency_select=valor.vigency;
        angular_this.precio_select=valor.cost_by_package;
        console.log("En el índice " + indice + " hay este valor: " + valor.package);
      }
    });

  }

}
