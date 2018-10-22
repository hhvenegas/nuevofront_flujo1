import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Policy } from '../constants/policy';
declare var Chartkick:any;
import Leaflet from 'leaflet';
import swal from 'sweetalert';
declare var OpenPay:any;
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  p: number = 1;
  q: number = 1;
  t: number = 1;
  cars:any = Array();
  id_car:number;
  purchases: any = [];
  last_purchase: any;
  last_purchase_date: any;
  packages: any
  price_500: any;
  price_250: any;
  total_price:any = false;
  price_1000: any;
  price_2000: any;
  price_5000: any;
  price_7000: any;
  selected_kilometers: any = false;
  nip: any = "";
  error_nip: any = "";
  view_trips: number = 1;
  list_trips: boolean = true;
  trips: any = [];
  trips_group: any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
  map: any;
  trip_by_date: any;
  id_trip:any;
  pay_member: boolean = false;
  pay_recurrent: boolean = false;
  title_modal_mechanic: any;
  header_modal_mechanic:any;

  // car information
  car:any;
  model:any;
  maker:any;
  year:any;
  vin:any;
  plates:any;
  imei:any

  //policy
  policy_id:any;
  policy_aig:any;
  policy_actve:any;
  policy_began_at: any;
  policy_expires_at: any;

  //DAtos de pago
  forma_pago: any;
  choose_package: boolean = true;
  choose_method_pay: boolean = false;
  card:              any = "";
  card_name:         any = "";
  expiration_month:  any = "";
  expiration_year:   any = "";
  cvv:               any = "";
  card_recurrent:              any = "";
  card_name_recurrent:         any = "";
  expiration_month_recurrent:  any = "";
  expiration_year_recurrent:   any = "";
  cvv_recurrent:               any = "";
  token_openpay:     any = "";
  openpay_card_pay:  any = "";
  error_card:         any = "";
  error_card_name:    any = "";
  error_expiration:   any = "";
  error_cvv:          any = "";
  error_tienda:       any = "";
  error_terminos:     any = "";
  payment_method: any = "";
  deviceIdHiddenFieldName:any="";
  tienda:any;
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

  constructor(private usersService: UsersService, 
              private activedRoute: ActivatedRoute, 
              private router: Router) { }

  ngOnInit() {
    this.activedRoute.params.subscribe(params=>{
      this.id_car = params.id_car
      //console.log(this.id_car)
      this.getCarsBasic()
      this.getkilometersPurchase()
      this.get_cars_ids();
    })

  }

  getCarsBasic(){
    //console.log(this.id_car)
    this.usersService.getCarBasic(this.id_car)
    .subscribe(
      (data:any)=> {
        console.log(data)
        this.car = data;
        this.maker = this.car.maker;
        this.model = this.car.model;
        this.year = this.car.year
        this.vin = this.car.vin;
        this.plates = this.car.plates;
        this.imei = this.car.policy.get_assigned_obd_imei;

        this.policy_id = this.car.policy_id;
        this.policy_aig = this.car.policy.aig_id;
        this.policy_actve = this.car.policy.human_state;
        this.policy_began_at = this.car.policy.began_at;
        this.policy_expires_at = this.car.policy.expires_at;

        this.getpackages();

      }
    )
  }

  get_cars_ids(){
    this.usersService.get_cars_ids().subscribe(
      (data: any) => {
        console.log(data);
        this.cars= data;
      },
      (error: any) => {
        console.log(error)
      }
    );
  }


  reload_car_data(id){
    this.id_car = id;
    this.selected_kilometers = false;
    this.total_price= false
    this.choose_package = true;
    this.choose_method_pay = false;
    for (var i = 0; i < this.cars.length; i++) {
      if(this.cars[i] == id){
        //var duplicate = this.cars.splice(i, 1)
        this.cars.push(this.cars[0])
        this.cars.splice(0,1)
        //this.cars.push(id)
      }
      console.log(this.cars)
    }
    this.getCarsBasic();
    this.getkilometersPurchase();
    //this.get_trips();
  }


  getkilometersPurchase(){
    this.usersService.get_kms_purchase(this.id_car).subscribe(
      (data: any) => {
        this.purchases = [];
        console.log(data);
        if (data){
            for(let purchase of data) {
              this.purchases.push(purchase)
            }
            this.last_purchase = this.purchases[this.purchases.length - 1]
            this.last_purchase_date = new Date(this.last_purchase.start_date);
            if(this.last_purchase.kilometers == "500" || this.last_purchase.kilometers == "250"){
              this.last_purchase_date  = this.last_purchase_date.setMonth(this.last_purchase_date.getMonth()+1);
            }else if(this.last_purchase.kilometers == "1000"){
              this.last_purchase_date  = this.last_purchase_date.setMonth(this.last_purchase_date.getMonth()+2);
            }else if(this.last_purchase.kilometers == "2000"){
              this.last_purchase_date  = this.last_purchase_date.setMonth(this.last_purchase_date.getMonth()+3);
            }else if(this.last_purchase.kilometers == "5000"){
              this.last_purchase_date  = this.last_purchase_date.setMonth(this.last_purchase_date.getMonth()+6);
            }else if(this.last_purchase.kilometers == "7000"){
              this.last_purchase_date  = this.last_purchase_date.setMonth(this.last_purchase_date.getMonth()+12);
            }
          }
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  getpackages(){
    console.log(this.id_car)
    this.usersService.get_packages(this.id_car).subscribe(
      (data: any) => {
        console.log(data);
        this.packages = data.packages
        this.defaultPrice();
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('recharge')){
          $("#recharge-tab").trigger("click");
        }
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  defaultPrice(){
    let vigency_price = 0;

      let prima = (this.car.rate/15000) * 500;
      vigency_price = 43.5
      let price = prima*1.16 + vigency_price
      this.price_500 = ((price)/500).toFixed(2)

      prima = (this.car.rate/15000) * 250;
      vigency_price = 43.5
      price = prima*1.16 + vigency_price
      this.price_250 = ((price)/250).toFixed(2)

      prima = (this.car.rate/15000) * 1000;
      vigency_price = 43.5 * 2
      price = prima*1.16 + vigency_price
      this.price_1000 = ((price)/1000).toFixed(2)

      prima = (this.car.rate/15000) * 2000;
      vigency_price = 43.5 * 3
      price = prima*1.16 + vigency_price
      this.price_2000 = ((price)/2000).toFixed(2)

      prima = (this.car.rate/15000) * 4000;
      vigency_price = 43.5 * 6
      price = prima*1.16 + vigency_price
      this.price_5000 = ((price)/4000).toFixed(2)

      prima = (this.car.rate/15000) * 5000;
      vigency_price = 43.5 * 6
      price = prima*1.16 + vigency_price
      this.price_5000 = ((price)/5000).toFixed(2)

      prima = (this.car.rate/15000) * 7000;
      vigency_price = 43.5 * 12
      price = prima*1.16 + vigency_price
      this.price_7000 = ((price)/7000).toFixed(2)
      console.log(this.price_250)
  }

  get_package_selected(event, km){
    this.selected_kilometers = km
    if(km == 250){
      this.total_price = this.price_250 * 250
    }else if(km == 500){
      this.total_price = this.price_500 * 500
    }else if(km == 1000){
      this.total_price = this.price_1000 * 1000
    }else if(km == 5000 ){
      this.total_price = this.price_5000 * 5000
    }else if(km == 7000){
      this.total_price = this.price_7000 * 7000
    }
    console.log(km)
    console.log(this.total_price)
  }

  validate_nip(){
    let siguiente = true;
    if(this.nip == ""){
      siguiente = false;
      this.error_nip = "ingresa un NIP";
    }else{
      if(this.nip.length < 4 || this.nip.length > 4){
        siguiente = false; 
        this.error_nip = "El NIP debe tener 4 digitos";
      }else{this.error_nip="";}
    }
    if(siguiente == true){
      this.get_nip();
      //this.get_trips();
    }
  }

  get_nip(){
    let siguiente = true;
     this.usersService.get_nip(this.nip).subscribe(
      (data: any)=>{
        console.log(data)
        if(data.respose == siguiente){
          this.getTrips();
          this.view_trips = 3;
          this.list_trips = false;
        }else{
          this.error_nip="NIP incorrecto"
        }
      },
      (error: any)=>{
        console.log(error)
      }
    )
  }

  getTrips(){
    this.usersService.get_trips(this.id_car).subscribe(
      (data: any) => {
        console.log(data);
        this.id_trip = data.id
        if(data){
          for(let trip of data) {
            this.trips.push(trip);
          }
        }
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  get_trips_by_date(date: any) {
    //var param = new Date(date).toLocaleDateString("en-us");
    // console.log(date);
    this.trips = [];
     this.usersService.get_trips_by_date(this.id_car).subscribe(
      (data: any) => {        
        if(data){
          for(let trip of data) {
            //var date_trip = new Date(trip.started_at).toLocaleDateString("en-us");
            var date_trip = trip.started_at.substring(0,10);
            var param = date;
            if( param == null || param == undefined || param == ""){
              //swal('Selecciona una fecha')
            }else{
              if (date_trip == param){
                //console.log(trip);
                //this.trips = trip;
                this.trips.push(trip);
              }
            }
          }
        }
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  get_trip_details(id){
    this.id_trip = id;
    this.usersService.get_trip_details(this.id_trip).subscribe(
      (data: any) => {
        console.log(data);
        this.start_trip = data.start_point.address
        this.end_trip = data.end_point.address
        this.date_trip = data.start_point.at
        var start = data.start_point.latLng;
        var end = data.end_point.latLng;

          if (this.map != undefined || this.map != null) {    
            this.map.remove();
          }
          $(document).ready(function(){
            $('#detalle_viaje').modal('open');   
            
            this.map = Leaflet.map('map');  
            
            Leaflet.tileLayer('http://mt.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
              attribution: '<a href="https://sxkm.mx">SXKM</a> Google Maps, INEGI'
            }).addTo(this.map);

            this.map.setView(start, 12);

            var Start_icon = Leaflet.marker(start,{
              icon: Leaflet.icon({
              iconUrl: "assets/img/origen.png",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
              })
            }).bindTooltip(this.start_trip);

            var End_icon = Leaflet.marker(end,{
              icon: Leaflet.icon({
              iconUrl: "assets/img/destino.png",
              iconSize:     [20, 30],
              iconAnchor:   [0, 30]
              })
            }).bindTooltip(this.end_trip); 

            var line = Leaflet.polyline(data.latLngs,{color: "#76bd1d"}).addTo(this.map).addTo(this.map);
            var line2 = Leaflet.polyline(data.high, {color: "red"}).bindTooltip("Velocidad mayor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line3 = Leaflet.polyline(data.medium, {color: "blue"}).bindTooltip("Velocidad mayor a 40 kms/hr y menor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line4 = Leaflet.polyline(data.low, {color: "green"}).bindTooltip("Velocidad menor a 40 kms/hr", {"sticky":true}).addTo(this.map);

            Start_icon.addTo(this.map);
            End_icon.addTo(this.map);
            this.map.invalidateSize();           
            //$('#detalle_viaje').modal('open');
            //   $('#detalle_viaje').modal('open');
            //   this.map.invalidateSize();      
            //   Start_icon.addTo(this.map);
            //   End_icon.addTo(this.map);
            //this.map.invalidateSize(true);    
          });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  get_trips_group(){
    var dateM = new Date(), y = dateM.getFullYear(), m = dateM.getMonth();
    var StartDate = new Date(y, m, 1).toLocaleDateString();
    var EndDate = new Date(y, m + 1, 0).toLocaleDateString();
    this.usersService.get_trips_group(this.id_car, StartDate, EndDate).subscribe(
      (data: any) => {
        console.log(data);
        this.trips_group = data
        new Chartkick.LineChart("chart-1", this.trips_group, {colors: ["#17d320", "#666"]})
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  process_purchase_km(){
    if(this.selected_kilometers && this.total_price){
      this.choose_package = false;
      this.choose_method_pay = true;
    }else{
      swal('No seleccionaste paquete','Selecciona un paquete para poder continuar','error')
    }
  }

  cambiarFormaPago(forma_pago){
    this.tienda = "";
    this.deviceIdHiddenFieldName = "";
    this.token_openpay = "";
    this.forma_pago = forma_pago;
    if(forma_pago=='tarjeta'){
      this.payment_method = "card";
    }
    if(forma_pago=='efectivo' && this.tienda=='oxxo')
      this.payment_method = "oxxo_pay";
    if(forma_pago=='efectivo' && this.tienda!='oxxo')
      this.payment_method = "openpay";
    if(forma_pago=='spei'){
      this.payment_method = "spei_pay";
    }
  }

  setTienda(tienda){
    this.tienda = tienda;
    if(this.forma_pago=='efectivo' && this.tienda=='oxxo')
      this.payment_method = "oxxo_pay";
    if(this.forma_pago=='efectivo' && this.tienda!='oxxo')
      this.payment_method = "openpay";
  }

  process_to_purchase_monthly(){
    let siguiente = true;
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
          if(this.card.length<15){
            siguiente = false;
            this.error_card = "Tarjeta inválida";
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
        this.error_cvv = "Falta el código CVV";
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
    //Si las validaciones son positivas
    if(siguiente == true){
        if(this.forma_pago=='tarjeta'){
          this.openpay_card_monthly();
        }else if( this.forma_pago=='efectivo' ){
          if(this.tienda == "oxxo"){
            this.pay_with_oxxo_monthly()
          }else{
            this.pay_with_openpay_store_monthly()
          }
        }else if(this.forma_pago=='spei'){
          this.pay_with_spei_monthly()
        }
    }
  }

  process_to_purchase(){
    let siguiente = true;
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
          if(this.card.length<15){
            siguiente = false;
            this.error_card = "Tarjeta inválida";
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
    //Si las validaciones son positivas
    if(siguiente == true){
        if(this.forma_pago=='tarjeta'){
          this.openpay_card();
        }else if( this.forma_pago=='efectivo' ){
          if(this.tienda == "oxxo"){
            this.pay_with_oxxo()
          }else{
            this.pay_with_openpay_store()
          }
        }else if(this.forma_pago=='spei'){
          this.pay_with_spei()
        }
    }
  }

  pay_with_oxxo(){
    $("#idModalFichaPago").modal('open');
    let json =  {"kilometer_purchase" : {"kilometers" : this.selected_kilometers, "increment_for_kilometers_purchased" : "", "cost":this.total_price, "total": this.total_price }, "pay_with_oxxo":"", "paymethod": "oxxo_pay" ,"Aceptar":"on",    "group1":"on",  "car_id": this.id_car}
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/cars/'+ this.id +'/kilometer_purchases/oxxo/';
      this.usersService.pay_with_oxxo(this.id_car, json).subscribe(
       data => {
        console.log(data)
        $("#idModalFichaPago").modal();
        this.router.navigate(["/panel/ficha_recarga/"], { queryParams: { referencia: data["oxxo_barcode"], forma_de_pago: "oxxo" , total: this.total_price, km: this.selected_kilometers } } );
       },
       error => {
         reject(error);
       }
     )
      });
  }

  pay_with_oxxo_monthly(){
    $("#idModalFichaPago").modal('open');
    let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}
    return new Promise((resolve, reject) => {
      // let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/monthly_payments/oxxo';
      this.usersService.pay_with_oxxo_monthly(json).subscribe(
       data => {
        console.log(data)
        $("#idModalFichaPago").modal();
        this.router.navigate(["/panel/ficha_mensualidad/"], { queryParams: { referencia: data["monthly_payment"]["oxxo_barcode"], forma_de_pago: "oxxo" , total: 299} } );
  
       },
       error => {
         reject(error);
       }
      )
    });
  }

  pay_with_openpay_store(){
    $("#idModalFichaPago").modal('open');
    let json =  {"kilometer_purchase" : {"paymethod": "open_pay" , "kilometers" : this.selected_kilometers, "increment_for_kilometers_purchased" : "", "cost":this.total_price, "total":this.total_price},  "car_id": this.id_car}
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/cars/'+ this.id +'/kilometer_purchases/pay_store_openpay/';
      this.usersService.pay_with_openpay_store(this.id_car, json).subscribe(
        data => {
         console.log(data)
         $("#idModalFichaPago").modal();
         this.router.navigate(["/panel/ficha_recarga/"], { queryParams: { referencia: data["banorte_reference"], forma_de_pago: this.tienda , total: this.total_price, km: this.selected_kilometers } } );
        },
        error => {
          reject(error);
        }
      )
    });
  }
  
  pay_with_openpay_store_monthly(){
    $("#idModalFichaPago").modal('open');
    let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/monthly_payments/pay_store_openpay/';
      this.usersService.pay_with_openpay_store_monthly(json).subscribe(
        data => {
         console.log(data)
         $("#idModalFichaPago").modal();
         this.router.navigate(["/panel/ficha_mensualidad/"], { queryParams: { referencia: data["banorte_reference"], forma_de_pago: this.tienda , total: 299} } );
        },
        error => {
          reject(error);
        }
      )
    });
  }

  openpay_card_pay_method(){
    $("#idModalTarjetaPago").modal('open');
    let json =  { "kilometer_purchase" : { "token_id": this.token_openpay,  "kilometers" : this.selected_kilometers}}

    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx/" + 'api/v1/my/cars/'+ this.id +'/kilometer_purchases/create_openpay_purchase/';
      this.usersService.openpay_card_pay_method(this.id_car, json).subscribe(
        data => {
        console.log(data)
        let vigencia;
        let km = this.selected_kilometers
        if(km == 250){
          vigencia = 1
        }else if(km == 500){
          vigencia = 1
        }else if(km == 1000){
          vigencia = 2
        }else if(km == 5000 ){
          vigencia = 6
        }else if(km == 7000){
          vigencia = 12
        }
        $("#idModalTarjetaPago").modal();
        this.router.navigate(["/panel/ficha_recarga/"], { queryParams: { vigencia: vigencia, forma_de_pago: 'tarjeta', total: this.total_price, km: this.selected_kilometers } } );

        },
        error => {
          reject(error);
        }
      )
    });
  }

  openpay_card_pay_method_monthly(){
    $("#idModalTarjetaPago").modal('open');
  let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id, "deviceIdHiddenFieldName": this.deviceIdHiddenFieldName, "token_id": this.token_openpay}

  return new Promise((resolve, reject) => {
    //let urlService = "http://dev2.sxkm.mx/" + 'api/v1/my/monthly_payments/make_payment_openpay/';
    this.usersService.openpay_card_pay_method_monthly(json).subscribe(
      data => {
      console.log(data)
      $("#idModalTarjetaPago").modal();
      this.router.navigate(["/panel/ficha_mensualidad"], { queryParams: {  forma_de_pago: 'tarjeta', total: 299 }} );

      },
      error => {
        reject(error);
      }
    )
  });
  }

  openpay_card(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.openpay_card_pay_method();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card_name,
      "expiration_year":this.expiration_year,
      "expiration_month": this.expiration_month,
      "cvv2":this.cvv
    },sucess_callbak, this.errorCallback);

  }

  openpay_card_monthly(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.openpay_card_pay_method_monthly();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card_name,
      "expiration_year":this.expiration_year,
      "expiration_month": this.expiration_month,
      "cvv2":this.cvv
    },sucess_callbak, this.errorCallback);

  }

  openpay_card_recurrent(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.pay_recurrent_method();
    }
    OpenPay.token.create({
      "card_number":this.card_recurrent,
      "holder_name":this.card_name_recurrent,
      "expiration_year":this.expiration_year_recurrent,
      "expiration_month": this.expiration_month_recurrent,
      "cvv2":this.cvv_recurrent
    },sucess_callbak, this.errorCallback);

  }

  pay_with_spei(){
      $("#idModalFichaPago").modal('open');
    let json =  {"kilometer_purchase" : {"paymethod": "spei_pay" , "kilometers" : this.selected_kilometers, "increment_for_kilometers_purchased" : "", "cost":this.total_price, "total":this.total_price}, "pay_with_spei":"", "car_id": this.id_car}
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/cars/'+ this.id +'/kilometer_purchases/spei/';
      this.usersService.pay_with_spei(this.id_car, json).subscribe(
        data => {
          console.log(data)
          $("#idModalFichaPago").modal();
          this.router.navigate(["/panel/ficha_recarga/"], { queryParams: { referencia: data["spei_clabe"], forma_de_pago: "spei" , total: this.total_price, km: this.selected_kilometers } } );
        },
        error => {
          reject(error);
        }
      )
    });
  }

  pay_with_spei_monthly(){
    $("#idModalFichaPago").modal('open');
    let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/monthly_payments/spei';
      this.usersService.pay_with_spei_monthly(json).subscribe(
        data => {
          console.log(data)
          $("#idModalFichaPago").modal();
          this.router.navigate(["/panel/ficha_mensualidad/"], { queryParams: { referencia: data["monthly_payment"]["spei_clabe"], forma_de_pago: "spei" , total: 299} } );
        },
        error => {
          reject(error);
        }
      )
    });
  }

  pay_recurrent_method(){
    let json =  {"token_id": this.token_openpay, "deviceIdHiddenFieldName": this.deviceIdHiddenFieldName,  "monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id }
    return new Promise((resolve, reject) => {
      //let urlService = "http://dev2.sxkm.mx" + '/api/v1/my/monthly_payments/save_account';
      this.usersService.pay_recurrent_method(json).subscribe(
        data => {
         console.log(data)
          swal('Tu subscripción a los pagos recurrentes fue exitosa','Felicidades tu subscripción fue exitosa, tus cargos de mensualidad se realizaran automaticamente de forma mensual','success')
        },
        error => {
            swal('Tu subscripción a los pagos recurrentes fue rechazada','La operación de subscripción con esta tarjeta fue rechazado','error')
          reject(error);
        }
      )
    });
  }

  errorCallback(response) {
    console.log("ERRORRRR");
  }


}
