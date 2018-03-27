import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent implements OnInit {
	title = 'Sxkm- Cotizaciones A';
  tipo ='B'; //Distinguir si es el caso A o B de las cotizaciones
  /** Valores para caso A **/
  idActive= 1;
  colExt = 10;
  col = 3; //Tamaño de las columnas


  year : any ;
  maker : any ;
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

  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    this.token= token;
    this.get_quotation(token);
   }

  	ngOnInit() {

  		/**Valores para caso B**/
  		if(this.tipo=='B'){
  			this.idActive=1000;
  			this.col=2;
  			this.colExt=12;
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


        $("#idPaqueteHeader"+number).addClass("active");
        $("#idPaqueteBody"+number).addClass("active");
        $("#idPaqueteBodyPrice"+number).addClass("span-price-paquetes-active");
        $("#idPaqueteFooter"+number).addClass("active");
        $("#idPaqueteFooter"+number).addClass("card-footer-active ");
        $("#idPaqueteBoton"+number).addClass("btn-green");
        $("#idPaquete"+number).addClass("active-card");
      }
      function inactiveCards(number){
        $("#idPaqueteHeader"+number).removeClass("active");
        $("#idPaqueteBody"+number).removeClass("active");
        $("#idPaqueteBodyPrice"+number).removeClass("span-price-paquetes-active");
        $("#idPaqueteFooter"+number).removeClass("active");
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

  get_quotation(token){
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data);
        this.cotizacion=data;
        this.year=this.cotizacion.year;
        this.maker=this.cotizacion.maker_name;
        this.model=this.cotizacion.car_model_name;
        this.version=this.cotizacion.version_name;
        this.zip_code=this.cotizacion.zipcode;
        var packages=JSON.parse(this.cotizacion.packages);
        this.packages=packages.costs_by_km;
        if(this.cotizacion.id%2==0) this.tipo='A';
        else this.tipo='B';
      },
      error => console.log(error)  // error path
    );
  }

}
