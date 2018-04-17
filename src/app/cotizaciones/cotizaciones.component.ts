import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
	title = 'Sxkm- Cotizaciones B';
  tipo_flujo = 2; //Distinguir si es el caso A o B de las cotizaciones
  /** Valores para caso A **/
  idActive= 1000;
  //colExt = 10;
  //col = 3; //Tamaño de las columnas
  col=2;
  colExt=12;


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
  precio_km: any;


  //Plan seleccionado
  package_select: any;
  vigency_select: any;
  precio_select: any;

  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    this.token= token;
    this.get_quotation(token);
   }

  	ngOnInit() {
      var angular_this = this;
  		/**Valores para caso B**/
  		if(this.tipo_flujo==2){
  			this.idActive=1000;
  			this.col=2;
  			this.colExt=12;
  		}
      this.fecha_vig_cotizacion = localStorage.getItem("vigencia_cot");
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
      var angular_this = this;
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data);
        this.cotizacion=data;
        this.id = this.cotizacion.id;
        this.year=this.cotizacion.year;
        this.maker=this.cotizacion.maker_name;
        this.url_foto= "/assets/img/makers/"+this.cotizacion.maker_name+".png";
        this.model=this.cotizacion.car_model_name;
        this.version=this.cotizacion.version_name;
        this.zip_code=this.cotizacion.zipcode;
        var packages=JSON.parse(this.cotizacion.packages);
        this.packages=packages.costs_by_km;

        this.packages.forEach( function(valor, indice, array) {
          if(indice==0){
            angular_this.precio_km = valor.cost_by_km;
            angular_this.package_select = valor.package;
            angular_this.vigency_select = valor.vigency;
            angular_this.precio_select  = valor.cost_by_package;
          }
          if(angular_this.precio_km > valor.cost_by_km)
            angular_this.precio_km = valor.cost_by_km;
          console.log(valor.cost_by_km);
        });
        //Vigencia de la cotizacon
        var fecha_cotizacion = new Date(this.cotizacion.created_at);
        var vig_cot = fecha_cotizacion.getTime()+(2*24*60*60*1000);
        var fecha_vig_cot = new Date (vig_cot);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        
        console.log("Fechaa cot:"+fecha_cotizacion);
        console.log("Fechaa vig cot:"+fecha_vig_cot);
        console.log("Precio por km:"+this.precio_km);
        localStorage.setItem("id", this.id);
        localStorage.setItem("vigencia_cot", fecha_vig_cot.toLocaleDateString("es-ES", options));
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
