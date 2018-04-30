import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
	title = 'Centro de Ayuda - Seguro por kilómetro';
  constructor(private http: HttpClient) { }

  ngOnInit() {
  	$('body').scrollspy({ target: '#navbar-example' })
  }

}
