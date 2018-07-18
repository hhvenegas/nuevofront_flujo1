import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Api} from "../api.constants";
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
declare var OpenPay:any;

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  paso:               any = 1;
  btn_submit:         any = "Continuar";
  icono:              any = "fas fa-chevron-up";
  collapse:           any = "show";
  dispositivo:        any = "desktop";
  checkbox_terminos:  any = false;
  checkbox_dir_envio: any = false; 
  checkbox_factura:   any = false;
  forma_pago:         any = "tarjeta";
  payment_method:     any = "card";
  tienda:             any = "";
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

  //Datos de formulario
  packages:    any;
  quotation:   any = Array();
  quote:       any = Array();
  package:     any = Array();
  transaction: any = Array();
  package_id:  any = "";
  quote_id:    any = "";
  maker_name:  any = "";
  year:        any = "";
  model_name:  any = "";
  version_name:any = "";
  sisa:        any = "";
  plates:      any = "";

  name:        any = "";
  second_name: any = "";
  email:       any = "";
  cellphone:   any = "";

  calle:       any = "";
  exterior:    any = "";
  interior:    any = "";
  zipcode:     any = "";
  colonias:    any = Array();
  colonia:     any = "";
  municipio:   any = "";
  estado:      any = "";

  calle2:       any = "";
  exterior2:    any = "";
  interior2:    any = "";
  zipcode2:     any = "";
  colonias2:    any = Array();
  colonia2:     any = "";
  municipio2:   any = "";
  estado2:      any = "";

  calle3:       any = "";
  exterior3:    any = "";
  interior3:    any = "";
  zipcode3:     any = "";
  colonias3:    any = Array();
  colonia3:     any = "";
  municipio3:   any = "";
  estado3:      any = "";

  rfc:          any = "";
  razon_social: any = "";

  card:              any = "";
  card_name:         any = "";
  expiration_month:  any = "";
  expiration_year:   any = "";
  cvv:               any = "";
  token_openpay:     any = "";
  openpay_card_pay:  any = "";
  deviceIdHiddenFieldName:any="";


  //Error message
  error_name:        any = "";
  error_second_name: any = "";
  error_email:       any = "";
  error_cellphone:   any = "";

  error_calle:       any = "";
  error_exterior:    any = "";
  error_interior:    any = "";
  error_zipcode:     any = "";
  error_colonia:     any = "";
  error_municipio:   any = "";
  error_estado:      any = "";

  error_calle2:       any = "";
  error_exterior2:    any = "";
  error_interior2:    any = "";
  error_zipcode2:     any = "";
  error_colonia2:     any = "";
  error_municipio2:   any = "";
  error_estado2:      any = "";

  error_calle3:       any = "";
  error_exterior3:    any = "";
  error_interior3:    any = "";
  error_zipcode3:     any = "";
  error_colonia3:     any = "";
  error_municipio3:   any = "";
  error_estado3:      any = "";

  error_card:         any = "";
  error_card_name:    any = "";
  error_expiration:   any = "";
  error_cvv:          any = "";
  error_tienda:       any = "";
  error_terminos:     any = "";
  error_rfc:          any = "";
  error_razon_social: any = "";
  
  constructor(private router : ActivatedRoute,private router2 : Router,private http: HttpClient) {
  }

  ngOnInit() {
    this.quote_id = this.router.snapshot.params['id'];
    this.package_id = this.router.snapshot.params["plan"];
    this.getPackage();
  }

  cambiarPaso(paso){
    if(this.paso>=paso){
      this.paso = paso;
    }
  }
  cambiarDireccionEnvio(){
    if(this.checkbox_dir_envio == true)
      this.checkbox_dir_envio = false;
    else this.checkbox_dir_envio = true;
  }
  cambiarFactura(){
    if(this.checkbox_factura == true)
      this.checkbox_factura = false;
    else this.checkbox_factura = true;
  }
  cambiarTerminos(){
    if(this.checkbox_terminos == true)
      this.checkbox_terminos = false;
    else this.checkbox_terminos = true;
  }
  cambiarFormaPago(forma_pago){
    this.tienda = "";
    this.deviceIdHiddenFieldName = "";
    this.token_openpay = "";
    this.forma_pago = forma_pago;
    this.btn_submit = "Generar ficha de pago";
    if(forma_pago=='tarjeta'){
      this.btn_submit = "Pagar";
      this.payment_method = "card";
    }
    if(forma_pago=='efectivo' && this.tienda=='oxxo')
      this.payment_method = "oxxo_pay";
    if(forma_pago=='efectivo' && this.tienda!='oxxo')
      this.payment_method = "openpay";
    if(forma_pago=='spei'){
      this.payment_method = "spei_pay";
      this.btn_submit = "Generar referencia";
    }
  }
  cambiarIcono(){
    if(this.icono== 'fas fa-chevron-down')
      this.icono = "fas fa-chevron-up";
    else this.icono = "fas fa-chevron-down";
    //console.log(this.icono);

  }
  setTienda(tienda){
    this.tienda = tienda;
    if(this.forma_pago=='efectivo' && this.tienda=='oxxo')
      this.payment_method = "oxxo_pay";
    if(this.forma_pago=='efectivo' && this.tienda!='oxxo')
      this.payment_method = "openpay";
  }
  getQuote(){
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_quotation?quote_id='+this.quote_id).subscribe(
      data => {
        this.quote =  data;
        this.quote.cotizaciones.forEach( item => {
          if(this.package.kilometers == item.package)
            this.quotation = item;
        });
        //console.log(this.quote);
        this.maker_name = this.quote.aig.maker;
        this.year = this.quote.aig.year;
        this.model_name = this.quote.aig.model;
        this.version_name = this.quote.aig.version;
        this.email = this.quote.quote.email;
        this.cellphone = this.quote.quote.cellphone;
        this.get_zipcodeid(1,this.quote.quote.zipcode_id);
      },
      error => {}
    );
  }
  getPackage(){
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_kilometers_package?kilometers_package_id='+this.package_id).subscribe(
      data => {
        this.package = data;
        //console.log(this.package);
        this.getQuote();
         
      },
      error => console.log(error)
      );
  }
  get_zipcodeid(num,zipcode_id){
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_zipcodeid?zipcode_id='+zipcode_id).subscribe(
      data => {
        let zipcode:any = data;
        if(num==1){
          this.zipcode   = zipcode.zipcode;
          this.colonia   = zipcode.suburb;
          this.municipio = zipcode.municipality;
          this.estado    = zipcode.state; 
        }
        if(num==2)
          this.zipcode2 = zipcode.zipcode;
        if(num==3)
          this.zipcode3 = zipcode.zipcode;
        this.get_zipcode(num);
      },
      error => console.log(error)
    );
  }
  get_zipcode(num){
    let zipcode = "";
    if(num==1)
      zipcode = this.zipcode;
    if(num==2)
      zipcode = this.zipcode2;
    if(num==3)
      zipcode = this.zipcode3;
    this.http.get(Api.API_DOMAIN+'api/v1/web_services/get_zipcode?zipcode='+zipcode).subscribe(
      data => {
        //console.log(data);
        if(num==1)
          this.colonias = data;
        if(num==2){
          this.colonias2 = data;
          this.colonia2   = this.colonias2[0].suburb;
          this.municipio2 = this.colonias2[0].municipality;
          this.estado2    = this.colonias2[0].state; 
        }
        if(num==3){
          this.colonias3 = data;
          this.colonia3   = this.colonias3[0].suburb;
          this.municipio3 = this.colonias3[0].municipality;
          this.estado3   = this.colonias3[0].state; 
        }
      },
      error => console.log(error)
    );
  }
  validarDireccion(){
    if(this.checkbox_dir_envio==false){
      this.calle2    = this.calle;
      this.exterior2 = this.exterior;
      this.interior2 = this.interior;
      this.zipcode2  = this.zipcode;
      this.municipio2= this.municipio;
      this.estado2   = this.estado;
      this.colonia2  = this.colonia;
    }
  }
  continuar(){
    var siguiente = true;
    this.collapse = "";
    this.icono= "fas fa-chevron-down";
    if(this.paso==2){
      if(this.name==''){
        siguiente = false;
        this.error_name = "Ingresa tu nombre";
      } else this.error_name = "";
      if(this.second_name==''){
        siguiente = false;
        this.error_second_name = "Ingresa tus apellidos";
      } else this.error_second_name = "";
      if(this.email==''){
        siguiente = false;
        this.error_email = "Ingresa tu email";
      }else{
        //validar si es correo 
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var serchfind = regexp.test(this.email);
        //console.log(serchfind);
        if(!serchfind){
          siguiente = false;
          this.error_email = "Ingresa un correo válido";
        }
        else this.error_email = "";
      }
      if(this.cellphone==''){
        siguiente = false;
        this.error_cellphone = "Ingresa tu celular";
      } else this.error_cellphone = "";
      if(this.calle==''){
        siguiente = false;
        this.error_calle = "Ingresa la calle de tu domicilio";
      } else this.error_calle = "";
      if(this.exterior==''){
        siguiente = false;
        this.error_exterior = "Ingresa el número exterior";
      } else this.error_exterior = "";
      if(this.zipcode == '')
        siguiente = false;
      if(this.colonia=='')
        siguiente = false;
      if(this.municipio == '')
        siguiente = false;
      if(this.estado == '')
        siguiente = false;
      if(this.checkbox_dir_envio==true){
        if(this.calle2==''){
          siguiente = false;
          this.error_calle2 = "Ingresa la calle de la dirección";
        } else this.error_calle2 = "";
        if(this.exterior2==''){
          siguiente = false;
          this.error_exterior2 = "Ingresa el número exterior";
        } else this.error_exterior2 = "";
        if(this.zipcode2 == ''){
          siguiente = false;
          this.error_zipcode2 = "Ingresa tu código postal";
        } else this.error_zipcode2 = "";
        if(this.colonia2==''){
          siguiente = false;
          this.error_colonia2 = "Selecciona tu colonia";
        } else this.error_colonia2 = "";
        if(this.municipio2 == ''){
          siguiente = false;
          this.error_municipio2 = "Falta tu municipio";
        } else this.error_municipio2 = "";
        if(this.estado2 == ''){
          siguiente = false;
          this.error_estado2 = "Falta tu estado";
        } else this.error_estado2 = "";
      }
      else {this.validarDireccion();}
    }
    if(this.paso==3){
      if(this.forma_pago=='tarjeta'){
        this.tienda = "";
        if(this.card==''){
          siguiente = false;
          this.error_card = "Falta el número de tu tarjeta";
        } else{
          var regexp = new RegExp(/^[0-9]+$/);
          var serchfind = regexp.test(this.card);
          if(!serchfind){
            siguiente = false;
            this.error_card = "Tarjeta inválida";
          }
          else{
            if(this.card.length!=16){
              siguiente = false;
              this.error_card = "La tarjeta debe ser de 16 dígitos";
            }
            else this.error_card = "";
          }
        }
        if(this.card_name==""){
          siguiente = false;
          this.error_card_name = "Falta el nombre del titular de la tarjeta";
        }else this.error_card_name = "";
        if(this.expiration_month=="" || this.expiration_year==""){
          siguiente = false;
          this.error_expiration = "Falta la fecha de expiración de la tarjeta";
        }else this.error_expiration = "";
        if(this.cvv==""){
          siguiente = false;
          this.error_cvv = "Fala el código CVV";
        }else this.error_cvv = "";
      }
      if(this.forma_pago=='efectivo'){
        if(this.tienda==''){
          siguiente = false;
          this.error_tienda = "Selecciona tu centro de pago preferido";
        }
        else this.error_tienda = "";
      }
      if(this.forma_pago=='spei'){
        this.tienda = "";
      }
      if(this.checkbox_factura==true){
        if(this.rfc==""){
          siguiente = false;
          this.error_rfc = "Ingresa tu RFC";
        } else this.error_rfc = "";
        if(this.razon_social==""){
          siguiente = false;
          this.error_razon_social = "Ingresa la razón social";
        } else this.error_razon_social = "";
        if(this.calle3==''){
          siguiente = false;
          this.error_calle3 = "Ingresa la calle de la dirección";
        } else this.error_calle3 = "";
        if(this.exterior3==''){
          siguiente = false;
          this.error_exterior3 = "Ingresa el número exterior";
        } else this.error_exterior3 = "";
        if(this.zipcode3 == ''){
          siguiente = false;
          this.error_zipcode3 = "Ingresa tu código postal";
        } else this.error_zipcode3 = "";
        if(this.colonia3==''){
          siguiente = false;
          this.error_colonia3 = "Selecciona tu colonia";
        } else this.error_colonia3 = "";
        if(this.municipio3 == ''){
          siguiente = false;
          this.error_municipio3 = "Falta tu municipio";
        } else this.error_municipio3 = "";
        if(this.estado3 == ''){
          siguiente = false;
          this.error_estado3 = "Falta tu estado";
        } else this.error_estado3 = "";
      }
      if(this.checkbox_terminos==false){
        siguiente = false;
        this.error_terminos = "Falta que aceptes los términos y condiciones";
      } else this.error_terminos = "";
    }
    if(siguiente){
      if(this.paso==2) this.btn_submit = "Pagar";
      if(this.paso==3){
        if(this.forma_pago == 'tarjeta')
          this.openpay_card();
        else 
          this.sendform();
      }
      else this.paso++;
    }
    //else //console.log("hay errores");
  }
  continuar_mobile(){
    $('body,html').stop(true,true).animate({        
        scrollTop: 0
    },1000);
    var siguiente = true;
    this.collapse = "";
    this.dispositivo = "mobile";
    if(this.paso==2){
      if(this.name==''){
        siguiente = false;
        this.error_name = "Ingresa tu nombre";
      } else this.error_name = "";
      if(this.second_name==''){
        siguiente = false;
        this.error_second_name = "Ingresa tus apellidos";
      } else this.error_second_name = "";
      if(this.email==''){
        siguiente = false;
        this.error_email = "Ingresa tu email";
      }else{
        //validar si es correo 
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var serchfind = regexp.test(this.email);
        //console.log(serchfind);
        if(!serchfind){
          siguiente = false;
          this.error_email = "Ingresa un correo válido";
        }
        else this.error_email = "";
      }
      if(this.cellphone==''){
        siguiente = false;
        this.error_cellphone = "Ingresa tu celular";
      } else this.error_cellphone = "";
      if(this.calle==''){
        siguiente = false;
        this.error_calle = "Ingresa la calle de tu domicilio";
      } else this.error_calle = "";
      if(this.exterior==''){
        siguiente = false;
        this.error_exterior = "Ingresa el número exterior";
      } else this.error_exterior = "";
      if(this.zipcode == '')
        siguiente = false;
      if(this.colonia=='')
        siguiente = false;
      if(this.municipio == '')
        siguiente = false;
      if(this.estado == '')
        siguiente = false;
      if(this.checkbox_dir_envio==true){
        if(this.calle2==''){
          siguiente = false;
          this.error_calle2 = "Ingresa la calle de la dirección";
        } else this.error_calle2 = "";
        if(this.exterior2==''){
          siguiente = false;
          this.error_exterior2 = "Ingresa el número exterior";
        } else this.error_exterior2 = "";
        if(this.zipcode2 == ''){
          siguiente = false;
          this.error_zipcode2 = "Ingresa tu código postal";
        } else this.error_zipcode2 = "";
        if(this.colonia2==''){
          siguiente = false;
          this.error_colonia2 = "Selecciona tu colonia";
        } else this.error_colonia2 = "";
        if(this.municipio2 == ''){
          siguiente = false;
          this.error_municipio2 = "Falta tu municipio";
        } else this.error_municipio2 = "";
        if(this.estado2 == ''){
          siguiente = false;
          this.error_estado2 = "Falta tu estado";
        } else this.error_estado2 = "";
      }
      else {this.validarDireccion();}
    }
    if(this.paso==3){
      if(this.forma_pago=='tarjeta'){
        this.tienda = "";
        if(this.card==''){
          siguiente = false;
          this.error_card = "Falta el número de tu tarjeta";
        } else{
          var regexp = new RegExp(/^[0-9]+$/);
          var serchfind = regexp.test(this.card);
          if(!serchfind){
            siguiente = false;
            this.error_card = "Tarjeta inválida";
          }
          else{
            if(this.card.length!=16){
              siguiente = false;
              this.error_card = "La tarjeta debe ser de 16 dígitos";
            }
            else this.error_card = "";
          }
        }
        if(this.card_name==""){
          siguiente = false;
          this.error_card_name = "Falta el nombre del titular de la tarjeta";
        }else this.error_card_name = "";
        if(this.expiration_month=="" || this.expiration_year==""){
          siguiente = false;
          this.error_expiration = "Falta la fecha de expiración de la tarjeta";
        }else this.error_expiration = "";
        if(this.cvv==""){
          siguiente = false;
          this.error_cvv = "Fala el código CVV";
        }else this.error_cvv = "";
      }
      if(this.forma_pago=='efectivo'){
        if(this.tienda==''){
          siguiente = false;
          this.error_tienda = "Selecciona tu centro de pago preferido";
        }
        else this.error_tienda = "";
      }
      if(this.forma_pago=='spei'){
        this.tienda = "";
      }
      if(this.checkbox_factura==true){
        if(this.rfc==""){
          siguiente = false;
          this.error_rfc = "Ingresa tu RFC";
        } else this.error_rfc = "";
        if(this.razon_social==""){
          siguiente = false;
          this.error_razon_social = "Ingresa la razón social";
        } else this.error_razon_social = "";
        if(this.calle3==''){
          siguiente = false;
          this.error_calle3 = "Ingresa la calle de la dirección";
        } else this.error_calle3 = "";
        if(this.exterior3==''){
          siguiente = false;
          this.error_exterior3 = "Ingresa el número exterior";
        } else this.error_exterior3 = "";
        if(this.zipcode3 == ''){
          siguiente = false;
          this.error_zipcode3 = "Ingresa tu código postal";
        } else this.error_zipcode3 = "";
        if(this.colonia3==''){
          siguiente = false;
          this.error_colonia3 = "Selecciona tu colonia";
        } else this.error_colonia3 = "";
        if(this.municipio3 == ''){
          siguiente = false;
          this.error_municipio3 = "Falta tu municipio";
        } else this.error_municipio3 = "";
        if(this.estado3 == ''){
          siguiente = false;
          this.error_estado3 = "Falta tu estado";
        } else this.error_estado3 = "";
      }
      if(this.checkbox_terminos==false){
        siguiente = false;
        this.error_terminos = "Falta que aceptes los términos y condiciones";
      } else this.error_terminos = "";
    }
    if(siguiente){
      if(this.paso==3){
        this.paso = 4;
        if(this.forma_pago == 'tarjeta')
          this.openpay_card();
        else 
          this.sendform();
      }
      else this.paso++;
    }
    //else //console.log("hay errores");
  }
  openpay_cash(){
    this.deviceIdHiddenFieldName = "";
    this.token_openpay = "";
  }

  openpay_card(){
    //OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    //OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    //OpenPay.setSandboxMode(true);
    OpenPay.setId('mtpac6zng162oah2h67h');
    OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.sendform();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card_name,
      "expiration_year":this.expiration_year,
      "expiration_month": this.expiration_month,
      "cvv2":this.cvv
    },sucess_callbak, this.errorCallback);
    
  }
  errorCallback(response) {
    //console.log("ERRORRRR");
  }
  prev(){
    $('body,html').stop(true,true).animate({        
        scrollTop: 0
    },1000);
    if(this.paso>3)
      this.paso = 3;
    else this.paso--;
  }

  sendform(){
    let form = {
      "kilometers_package_id"  : this.package_id,
      "quote_id"               : this.quote_id,
      "plates"                 : this.plates,
      "first_name"             : this.name,      
      "last_name_one"          : this.second_name,
      "last_name_two"          : "",
      "email"                  : this.email,
      "cellphone"              : this.cellphone,
      "phone"                  : this.cellphone,
      "street1"                : this.calle,
      "ext_number1"            : this.exterior,
      "int_number1"            : this.interior,
      "zipcode1"               : this.zipcode,
      "suburb1"                : this.colonia,
      "street2"                : this.calle2,
      "ext_number2"            : this.exterior2,
      "int_number2"            : this.interior2,
      "zipcode2"               : this.zipcode2,
      "suburb2"                : this.colonia2,
      "street3"                : this.calle3,
      "ext_number3"            : this.exterior3,
      "int_number3"            : this.interior3,
      "zipcode3"               : this.zipcode3,
      "suburb3"                : this.colonia3,
      "factura"                : this.checkbox_factura,
      "rfc"                    : this.rfc,
      "razon_social"           : this.razon_social,
      "payment_method"         : this.payment_method,
      "store"                  : this.tienda,
      "total_amount"           : this.quotation.total_cost,
      "deviceIdHiddenFieldName": this.deviceIdHiddenFieldName,
      "token_id"               : this.token_openpay
    }
    //console.log(form);
    this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_payment/',form).subscribe(
      data => {
        console.log(data);
        let pago = this.forma_pago;
        if(this.forma_pago=='efectivo')
          pago = this.tienda;
        this.transaction = data;
        //console.log(this.transaction.transaction);
        //let url_envio ="/comprar-seguro-kilometro-pago/"+pago+"/"+this.quote_id+"/"+this.transaction.transaction.id+"/ticket";
        //this.router2.navigate([url_envio]);
        //console.log(url_envio);
      },
      error =>{ 
        if(this.dispositivo=='mobile')
          this.paso = 5;
        console.log(error);  // error path
      } 
    );
  }
}