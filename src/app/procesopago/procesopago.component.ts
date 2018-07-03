import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Api} from "../api.constants";
declare var jQuery:any;
declare var $:any;
declare var OpenPay:any;

import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-procesopago',
  templateUrl: './procesopago.component.html',
  styleUrls: ['./procesopago.component.css']
})
export class ProcesopagoComponent implements OnInit {
	//Formas de pago
  forma_pago: any = 1;
  tiendas:any = [
    { id: 1, urlname: "oxxo", name: 'Oxxo' , urlfoto: "/assets/img/forma_pago/oxxo.png"},
    { id: 2, urlname: "7eleven", name: '7-eleven' , urlfoto: "/assets/img/forma_pago/7eleven.png"},
    { id: 3, urlname: "extra", name: 'Extra' , urlfoto: "/assets/img/forma_pago/extra.png"},
    { id: 4, urlname: "circlek", name: 'K' , urlfoto: "/assets/img/forma_pago/circlek.png"},
    { id: 5, urlname: "walmart", name: 'Walmart' , urlfoto: "/assets/img/forma_pago/walmart.png"},
    { id: 6, urlname: "aurrera", name: 'Bodega Aurrerá', urlfoto: "/assets/img/forma_pago/aurrera.png" },
    { id: 7, urlname: "superama", name: 'Superama' , urlfoto: "/assets/img/forma_pago/superama.png"},
    { id: 8, urlname: "ahorro", name: 'Farmacias del Ahorro' , urlfoto: "/assets/img/forma_pago/ahorro.png"},
    { id: 9, urlname: "guadalajara", name: 'Farmacias Guadalajara', urlfoto: "/assets/img/forma_pago/guadalajara.png" },
    { id: 10, urlname: "sams", name: 'Sams' , urlfoto: "/assets/img/forma_pago/sams.png"},
    { id: 11, urlname: "benavides",name:"Farmacias Benavides", urlfoto: "/assets/img/forma_pago/benavides.png"},
    { id: 12, urlname: "waldos",name:"Waldos", urlfoto: "/assets/img/forma_pago/waldos.png"},
    { id: 13, urlname: "al-super",name:"Al Super", urlfoto: "/assets/img/forma_pago/al-super.png"},
    { id: 14, urlname: "asturiano",name:"Asturiano", urlfoto: "/assets/img/forma_pago/asturiano.png"},
    { id: 15, urlname: "airpak",name:"Air Pak", urlfoto: "/assets/img/forma_pago/airpak.png"},
    { id: 16, urlname: "kiosko",name:"Kiosko", urlfoto: "/assets/img/forma_pago/kiosko.png"},
    { id: 17, urlname: "maxilana",name:"Maxilana", urlfoto: "/assets/img/forma_pago/maxilana.png"},
    { id: 18, urlname: "multi-recargas",name:"Multi Recargas", urlfoto: "/assets/img/forma_pago/multi-recargas.png"},
    { id: 19, urlname: "prendamex",name:"Prenda Mex", urlfoto: "/assets/img/forma_pago/prendamex.png"},
    { id: 20, urlname: "red-efectiva",name:"Red Efectiva", urlfoto: "/assets/img/forma_pago/red-efectiva.png"},
    { id: 21, urlname: "te-creemos",name:"Te Creemos", urlfoto: "/assets/img/forma_pago/te-creemos.png"},
    { id: 22, urlname: "gestopago",name:"Gestopago", urlfoto: "/assets/img/forma_pago/gestopago.png"}
    
  ]

  //Datos del cliente
  nombre:any;
  apellidos:any;
  email:any;

  //Datos del vehiculo
  year : any ;
  maker : any ;
  url_foto: any;
  model: any;
  version: any;
  placas: any = "";

  //Datos de la cotizacion
  id_quote: any;
  id_package: any;
  cotizacion: any; //Cotizacion
  packages: any; //Todos los paquetes de la cotizacion 

  //Datos del plan seleccionado
  package: any; //Paquete seleccionado
  km: any;
  vigencia: any;
  costo_suscripcion: any = 299;
  costo_package: any;
  totalPagar: any;
  precio_km: any;

  zipcodes: any;
  //Formulario
  active=1;
  checkbox_dir_poliza=false;
  checkbox_factura: any = false; 
  form_data:any;
  //Datos de Contacto del Usuario
  calle: any="";
  interior:any="";
  zip_code: any="";
  colonia: any="";
  municipio: any="";
  estado: any="";
  telefono: any="";

  //Datos de Entrega de dispositivo PIA
  calle2: any="";
  interior2:any="";
  zip_code2: any="";
  colonia2: any="";
  municipio2: any="";
  estado2: any="";
  telefono2: any="";

  //Datos de facturación
  rfc: any="";
  razon_social:any="";
  calle3: any="";
  interior3:any="";
  exterior3:any="";
  zip_code3: any="";
  colonia3: any="";
  municipio3: any="";
  estado3: any="";
  telefono3: any="";

  //OpenPay
  card_name:any="";
  card:any="";
  year_expiration:any="";
  years_card:any="";
  month_expiration:any="";
  cvv:any="";
  token_openpay:any="";
  openpay_card_pay:any="";
  deviceIdHiddenFieldName:any="";
  payment_method: any = "card";
  store_selected:any ="";

  //Transaccion
  respuesta: any;
  transaction: any;
  transaction_id: any;

  //clases para errores
  error_name_card:any = "";
  error_card:any="";
  error_vigency_card:any="";
  error_cvv:any="";
  error_terminos: any="";
  //errores labels
  error_label_name_card:any = "";
  error_label_card:any="";
  error_label_vigency_card:any="";
  error_label_cvv:any="";
  error_label_tiendas: any = "";
  input_check1=false;
  error_checkbox1:   any = "";

  constructor(private router : ActivatedRoute,private http: HttpClient) {
  }

  ngOnInit() {
    var url_string = this.router.url ;
    console.log(url_string);
    console.log("La url es: "+url_string);
    //var splitted = url_string.split("/");
  	//var url_string = window.location.href ;
    //var url = new URL(url_string);
    this.id_quote = this.router.snapshot.params['id'];
    this.id_package = this.router.snapshot.params["plan"];
    console.log("id: "+this.id_quote);
    console.log("plan: "+this.id_package);
    this.get_quotation();
    this.years_card = [
      {year: 18},
      {year: 19},
      {year: 20},
      {year: 21},
      {year: 22},
      {year: 23},
      {year: 24},
      {year: 25},
      {year: 26},
      {year: 27},
      {year: 28},
      {year: 29},
      {year: 30},
      {year: 31},
      {year: 32},
      {year: 33},
      {year: 34},
      {year: 35},
      {year: 36},
      {year: 37},
      {year: 38},
      {year: 39},
      {year: 40}
    ]
  }

  clickAccordion(){
    console.log("Accordion");
    $('#accordion').on('hidden.bs.collapse', function () {
      $("#span-icon-header-collapse").html('<i class="fas fa-angle-down">');
    });
    $('#accordion').on('shown.bs.collapse', function () {
      $("#span-icon-header-collapse").html('<i class="fas fa-angle-up">');
    });
  }
  changePoliza(){
    if(this.checkbox_dir_poliza){
      this.checkbox_dir_poliza=false;
      this.zip_code2 = this.zip_code;
      this.calle2 = this.calle;
      this.interior2 = this.interior;
      this.colonia2 = this.colonia;
      this.municipio2 = this.municipio;
      this.estado2 = this.estado;
    }
    else{ 
      this.checkbox_dir_poliza=true;
      this.zip_code2 = "";
      this.calle2 = "";
      this.interior2 = "";
      this.colonia2 = "";
      this.municipio2 = "";
      this.estado2 = "";
    }
  }
  changeFactura(){
    if(this.checkbox_factura) this.checkbox_factura=false;
    else this.checkbox_factura=true;
    console.log("Se requiere facura: "+this.checkbox_factura);
  }

  get_quotation(){
    console.log("Cotizacion: "+this.id_quote);
    var angular_this = this;
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+angular_this.id_quote).subscribe(
      data => {
        console.log(data);
        angular_this.cotizacion=data;
        angular_this.email = angular_this.cotizacion.quote.email;
        angular_this.maker = angular_this.cotizacion.aig.maker;
        angular_this.year  = angular_this.cotizacion.aig.year;
        angular_this.model = angular_this.cotizacion.aig.model;
        angular_this.version= angular_this.cotizacion.aig.version;
        angular_this.url_foto = '/assets/img/makers/'+angular_this.maker+'.png';
        angular_this.telefono = angular_this.cotizacion.quote.cellphone;
        this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_kilometers_package?kilometers_package_id='+angular_this.id_package).subscribe(
          data2 => {
            console.log("Holi");
            console.log(data2);
            var kilometers_package:any = data2;
            angular_this.km = kilometers_package.kilometers;
            angular_this.vigencia = kilometers_package.covered_months;
            angular_this.cotizacion.cotizaciones.forEach( function(valor, indice, array) {
              if(valor.package==angular_this.km){
                angular_this.costo_package = valor.cost_by_package.toFixed(2); //Falta de los packages que regresa
                angular_this.totalPagar = valor.total_cost.toFixed(2); //Falta de los packages que regresa
              }
              //else inactiveCards(valor.package);
              //console.log("En el índice " + indice + " hay este valor: " + valor.id);
            });
          },
          error2 => console.log(error2)
        );
        console.log("cp:"+angular_this.cotizacion.quote.zipcode_id);
        this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_zipcodeid?zipcode_id='+angular_this.cotizacion.quote.zipcode_id).subscribe(
          data2 => {
            console.log(data2);
            var zipcode:any = data2;
            angular_this.zip_code = zipcode.zipcode;
            angular_this.colonia  = zipcode.suburb;
            angular_this.municipio= zipcode.municipality;
            angular_this.estado   = zipcode.state;
          },
          error2 => console.log(error2)
        );
        
      },
      error => console.log(error)
    );
  }
  next(id){
    var angular_this = this;
    var active = this.active;
    if(active==1){
      $("#idForm"+id+"1").validate({
        errorClass: "invalid border-danger",
        rules: {
        },
        messages: {
        
        },
        submitHandler: function(form) {
          if(angular_this.active>3) return false;
          angular_this.active++;
          angular_this.next1();
          $('#collapseOne').collapse('hide');
          var body = $("html, body");
          body.stop().animate({scrollTop:0}, 500, 'swing', function() {});
        }
      });
    }
    if(active==2){
      $("#idForm"+id+"2").validate({
        errorClass: "invalid border-danger",
        rules: {
          nombre: {
            required: true,
            //digits: true
          },
          apellidos: {
            required: true,
          },
          email: {
            required: true,
            email: true,
          },
          calle: {
            required: true,
          },
          cp: {
            required: true,
          },
          colonia: {
            required: true,
          },
          municipio: {
            required: true,
          },
          estado: {
            required: true,
          },
          telefono: {
            required: true,
            minlength: 8,
          },
          calle2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
          cp2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
          colonia2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
          municipio2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
          estado2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
        },
        messages: {
          nombre:{ 
            required: ""
          },
          apellidos:{ 
            required: ""
          },
          email:{ 
            required: ""
          },
          calle:{ 
            required: ""
          },
          cp:{ 
            required: ""
          },
          colonia:{ 
            required: ""
          },
          municipio:{ 
            required: ""
          },
          estado:{ 
            required: ""
          },
          telefono:{ 
            required: "",
            //digits : "Número inválido &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
            //minlength: jQuery.validator.format("El teléfono debe ser por lo menos de 8 dígitos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
          },
          calle2:{ 
            required: ""
          },
          cp2:{ 
            required: ""
          },
          colonia2:{ 
            required: ""
          },
          municipio2:{ 
            required: ""
          },
          estado2:{ 
            required: ""
          },
        },
        submitHandler: function(form) {
          if(angular_this.active>3) return false;
          angular_this.active++;
          angular_this.next1();
          $('#collapseOne').collapse('hide');
          var body = $("html, body");
          body.stop().animate({scrollTop:0}, 500, 'swing', function() {});
        }
      });
    }
    if(active==3){
      if(angular_this.forma_pago==1){
        var continuar = true;
        angular_this.error_name_card  =  "";
        angular_this.error_card = "";
        angular_this.error_vigency_card = "";
        angular_this.error_cvv = "";

        angular_this.error_label_name_card = "";
        angular_this.error_label_card="";
        angular_this.error_label_vigency_card="";
        angular_this.error_label_cvv="";
        if(angular_this.input_check1==false){
          continuar=false;
          angular_this.error_checkbox1="invalid border-danger";
        }

        if(angular_this.cvv==""){
          continuar = false;
          angular_this.error_cvv ="invalid border-danger";
          angular_this.error_label_cvv="Ingresa el CVV de tu tarjeta";
        }
        if(angular_this.year_expiration=="" || angular_this.month_expiration==""){
          continuar = false;
          angular_this.error_vigency_card ="invalid border-danger";

          angular_this.error_label_vigency_card="Ingresa la fecha de vencimiento.";
        }
        var card = angular_this.card;
        console.log("card:" +card);
        if(card.length !=16){
          continuar = false;
          angular_this.error_card ="invalid border-danger";
          angular_this.error_label_card="Tarjeta inválida.";
        }
         if(angular_this.card==""){
          continuar = false;
          angular_this.error_card ="invalid border-danger";
          angular_this.error_label_card="Ingresa el número de tu tarjeta.";
        }
        if(angular_this.card_name==""){
          continuar = false;
          angular_this.error_name_card  = "invalid border-danger";

          angular_this.error_label_name_card = "Ingresa el nombre completo del titular de la tarjeta.";
        }
        if(continuar) angular_this.send_quotation();
      }
      if(angular_this.forma_pago==2){
        if(angular_this.payment_method=="")
          angular_this.error_label_tiendas = "Selecciona una tienda";
        else{
          angular_this.error_label_tiendas = "";
          if(angular_this.input_check1==false){
            angular_this.error_checkbox1="invalid border-danger";
          }
          else angular_this.send_quotation();
        }
      }
      if(angular_this.forma_pago==3){
        if(angular_this.input_check1==false){
            angular_this.error_checkbox1="invalid border-danger";
        }
        else  angular_this.send_quotation();
      }
    }
  }
  send_quotation(){
    var angular_this = this;
    console.log(angular_this.payment_method);
    var nombre = "";
    var apellidos="";
    if(this.forma_pago==1){
      var res = angular_this.card_name.split(" ");
      
      if(res[0]!=null)
        nombre = res[0];
      if(res[1]!=null)
        apellidos = res[1];
    }
    else{
      nombre = angular_this.nombre;
      apellidos = angular_this.apellidos;
    }
    //Validar direccion de entrega PIA 
    if(!angular_this.checkbox_dir_poliza){
      angular_this.calle2    = angular_this.calle;
      angular_this.colonia2  = angular_this.colonia;
      angular_this.interior2 = angular_this.interior;
      angular_this.zip_code2 = angular_this.zip_code;
    }
    let json =  {
      "email" : angular_this.email,
      "first_name" : angular_this.nombre,
      "last_name_one" : angular_this.apellidos,
      "last_name_two" : "",
      "quote_id" : angular_this.id_quote,
      "kilometers_package_id" : angular_this.id_package,
      "plates" : angular_this.placas,
      "factura" : angular_this.checkbox_factura,
      "total_amount": angular_this.totalPagar,
      "cost_package": angular_this.costo_package,
      "payment_method": angular_this.payment_method,
      "deviceIdHiddenFieldName": angular_this.deviceIdHiddenFieldName, 
      "token_id": angular_this.token_openpay, 
      "card_number":angular_this.card, 
      "card_expiration_month":angular_this.month_expiration, 
      "card_expiration_year":angular_this.year_expiration, 
      "card_verification":angular_this.cvv, 
      "card_first_name":nombre, 
      "card_last_name":apellidos,
      "street1": angular_this.calle,
      "suburb1": angular_this.colonia,
      "ext_number1": "",
      "int_number1": angular_this.interior,
      "zipcode1": angular_this.zip_code,
      "phone1": angular_this.telefono,
      "cellphone1": angular_this.telefono,
      "street2": angular_this.calle2,
      "suburb2": angular_this.colonia2,
      "ext_number2": "",
      "int_number2": angular_this.interior2,
      "zipcode2": angular_this.zip_code2,
      "phone2":angular_this.telefono,
      "cellphone2": angular_this.telefono,
      "street3": angular_this.calle3,
      "suburb3": angular_this.colonia3,
      "ext_number3": angular_this.exterior3,
      "int_number3": angular_this.interior3,
      "zipcode3": angular_this.zip_code3,
      "phone3":angular_this.telefono,
      "cellphone3": angular_this.telefono,
      "rfc": angular_this.rfc,
      "razon_social": angular_this.razon_social,
      "store": angular_this.store_selected
    }
    console.log(json);
    var sucess_callbak = function (response){
            $('#idModalTarjetaPago').modal('toggle'); //Modal de cotizando
            angular_this.token_openpay = response.data.id
            json.deviceIdHiddenFieldName = angular_this.deviceIdHiddenFieldName;
            json.token_id = angular_this.token_openpay;
            console.log(json);
            angular_this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_payment/',json).subscribe(
                  data => {
                      console.log(data);
                      angular_this.respuesta=data;
                      angular_this.transaction = angular_this.respuesta.transaction;
                      angular_this.transaction_id = angular_this.transaction.id;
                      angular_this.send_ticket();
                  },
                  error =>{ 
                    console.log(error);  // error path
                    $('#idModalTarjetaPago').modal('toggle'); //Modal de cotizando
                    $('#idModalErrorTarjeta').modal('toggle'); //Modal de cotizando
                  } 

                );
        };

    var error_callbak = function (response) {
      console.log(response);
    };
    var data = $("#idForm3");
    if(this.payment_method=="openpay"){
      $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
      json.deviceIdHiddenFieldName = "";
      json.token_id = "";
      angular_this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_payment/',json).subscribe(
        data => {
          console.log(data);
          angular_this.respuesta=data;
          angular_this.transaction = angular_this.respuesta.transaction;
          angular_this.transaction_id = angular_this.transaction.id;
          angular_this.send_ticket();
        },
        error =>{ 
          console.log(error);  // error path
          $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
          $('#idModalErrorFicha').modal('toggle'); //Modal de cotizando
        } 
      );
    }
    if(this.payment_method=="oxxo_pay"){
      $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
      json.deviceIdHiddenFieldName = "";
      json.token_id = "";
      angular_this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_payment/',json).subscribe(
        data => {
          console.log(data);
          angular_this.respuesta=data;
          angular_this.transaction = angular_this.respuesta.transaction;
          angular_this.transaction_id = angular_this.transaction.id;
          angular_this.send_ticket();
        },
        error =>{ 
          console.log(error);  // error path
          $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
          $('#idModalErrorFicha').modal('toggle'); //Modal de cotizando
        } 
      );
    }
    if(this.payment_method=="spei_pay"){
      $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
      json.deviceIdHiddenFieldName = "";
      json.token_id = "";
      angular_this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_payment/',json).subscribe(
        data => {
          console.log(data);
          angular_this.respuesta=data;
          angular_this.transaction = angular_this.respuesta.transaction;
          angular_this.transaction_id = angular_this.transaction.id;
          angular_this.send_ticket();
        },
        error =>{ 
          $('#idModalFichaPago').modal('toggle'); //Modal de cotizando
          $('#idModalErrorFicha').modal('toggle'); //Modal de cotizando
          console.log(error);  // error path
        } 
      );
    }
    if(this.payment_method=="card"){
      this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
      this.token_openpay = OpenPay.token.extractFormAndCreate(data, sucess_callbak, error_callbak);
    }
    

    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    
  }

  send_ticket(){
    var forma_pago = "tarjeta";
    if(this.payment_method=="openpay" || this.payment_method=="oxxo_pay") forma_pago="efectivo-"+this.store_selected;
    if(this.payment_method=="spei_pay") forma_pago="spei";
    
    var url_envio ="/comprar-seguro-kilometro-pago-"+forma_pago+"/"+this.id_quote+"/"+this.transaction_id+"/ticket";
    console.log(url_envio);
    window.location.href = url_envio;
  }

  next1(){
      let active = this.active;
      var progress = 25*active;
      $("#progress-bar").css("width",progress+"%");
   }

  prev(){
      var anterior = this.active-1;
      this.active = anterior;
      var progress = 25*this.active;
      if(this.active!=5) $("#fieldset5").hide();
      $("#progress-bar").css("width",progress+"%");

  }

  formaPago(num){
    this.forma_pago = num;
    this.store_selected='';
    if(this.forma_pago==1) this.payment_method = 'card';
    if(this.forma_pago==2){ 
      this.payment_method = '';
      this.store_selected='';
    }
    if(this.forma_pago==3){ 
      this.payment_method = 'spei_pay';
    }
    if(this.forma_pago!=1) this.checkbox_factura= false;
    console.log(this.forma_pago+"---"+this.payment_method);
  }

  zipcodeChange(num){
    var cp;
    var angular_this = this;
    if(num==1)
      cp = this.zip_code;
    if(num==2) 
      cp = this.zip_code2;
    if(num==3)
      cp = this.zip_code3;
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_zipcode?zipcode='+cp).subscribe(
      data => {
        angular_this.zipcodes = data;
        if(num==1){
          angular_this.colonia = angular_this.zipcodes.suburb;
          angular_this.municipio = angular_this.zipcodes.municipality;
          angular_this.estado = angular_this.zipcodes.state;
        }
        if(num==2){
          angular_this.colonia2 = angular_this.zipcodes.suburb;
          angular_this.municipio2 = angular_this.zipcodes.municipality;
          angular_this.estado2 = angular_this.zipcodes.state;
        }
        if(num==3){
          angular_this.colonia3 = angular_this.zipcodes.suburb;
          angular_this.municipio3 = angular_this.zipcodes.municipality;
          angular_this.estado3 = angular_this.zipcodes.state;
        }
        console.log(data);
      },
      error => console.log(error)
    );
  }

  click(tipo,id){
    this.error_label_tiendas = "";
    var angular_this = this;
    var size = $('.'+tipo).length-1;
    console.log("son: "+size);
    if($("#tienda"+id).hasClass("checkbox-div-active")==false){
      console.log("NO ESTA SELEECIONADO");
      $("#tienda"+id).addClass("checkbox-div-active");
    }
    this.store_selected = id;
    $("."+tipo).each(function(index) {
      let id2 = "tienda"+$(this).attr('id');
      if(id2!=id){
        $("#"+id2).removeClass("checkbox-div-active");
      }
    });
    console.log("La tienda es: "+this.store_selected);
    if(this.store_selected=='oxxo'){
      this.payment_method = 'oxxo_pay';
    }
    else{
     this.payment_method = 'openpay'; 
    }
    console.log("El metodo de pago es: "+this.payment_method);
  }

  cambiarPasoDesktop(paso){
    if(paso < this.active){
      this.active = paso;
    }

  }
  set_check(){
    if(this.input_check1==true)
      this.input_check1=false;
    else{ 
      this.input_check1=true;
      this.error_checkbox1 = "";
    }
  }

}
