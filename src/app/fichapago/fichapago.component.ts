import { Component, OnInit , Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms'
import {Api} from "../api.constants";
import { Meta, Title } from "@angular/platform-browser";
declare var jQuery:any;
declare var $:any;
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-fichapago',
  templateUrl: './fichapago.component.html',
  styleUrls: ['./fichapago.component.css']
})
export class FichapagoComponent implements OnInit {
	forma_pago: any;
	message_ticket: any;
	message_ticket2: any;
	quote_id:any;
	quotation: any;
	kilometers_package_id: any;
	kilometers_package: any;
	km: any;
	vigencia: any;
	transaction_id:any;
	transaction:any;
	referencia: any = "";
	total_pagar: any="";
	total_package: any;


	//HUBSPOT
	vid_parent:any = "";
	vid:       any = "";
	form:      any = Array();
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private http: HttpClient,private router : ActivatedRoute, private frmbuilder:FormBuilder,meta: Meta, title: Title) {
		title.setTitle('Ficha de pago - Seguro por kilometro');
	    meta.addTags([
	      {name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
	      { name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
	      { name: 'description', content: 'Seguro de auto por kilometro' }
	    ]);
	}
	ngOnInit() {
		this.quote_id = this.router.snapshot.params['id_quote'];
    	this.transaction_id = this.router.snapshot.params["id"];
		this.forma_pago = this.router.snapshot.params["pago"];
	    this.get_quotation();
	    this.get_transaction();

	    if(this.forma_pago=="tarjeta"){
	    	this.message_ticket = "Recibirás el dispositivo PIA y tu póliza dentro de las próximas 72 horas. Te avisaremos por correo cuando vaya en camino.";
	    	this.message_ticket2 = 'El pago aparecerá en tu estado de cuenta como **SXKM.';
	    }
	    if(this.forma_pago!="tarjeta" && this.forma_pago!="spei"){
	    	this.message_ticket = "Acude a tu tienda más cercana y muestra en la caja la siguiente referencia para realizar tu pago.";
	    	this.message_ticket2 = this.forma_pago+" cobra una comisión de $10 pesos por recibir tu pago.";
	    }
	    if(this.forma_pago=="spei"){
	    	this.message_ticket ="Desde tu banca en línea realiza una transferencia interbancaria con los siguientes datos.";
	    }
	}
	get_quotation(){
		this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+this.quote_id).subscribe(
	      (data:any) => {
	      	this.quotation = data;
	      	this.kilometers_package_id = this.quotation.quote.kilometers_package_id;
	        this.get_kilometers_package();
	      },
	      error => console.log(error)
	    );
	}
	get_transaction(){
		this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_transaction?transaction_id='+this.transaction_id).subscribe(
	      (data:any) => {
	      	this.transaction = data;
	      	this.referencia = this.transaction.payment_reference;
	      	this.total_pagar = this.transaction.total_amount;
	      },
	      error => console.log(error)
	    );
	}
	get_kilometers_package(){
		this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_kilometers_package?kilometers_package_id='+this.kilometers_package_id).subscribe(
	      (data:any) => {
	      	this.kilometers_package = data;
	      	this.km = this.kilometers_package.kilometers;
	      	this.vigencia = this.kilometers_package.covered_months;
	      	
	      	this.quotation.cotizaciones.forEach( item => {
		        if(item.package==this.km){
			        console.log(item);
			        this.total_package = item.cost_by_package.toFixed(2);
			    }
	        });
	        this.validar_token_hubspot();

	      },
	      error => console.log(error)
	    );
	}
	//HUBSPOT
	hubspot(){
		let cotizaciones = "";
		this.form = Array();
		let form = Array();
	    //Datos para enviar a cotizador
	    form.push(
	      {
	        "property": "kilometros_paquete",
	        "value": this.km
	      }
	    );
	    
	    this.form = {
	      "properties"  : form,
	      "access_token": localStorage.getItem("access_token"),
	      "vid": this.vid
	    }
	    console.log(this.form);
	    this.update_contact_vid();
	}
	validar_token_hubspot(){
	    let token = localStorage.getItem("access_token");
	    let url = Api.API_DOMAIN+"api/v1/web_services/hubspot_validate_token?access_token="+token;
	    console.log(token)
	    this.http.get(url).subscribe(
	      (data: any) => {
	        if(data.token){
	          localStorage.setItem("access_token",data.token);
	          this.get_contact_email();
	        }
	        else this.refresh_token_hubspot();
	      },
	      (error: any) => {
	        localStorage.removeItem("access_token");
	        this.refresh_token_hubspot();
	      }
	    );
	}

	refresh_token_hubspot(){
	    let url = Api.API_DOMAIN+"api/v1/web_services/hubspot_refresh_token";
	    this.http.get(url).subscribe(
	      (data: any) => {
	        localStorage.setItem("access_token",data.access_token);
	        this.get_contact_email();
	      },
	      (error: any) => {
	        console.log(error);
	        localStorage.removeItem("access_token");
	      }
	    );
	}
	get_contact_email(){
		let email = this.quotation.quote.email;
	    let url = Api.API_DOMAIN+"api/v1/web_services/hubspot_get_contact?email="+email+"&access_token="+localStorage.getItem("access_token");
	    this.http.get(url).subscribe(
	      (data: any) => {
	        console.log(data);
	        if(data.vid!=null){
	          this.vid = data.vid
	          this.hubspot();
	        }
	      },
	      (error: any) => {
	        console.log(error);
	      }
	    );
	}
	  
	update_contact_vid(){
	    let url = Api.API_DOMAIN+"api/v1/web_services/hubspot_update_contact";
	    this.http.post(url,this.form).subscribe(
	      (data: any) => {
	        console.log("Estoy en update")
	        console.log(data)
	      },
	      (error: any) => {
	        console.log("Estoy en error de update")
	        console.log(error);
	      }
	    );
	}

}
