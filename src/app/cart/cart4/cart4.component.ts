import { Component, OnInit } from '@angular/core';

import swal from 'sweetalert';
import { param } from 'jquery';

@Component({
  selector: 'app-cart4',
  templateUrl: './cart4.component.html',
  styleUrls: ['./cart4.component.scss']
})
export class Cart4Component implements OnInit {
  checkbox_terminos: boolean = false;
  total_cost: any = null;
  quotation:any;
  pago: string = "tarjeta";
  card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
  };
  card_id: any = "";



  constructor() { }

  ngOnInit() {
    const params = new URLSearchParams(window.location.search)
    console.log('params: ', params)
  }

  onSubmit(){
    swal("Enviando petición")
  }
}
