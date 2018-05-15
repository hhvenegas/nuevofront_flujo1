import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms'
declare var jQuery:any;
declare var $:any;


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
	url_production: any = "http://107.21.9.43/";
  	//url_production: any = "http://localhost:3000/";
	

	constructor(private http: HttpClient, private frmbuilder:FormBuilder) { 
	  	var url_string = window.location.href ;
	    var url = location.href.split( '/' );
	    var pago = url[3].split('-');
	    this.quote_id = url[4];
	    this.transaction_id = url[5];
	    var size_url = pago.length;
	    this.forma_pago = pago[size_url-1];
	    console.log("La url es: "+url_string);
	    console.log("Forma pago:"+this.forma_pago);
	    console.log("Quote:"+this.quote_id);
	    console.log("Transaction id:"+this.transaction_id);

	    this.get_quotation();
	    this.get_transaction();

	    if(this.forma_pago=="tarjeta"){
	    	this.message_ticket = "Recibirás el dispositivo PIA y tu póliza dentro de las próximas 24 horas. Te avisaremos por correo cuando vaya en camino.";
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

	ngOnInit() {
	}

	get_quotation(){
		var angular_this = this;
		this.http.get(angular_this.url_production+'api/v1/web_services/get_quotation?quote_id='+angular_this.quote_id).subscribe(
	      data => {
	      	angular_this.quotation = data;
	      	angular_this.kilometers_package_id = angular_this.quotation.quote.kilometers_package_id;
	        console.log(data);
	        console.log("Paqueteee: "+angular_this.kilometers_package_id);
	        angular_this.get_kilometers_package();
	      },
	      error => console.log(error)
	    );

	}
	get_transaction(){
		var angular_this = this;
		this.http.get(angular_this.url_production+'api/v1/web_services/get_transaction?transaction_id='+angular_this.transaction_id).subscribe(
	      data => {
	      	angular_this.transaction = data;
	      	angular_this.referencia = angular_this.transaction.payment_reference;
	      	angular_this.total_pagar = angular_this.transaction.total_amount;
	        console.log(data);
	      },
	      error => console.log(error)
	    );
	}
	get_kilometers_package(){
		var angular_this = this;
		this.http.get(angular_this.url_production+'api/v1/web_services/get_kilometers_package?kilometers_package_id='+angular_this.kilometers_package_id).subscribe(
	      data => {
	      	angular_this.kilometers_package = data;
	      	angular_this.km = angular_this.kilometers_package.kilometers;
	      	angular_this.vigencia = angular_this.kilometers_package.covered_months;
	      	//angular_this.total_package = (angular_this.total_pagar-299).toFixed(2);
	        console.log(data);
	        angular_this.quotation.cotizaciones.forEach( function(valor, indice, array) {
              if(valor.package==angular_this.km){
                angular_this.total_package = valor.cost_by_package.toFixed(2); //Falta de los packages que regresa
                //angular_this.totalPagar = valor.total_cost.toFixed(2); //Falta de los packages que regresa
              }
              //else inactiveCards(valor.package);
              //console.log("En el índice " + indice + " hay este valor: " + valor.id);
            });
	      },
	      error => console.log(error)
	    );
	}

}
