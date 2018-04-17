import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jQuery:any;
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

  //Formas de pago
  forma_pago: any = 1;
  tiendas:any = [
    { id: 1, name: 'Oxxo' , urlfoto: "/assets/img/forma_pago/oxxo.png"},
    { id: 2, name: '7-eleven' , urlfoto: "/assets/img/forma_pago/7-eleven.png"},
    { id: 3, name: 'Walmart' , urlfoto: "/assets/img/forma_pago/walmart.png"},
    { id: 4, name: 'Bodega Ahorrera', urlfoto: "/assets/img/forma_pago/bodega-a.png" },
    { id: 5, name: 'Extra' , urlfoto: "/assets/img/forma_pago/extra.png"},
    { id: 6, name: 'Superama' , urlfoto: "/assets/img/forma_pago/superama.png"},
    { id: 7, name: 'Farmacias del Ahorro' , urlfoto: "/assets/img/forma_pago/f-del-ahorro.png"},
    { id: 8, name: 'Sams' , urlfoto: "/assets/img/forma_pago/sams.png"},
    { id: 9, name: 'K' , urlfoto: "/assets/img/forma_pago/circle-k.png"},
    { id: 10, name: 'Farmacias Guadalajara', urlfoto: "/assets/img/forma_pago/super-farma.png" }
   ]

  //Datos del cliente
  nombre:any;
  apellidos:any;
  email:any;
  zip_code: any;
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

  //Datos de la cotizacion
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

  constructor(private http: HttpClient) {
    var url_string = window.location.href ;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");
    var plan  = url.searchParams.get("plan");
    this.token= token;
    this.get_quotation(token,plan);
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

  get_quotation(token,plan){
      var pos;
      var angular_this = this;
      this.http.get('http://52.91.226.205/api/v1/quotations/get_quotation_by_token?token='+token+'').subscribe(data => {
        console.log(data);
        console.log("Plan:"+plan);
        this.cotizacion=data;
        this.nombre=this.cotizacion.name;
        this.email=this.cotizacion.email;
        this.zip_code=this.cotizacion.zipcode;
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
          placas: {
            required: true,
            //digits: true
          },
          vin: {
            required: true,
            //digits: true
          }
        },
        messages: {
          placas:{ 
            required: "Debes ingresar las placas de tu vehículo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          },
          vin:{ 
            required: "Debes ingresar el VIN de tu vehículo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          }
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
            required: "Debes ingresar tu nombre &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
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
      window.location.href="";
    }
  }
  send_quotation(){
    var angular_this = this
    $("#idForm3").validate({
      submitHandler: function(form) {
        let form_data = {
            "email": angular_this.email,
            "maker_name": angular_this.maker,
            //"maker_id": angular_this.maker,
            "year": angular_this.year,
            "car_model_name": angular_this.model,
            //"car_model_id": angular_this.model_select,
            "version_name": angular_this.version,
            //"version_id": angular_this.version_select,
            "zipcode": angular_this.zip_code,
            //"birth_date": angular_this.birth_date_select,
            //"gender": angular_this.gender_select,
            "telephone": angular_this.telephone
        }
        console.log(form_data);
        /***
        angular_this.http.post('http://52.91.226.205/api/v1/quotations/create_quotation',form_data).subscribe(data => {
            console.log(data);
            //$('#idModalSuccess').modal('toggle'); //Modal de éxito de cotización //Le hace falta validar el codigo postal
          },
          error =>{ 
            console.log(error)  // error path
            //$('#idModalError').modal('toggle'); //Modeal de error de cotización
          }
        );**/
      }
    });
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

  }
}
