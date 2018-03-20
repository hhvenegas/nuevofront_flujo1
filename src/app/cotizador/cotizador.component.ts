import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent implements OnInit {
	title = 'Sxkm- Cotizaciones A';
  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    console.log(token);
    this.get_quotation(token)
   }

  ngOnInit() {
  }

  get_quotation(token){
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data)
      },
      error => console.log(error)  // error path
    );
  }

}
