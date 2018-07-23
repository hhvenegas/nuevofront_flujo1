import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Api} from "../api.constants";
declare var $:any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
	name: 		     any = "";
	email: 		     any = "";
	cellphone: 	     any = "";
	message:	     any = "";
	error_name:      any = "";
	error_email:     any = "";
	error_cellphone: any = "";
	error_message:   any = "";
	constructor(private http: HttpClient) {}
	ngOnInit() {
		//console.log("HOLA");
	}
	onSubmit() {
		var siguiente = true;
		if(this.name==''){
			siguiente = false;
			this.error_name = "Ingresa tu nombre";
		} else{ this.error_name = "";}
		if(this.email==''){
	        siguiente = false;
	        this.error_email = "Ingresa tu email";
	    }else{
	        //validar si es correo 
	        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	        var serchfind = regexp.test(this.email);
	        //console.log(serchfind);
	        if(!serchfind){
	          siguiente = false;
	          this.error_email = "Ingresa un correo válido";
	        }
	        else this.error_email = "";
	    }
	    if(this.cellphone==''){
			siguiente = false;
			this.error_cellphone = "Ingresa tu celular";
		} else{ this.error_cellphone = "";}
		if(this.message==''){
			siguiente = false;
			this.error_message = "Escribe tu mensaje";
		} else{ this.error_message = "";}
		let form = {
			"name"		: this.name,
			"email"		: this.email,
			"cellphone"	: this.cellphone,
			"message"	: this.message
		}
		let form2 = {
  			"properties": {
  				"hola" : 1,
  				"adios": 2
  			},
  			"aqui": 22
		}
		console.log(form2);
		if(siguiente){
			this.http.post(Api.API_DOMAIN+'api/v1/web_services/quote_call_contact',form).subscribe(
      			(data: any) => {
					console.log(data);
					$("#idModalContact").modal("show");
					
				},
				(error: any) => {
					console.log(error);
				}
			);
		}
		else console.log("ERROR");
	}
}
