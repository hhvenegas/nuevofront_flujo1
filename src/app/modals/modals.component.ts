import { Component, OnInit } from '@angular/core';
declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  enviarContacto(){
  	$('#idModalSuccess').modal('toggle');
  	$('#idModalSuccessContact').modal('toggle');
  }

}
