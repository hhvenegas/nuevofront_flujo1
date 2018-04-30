import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent implements OnInit {
	title = 'Aviso de Privacidad - Seguro por kilómetro';
  constructor() { }

  ngOnInit() {
  }

}
