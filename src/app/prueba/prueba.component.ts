import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Api} from "../api.constants";
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
	id_quote:any=108;
	id_package:any=1;
	constructor(private http: HttpClient) { }
	ngOnInit() {
	  	//var url_string = this.router.url ;
	    //console.log(url_string);
	    //console.log("La url es: "+url_string);
	    //var splitted = url_string.split("/");
	  	//var url_string = window.location.href ;
	    //var url = new URL(url_string);
	    //this.id_quote = this.router.snapshot.params['id'];
	    //this.id_package = this.router.snapshot.params["plan"];
	    //console.log("id: "+this.id_quote);
	    //console.log("plan: "+this.id_package);
	    this.get_quotation();
  	}
  	ocultar(){
  		$("#id_btn_button").html('<i class="fas fa-angle-up"></i>');
  	}

  	get_quotation(){
	    console.log("Cotizacion: "+this.id_quote);
	    var angular_this = this;
	    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+angular_this.id_quote).subscribe(
	      data => {
	        console.log(data);
	        /**
	        angular_this.cotizacion=data;
	        angular_this.email = angular_this.cotizacion.quote.email;
	        angular_this.maker = angular_this.cotizacion.aig.maker;
	        angular_this.year  = angular_this.cotizacion.aig.year;
	        angular_this.model = angular_this.cotizacion.aig.model;
	        angular_this.version= angular_this.cotizacion.aig.version;
	        angular_this.url_foto = '/assets/img/makers/'+angular_this.maker+'.png';
	        angular_this.telefono = angular_this.cotizacion.quote.cellphone;
	        this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_kilometers_package?kilometers_package_id='+angular_this.id_package).subscribe(
	          data2 => {
	            console.log("Holi");
	            console.log(data2);
	            var kilometers_package:any = data2;
	            angular_this.km = kilometers_package.kilometers;
	            angular_this.vigencia = kilometers_package.covered_months;
	            angular_this.cotizacion.cotizaciones.forEach( function(valor, indice, array) {
	              if(valor.package==angular_this.km){
	                angular_this.costo_package = valor.cost_by_package.toFixed(2); //Falta de los packages que regresa
	                angular_this.totalPagar = valor.total_cost.toFixed(2); //Falta de los packages que regresa
	              }
	              //else inactiveCards(valor.package);
	              //console.log("En el índice " + indice + " hay este valor: " + valor.id);
	            });
	          },
	          error2 => console.log(error2)
	        );
	        console.log("cp:"+angular_this.cotizacion.quote.zipcode_id);
	        this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_zipcodeid?zipcode_id='+angular_this.cotizacion.quote.zipcode_id).subscribe(
	          data2 => {
	            console.log(data2);
	            var zipcode:any = data2;
	            angular_this.zip_code = zipcode.zipcode;
	            angular_this.colonia  = zipcode.suburb;
	            angular_this.municipio= zipcode.municipality;
	            angular_this.estado   = zipcode.state;
	          },
	          error2 => console.log(error2)
	        );
	        **/
	      },
	      error => console.log(error)
	    );
	  }


}
