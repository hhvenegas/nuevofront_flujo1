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
	
	vid_parent:any = "";
	vid:       any = "";
	hapikey:   any = "ec0cc8b8-e6fd-4c0c-a562-1d177783cb18";
	form:      any = Array();
	form2:      any = Array();
	name:	   any = "";
	email:	   any = "";
	constructor(private http: HttpClient) { }
	ngOnInit() {
		localStorage.removeItem("vid");
  	}

  	hubspot(){
  		//Verificamos si hay sesion pendiente
  		this.vid = localStorage.getItem("vid");
  		console.log("VID: "+this.vid);

  		//Se crea el form a enviar
  		this.form = {
  			"properties": [
			    {
			      "property": "firstname",
			      "value": this.name
			    }
			]
  		}
  		this.form2 = {
  			"properties": [
			    {
			      "property": "firstname",
			      "value": this.name
			    },
			    {
			      "property": "email",
			      "value": this.email
			    }
			]
  		}
  		console.log(this.form);

  		if(!this.vid){
  			this.create_contact();
  		}
  		else{
  			console.log("hay una sesion");
  			this.update_contact_vid();
  		}
  	}

  	create_contact(){
  		console.log("Se crea contacto");
  		let url = "https://api.hubapi.com/contacts/v1/contact/?hapikey="+this.hapikey;
  		this.http.post(url,this.form).subscribe(
      		(data: any) => {
				localStorage.setItem("vid",data.vid);
				console.log(data);
			},
			(error: any) => {
				console.log(error);
				console.log(error.error.error);
				if(error.error.error=='CONTACT_EXISTS'){
					this.get_contact_email();
				}
			}
		);
  	}

  	get_contact_email(){
  		console.log("Obtener contacto email");
  		let url = "https://api.hubapi.com/contacts/v1/contact/email/"+this.email+"/profile?hapikey="+this.hapikey;
  		//"vid": 3234574
  		this.http.get(url).subscribe(
      		(data: any) => {
				this.vid_parent = data.vid
				console.log(data.vid);
				this.merge_contacts();
			},
			(error: any) => {
				console.log(error.error.error);
			}
		);
  	}
  	update_contact_vid(){
  		console.log("Modificar contacto vid");
  		let url = "https://api.hubapi.com/contacts/v1/contact/vid/"+this.vid+"/profile?hapikey="+this.hapikey;
  		this.http.post(url,this.form2).subscribe(
      		(data: any) => {
				//localStorage.setItem("vid",data.vid);
				console.log(data);
			},
			(error: any) => {
				//console.log(error);
				//console.log(error.error.error);
				if(error.error.error=='CONTACT_EXISTS')
					this.get_contact_email();
			}
		);
  	}
  	merge_contacts(){
  		console.log("Merge de contactos");
  		let url = "https://api.hubapi.com/contacts/v1/contact/merge-vids/"+this.vid_parent+"/?hapikey="+this.hapikey;
  		let form = {
  			"vidToMerge": this.vid
  		}
  		console.log(form);
  		this.http.post(url,form).subscribe(
      		(data: any) => {
      			console.log(data);
			},
			(error: any) => {
				console.log(error);
				if(error.status==200 && error.text=='SUCCESS'){
					localStorage.removeItem("vid");
					this.vid_parent = "";
					this.vid = "";
				}
			}
		);
  	}


}
