import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'; 

import swal from 'sweetalert';

@Component({
  selector: 'app-cart4',
  templateUrl: './cart4.component.html',
  styleUrls: ['./cart4.component.scss']
})

export class Cart4Component implements OnInit {
  params: any;
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



  constructor(private rutaActiva: ActivatedRoute) { }

  ngOnInit() {
    this.params = this.rutaActiva
    console.log('this.params: ', this.params.params.value.buf)
  }


  onSubmit(){
    swal("Enviando petición")
  }
}
