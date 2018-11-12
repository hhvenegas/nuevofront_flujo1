import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recargacompleta',
  templateUrl: './recargacompleta.component.html',
  styleUrls: ['./recargacompleta.component.scss']
})
export class RecargacompletaComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
		var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('forma_de_pago')){
			console.log("estaba presente")
      this.forma_pago = urlParams.get("forma_de_pago")
      this.total_pagar = urlParams.get("total")
      this.vigencia = urlParams.get("vigencia")
      this.km = urlParams.get("km")
			this.referencia = urlParams.get("referencia") 
			console.log(this.forma_pago)
    }
  }

}
