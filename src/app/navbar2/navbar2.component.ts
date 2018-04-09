import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit {
	id:any;
	fecha_vig_cotizacion:any;
  constructor() { }

  ngOnInit() {
  	this.id = localStorage.getItem("id");
  	this.fecha_vig_cotizacion = localStorage.getItem("vigencia_cot");
  }

}
