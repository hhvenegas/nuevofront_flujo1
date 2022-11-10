import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/utils/app-constants';

@Component({
  selector: 'app-mensualidadcompleta',
  templateUrl: './mensualidadcompleta.component.html',
  styleUrls: ['./mensualidadcompleta.component.scss']
})
export class MensualidadcompletaComponent implements OnInit {

  readonly AppConstants = AppConstants

  forma_pago: any;
  monthly_payment: any;
  referencia: any;
  
  constructor() { }

  ngOnInit() {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('forma_de_pago')){
			console.log("estaba presente")
      this.forma_pago = urlParams.get("forma_de_pago")
      this.monthly_payment = urlParams.get("total")
			this.referencia = urlParams.get("referencia") 
			console.log(this.forma_pago)
    }
  }

}
