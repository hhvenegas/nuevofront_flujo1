import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Api} from "../api.constants";
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
	constructor(private http: HttpClient) { }
	ngOnInit() {
		localStorage.removeItem("vid");
  }
}
