import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	title = 'Sxkm';
	id:any;
	fecha_vig_cotizacion:any;
	
	constructor() { }
	ngOnInit() {
		this.id = localStorage.getItem("id");
  		this.fecha_vig_cotizacion = localStorage.getItem("vigencia_cot");
	}

}
