import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jQuery:any;
declare var $:any;
declare var OpenPay:any;

@Component({
  selector: 'app-procesopago',
  templateUrl: './procesopago.component.html',
  styleUrls: ['./procesopago.component.css']
})
export class ProcesopagoComponent implements OnInit {
	title = 'SXKM - Comprar Plan';
  active=1;
  checkbox_dir_poliza=false;

  //Formas de pago
  forma_pago: any = 1;
  tiendas:any = [
    { id: 1, urlname: "oxxo", name: 'Oxxo' , urlfoto: "/assets/img/forma_pago/oxxo.png"},
    { id: 2, urlname: "7eleven", name: '7-eleven' , urlfoto: "/assets/img/forma_pago/7eleven.png"},
    { id: 3, urlname: "walmart", name: 'Walmart' , urlfoto: "/assets/img/forma_pago/walmart.png"},
    { id: 4, urlname: "aurrera", name: 'Bodega Aurrerá', urlfoto: "/assets/img/forma_pago/aurrera.png" },
    { id: 5, urlname: "extra", name: 'Extra' , urlfoto: "/assets/img/forma_pago/extra.png"},
    { id: 6, urlname: "superama", name: 'Superama' , urlfoto: "/assets/img/forma_pago/superama.png"},
    { id: 7, urlname: "ahorro", name: 'Farmacias del Ahorro' , urlfoto: "/assets/img/forma_pago/ahorro.png"},
    { id: 8, urlname: "sams", name: 'Sams' , urlfoto: "/assets/img/forma_pago/sams.png"},
    { id: 9, urlname: "circlek", name: 'K' , urlfoto: "/assets/img/forma_pago/circlek.png"},
    { id: 10, urlname: "guadalajara", name: 'Farmacias Guadalajara', urlfoto: "/assets/img/forma_pago/guadalajara.png" }
   ]

  //Datos del cliente
  nombre:any;
  apellidos:any;
  email:any;
  all_zipcodes: any;
  birth_date: any;
  gender: any;
  telephone: any;

  //Datos del vehiculo
  year : any ;
  maker : any ;
  url_foto: any;
  model: any;
  model_first :string="";
  version: any;
  placas: any = "";

  //Datos de la cotizacion
  id_quote: any;
  cotizacion: any; //Cotizacion
  packages: any; //Todos los paquetes de la cotizacion 
  package: any; //Paquete seleccionado
  token: any;
  km: any;
  vigencia: any;
  costo_suscripcion: any = 299;
  costo_package: any;
  totalPagar: any;
  precio_km: any;

  zipcodes: any;
  //Formulario 
  form_data:any;
  calle: any;
  calle2: any;
  interior:any;
  interior2:any;
  zip_code: any;
  zip_code2: any;
  colonia: any;
  colonia2: any;
  municipio: any;
  municipio2: any;
  estado: any;
  estado2: any;
  telefono: any;
  telefono2: any;
  //OpenPay
  card_name;
  card;
  year_expiration;
  years_card;
  month_expiration;
  cvv;
  token_openpay:any;
  openpay_card_pay:any;
  deviceIdHiddenFieldName:any;
  payment_method: any = "card";
  store_selected:any ="";

  //Transaccion
  respuesta: any;
  //url_production: any = "http://107.21.9.43/";
  url_production: any = "http://localhost:3000/";
  checkbox_factura: any = false;
  transaction: any;
  transaction_id: any;

  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    var plan  = url.searchParams.get("plan");
    this.token= token;
    this.get_quotation(token,plan);
    /***
    var angular_this = this;
    this.http.get(angular_this.url_production+'api/v1/web_services/get_zipcode?zipcode='+this.zip_code).subscribe(
      data => {
        angular_this.zipcodes = data;
        angular_this.colonia = angular_this.zipcodes.suburb;
        angular_this.municipio = angular_this.zipcodes.municipality;
        angular_this.estado = angular_this.zipcodes.state;
        console.log(data);
      },
      error => console.log(error)
    );
    **/

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

  ngOnInit() {
    $('#accordion').on('hidden.bs.collapse', function () {
      $("#span-icon-header-collapse").html('<i class="fas fa-angle-down">');
    });
    $('#accordion').on('shown.bs.collapse', function () {
      $("#span-icon-header-collapse").html('<i class="fas fa-angle-up">');
    });
  }
  
  changePoliza(){
    if(this.checkbox_dir_poliza) this.checkbox_dir_poliza=false;
    else this.checkbox_dir_poliza=true;
  }
  changeFactura(){
    if(this.checkbox_factura) this.checkbox_factura=false;
    else this.checkbox_factura=true;
    console.log("Se requiere facura: "+this.checkbox_factura);
  }

  get_quotation(token,plan){
      var pos;
      var angular_this = this;
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data);
        console.log("Plan:"+plan);
        this.cotizacion=data;
        this.id_quote = this.cotizacion.id;
        this.nombre=this.cotizacion.name;
        this.email=this.cotizacion.email;
        this.zip_code=this.cotizacion.zipcode;
        
        this.http.get(angular_this.url_production+'api/v1/web_services/get_zipcode?zipcode='+this.zip_code).subscribe(
          data => {
            angular_this.zipcodes = data;
            angular_this.colonia = angular_this.zipcodes.suburb;
            angular_this.municipio = angular_this.zipcodes.municipality;
            angular_this.estado = angular_this.zipcodes.state;
            console.log(data);
          },
          error => console.log(error)
        );
        this.year=this.cotizacion.year;
        this.maker=this.cotizacion.maker_name;
        this.url_foto= "/assets/img/makers/"+this.cotizacion.maker_name+".png";
        this.model=this.cotizacion.car_model_name;
        this.version=this.cotizacion.version_name;
        this.zip_code=this.cotizacion.zipcode;

        var packages=JSON.parse(this.cotizacion.packages);
        this.packages=packages.costs_by_km; //Precio de los paquetes de la cotizacion

        this.packages.forEach( function(valor, indice, array) {
          if(valor.package==plan){
            pos = indice;
            angular_this.km = valor.package;
            angular_this.vigencia = valor.vigency;
            angular_this.costo_package = valor.cost_by_package;
            angular_this.totalPagar =  valor.total_cost.toFixed(2);
            angular_this.precio_km = valor.cost_by_km;
          }
        });
        this.package=this.packages[pos];
        this.totalPagar=this.packages[pos].total_cost;
        console.log(this.package);
        console.log("El quote_id:"+this.id_quote);
      },
      error => console.log(error)  // error path
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
          interior: {
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
            digits: true,
            minlength: 8,
          },
          calle2: {
            required:{
              depends: function(element) {
                return $("#checkbox_direccion_poliza").is(":checked");
              }
            }
          },
          interior2: {
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
            required: "Debes ingresar tu nombre. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          apellidos:{ 
            required: "Debes ingresar tus apellidos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          email:{ 
            required: "Debes ingresar tu correo electrónico &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          calle:{ 
            required: "Debes ingresar tu calle &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          interior:{ 
            required: "Debes ingresar tu número interior &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          cp:{ 
            required: "Debes ingresar tu código postal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          colonia:{ 
            required: "Debes ingresar tu colonia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          municipio:{ 
            required: "Debes ingresar tu municipio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          estado:{ 
            required: "Debes ingresar tu estado &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          telefono:{ 
            required: "Debes ingresar tu teléfono &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
            digits : "Número inválido &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
            minlength: jQuery.validator.format("El teléfono debe ser por lo menos de 8 dígitos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
          },
          calle2:{ 
            required: "Debes ingresar tu calle &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          interior2:{ 
            required: "Debes ingresar tu número interior &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          cp2:{ 
            required: "Debes ingresar tu código postal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          colonia2:{ 
            required: "Debes ingresar tu colonia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          municipio2:{ 
            required: "Debes ingresar tu municipio &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          estado2:{ 
            required: "Debes ingresar tu estado &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
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
        $("#idForm"+id+"3").validate({
          errorClass: "invalid border-danger",
          rules: {
            nombre_tarjeta: {
              required: true
            },
            numero_tarjeta: {
              required: true,
              digits: true,
              minlength: 16,
              maxlength: 16
            },
            vencimiento_month: {
              required: true
            },
            vencimiento_year: {
              required: true
            },
            cvv: {
              required: true,
              digits: true,
              minlength: 3,
              maxlength: 4
            }
          },
          messages: {
            nombre_tarjeta: {
              required: "Debes ingresar el nombre del titular de la tarjeta. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            },
            numero_tarjeta:{ 
              required: "Debes ingresar el número de la tarjeta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
              digits : "Tarjeta inválida &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
              minlength: jQuery.validator.format("La tarjeta debe ser de 16 dígitos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            },
            vencimiento_month:{
              required: "Debes seleccionar el mes de vencimiento. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            },
            vencimiento_year:{
              required: "Debes seleccionar el año de vencimiento. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            },
            cvv: {
              required: "Debes ingresar el CVV. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
              digits: "CVV inválido. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            }
          },
          submitHandler: function (form) {
            angular_this.send_quotation();
          }
        })
      }
      if(angular_this.forma_pago==2){
        angular_this.send_quotation();
      }
    }
  }
  send_quotation(){
    let package_id = 1;
    if(this.package=="500") package_id = 2; 
    if(this.package=="1000") package_id = 3; 
    if(this.package=="5000") package_id = 4; 
    if(this.package=="7000") package_id = 5; 
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
    let json =  {
      "email" : angular_this.email,
      "first_name" : angular_this.nombre,
      "last_name_one" : angular_this.apellidos,
      "last_name_two" : "",
      "quote_id" : angular_this.id_quote,
      "kilometers_package_id" : package_id,
      "plates" : angular_this.placas,
      "factura" : angular_this.checkbox_dir_poliza,
      "total_amount": angular_this.totalPagar,
      "payment_method": angular_this.payment_method,
      "deviceIdHiddenFieldName": angular_this.deviceIdHiddenFieldName, 
      "token_id": angular_this.token_openpay, 
      "card_number":angular_this.card, 
      "card_expiration_month":angular_this.month_expiration, 
      "card_expiration_year":angular_this.year_expiration, 
      "card_verification":angular_this.cvv, 
      "card_first_name":nombre, 
      "card_last_name":apellidos
    }
    var sucess_callbak = function (response){
            angular_this.token_openpay = response.data.id
            json.deviceIdHiddenFieldName = angular_this.deviceIdHiddenFieldName;
            json.token_id = angular_this.token_openpay;
            console.log(json);
            angular_this.http.post(angular_this.url_production+'api/v1/web_services/create_payment/',json).subscribe(
                  data => {
                      console.log(data);
                      angular_this.respuesta=data;
                      angular_this.transaction = angular_this.respuesta.transaction;
                      angular_this.transaction_id = angular_this.transaction.id;
                      angular_this.send_ticket();
                  },
                  error =>{ 
                    console.log(error);  // error path
                  } 

                );
        };

    var error_callbak = function (response) {
          alert("Error");
          console.log(response);
     };
    var data = $("#idForm3");
    if(this.payment_method=="cash"){
      json.deviceIdHiddenFieldName = "";
      json.token_id = "";
      angular_this.http.post(angular_this.url_production+'api/v1/web_services/create_payment/',json).subscribe(
        data => {
          console.log(data);
          angular_this.respuesta=data;
          angular_this.transaction = angular_this.respuesta.transaction;
          angular_this.transaction_id = angular_this.transaction.id;
          angular_this.send_ticket();
        },
        error =>{ 
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

    //return false;
    
  }

  send_ticket(){
    var forma_pago = "tarjeta";
    if(this.payment_method=="cash") forma_pago="efectivo-"+this.store_selected;
    
    var url_envio ="/comprar-seguro-kilometro-pago-"+forma_pago+"/"+this.transaction_id+"/ficha";
    console.log(url_envio);
    //window.location.href = url_envio;
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
    if(this.forma_pago==1) this.payment_method = 'card';
    if(this.forma_pago==2) this.payment_method = 'cash';
    console.log(this.forma_pago+"---"+this.payment_method);
  }

  zipcodeChange(num){
    var cp;
    var angular_this = this;
    if(num==1)
      cp = this.zip_code;
    else cp = this.zip_code2;
    this.http.get(angular_this.url_production+'api/v1/web_services/get_zipcode?zipcode='+cp).subscribe(
      data => {
        angular_this.zipcodes = data;
        if(num==1){
          angular_this.colonia = angular_this.zipcodes.suburb;
          angular_this.municipio = angular_this.zipcodes.municipality;
          angular_this.estado = angular_this.zipcodes.state;
        }
        else{
          angular_this.colonia2 = angular_this.zipcodes.suburb;
          angular_this.municipio2 = angular_this.zipcodes.municipality;
          angular_this.estado2 = angular_this.zipcodes.state;
        }
        console.log(data);
      },
      error => console.log(error)
    );
  }

  click(tipo,id){
    var angular_this = this;
    var size = $('.'+tipo).size()-1;

    $("#tienda"+id).addClass("checkbox-div-active");
    this.store_selected = id;

      

    $("."+tipo).each(function(index) {
      let id2 = $(this).attr('id');
      if(id2!=id){
        $("#"+id2).removeClass("checkbox-div-active");
      }
    });
    console.log("La tienda es: "+this.store_selected);
  }
}
