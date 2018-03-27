import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-procesopago',
  templateUrl: './procesopago.component.html',
  styleUrls: ['./procesopago.component.css']
})
export class ProcesopagoComponent implements OnInit {
	title = 'SXKM - Comprar Plan';
  active=1;
  checkbox_dir_poliza=false;

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
  package: any;
  cotizacion: any;
  token: any;

  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    var plan  = url.searchParams.get("plan");
    this.token= token;
    this.get_quotation(token,plan);
  }

  ngOnInit() {
  }
  next(){
  	var actual = this.active;
  	var siguiente = actual+1;

  	if($("#fieldset"+siguiente).length == 0) return false;
  	$("#fieldset"+actual).hide();
  	$("#fieldset"+siguiente).show();
  	this.active++;
  }
  changePoliza(){
    if(this.checkbox_dir_poliza) this.checkbox_dir_poliza=false;
    else this.checkbox_dir_poliza=true;
  }

  get_quotation(token,plan){
      var pos=0;
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data);
        console.log("Plan:"+plan);
        this.cotizacion=data;
        this.year=this.cotizacion.year;
        this.maker=this.cotizacion.maker_name;
        this.model=this.cotizacion.car_model_name;
        this.version=this.cotizacion.version_name;
        this.zip_code=this.cotizacion.zipcode;
        var packages=JSON.parse(this.cotizacion.packages);
        this.packages=packages.costs_by_km;
        this.packages.forEach( function(valor, indice, array) {
          if(valor.package==plan){
            pos = indice;
            $("#idPackageKm").html(valor.package+" km");
            if(valor.vigency==1) $("#idPackageVigency").html("( 1 mes de vigencia)");
            else  $("#idPackageVigency").html("( "+valor.vigency+" meses de vigencia)");
            $("#idPackageCostPackage").html("$"+valor.cost_by_package);
            $("#idPackageTotal").html("$"+valor.total_cost.toFixed(2));
            //$("#idPackageTotal2").html('<button type="button" class="btn btn-green" id="idPackageTotal2" >Pagar $5,000</button>');
            //console.log("En el índice " + indice + " hay este valor: " + valor.package);
          }
        });
        this.package=this.packages[pos];
        console.log(this.package);
      },
      error => console.log(error)  // error path
    );
  }
}
