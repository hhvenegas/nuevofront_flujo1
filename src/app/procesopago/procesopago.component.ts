import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-procesopago',
  templateUrl: './procesopago.component.html',
  styleUrls: ['./procesopago.component.css']
})
export class ProcesopagoComponent implements OnInit {
	title = 'SXKM - Comprar Plan';
  active=1;
  checkbox_dir_poliza=false;
  constructor() { }

  ngOnInit() {
  }
  next(){
  	var actual = this.active;
  	var siguiente = actual+1;

  	if($("#fieldset"+siguiente).length == 0) return false;
  	$("#fieldset"+actual).hide();
  	$("#fieldset"+siguiente).show();
  	this.active++;
  }
  changePoliza(){
    if(this.checkbox_dir_poliza) this.checkbox_dir_poliza=false;
    else this.checkbox_dir_poliza=true;
  }
}
