import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {
  quote_id:any;
  nombre:any;
  cellphone:any;
  url_produccion:any="http://localhost:3000/";
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  enviarContacto(){
    var angular_this = this;
    angular_this.quote_id=localStorage.getItem('quote_id');
    console.log("Model quote: "+angular_this.quote_id);
    let form = {
      quote_id: angular_this.quote_id,
      nombre: angular_this.nombre,
      cellphone: angular_this.cellphone
    }
    if(angular_this.quote_id!="" && angular_this.nombre!="" &&angular_this.cellphone!=""){
      this.http.post(angular_this.url_produccion+'api/v1/web_services/quote_call_contact/',form).subscribe(
          data => {
            $('#idModalSuccess').modal('toggle');
            $('#idModalSuccessContact').modal('toggle');
          },
          error => angular_this.closeModal()  // error path
      );
    }
  }
  closeModal(){
    $('#idModalError').modal('toggle');
  }

}
