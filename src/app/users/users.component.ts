import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import Swiper from 'swiper';
declare var $:any;
declare let L;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // car
  car: any = null;
  car_id:any;
  packages: any;
  //car errors
  title_modal_mechanic:any;
  header_modal_mechanic:any;
  error_modal:any;
  // viajes
  nip:any="";
  error_nip:any = "";
  purchases: any = [];
  id_trip:any;
  map:any;
  view_trips: number = 1;
  list_trips: boolean = true;
  trips: any = [];
  trips_group: any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
  has_trip:boolean;
  // variables de paginacion
  q: any = 1;
  p: any = 1;
  t: any = 1;
  //kilometors
  last_purchase: any;
  last_purchase_date: any;
  price_500: any;
  price_250: any;
  price_1000: any;
  price_2000: any;
  price_5000: any;
  price_7000: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private usersService: UsersService) { }

	ngOnInit() {
    //this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
      this.getInfoCar();
      this.getKmsPurchase();
    });
		
  }

  getInfoCar(){
    this.usersService.getCarBasic(this.car_id)
    .subscribe(
    (data:any)=> {
      this.car = data;
     //console.log(this.car.policy.get_monthly_payments.paid_at_date.sort())
      this.car.policy.get_monthly_payments.sort(function(a,b){
        return (b.id) - (a.id);
      });
      console.log(this.car)
      this.get_packages()
    });
  }

  get_packages(){
    this.usersService.get_packages(this.car_id).subscribe(
      (data: any) => {
        console.log(data);
        this.packages = data.packages
        this.defaultPrice();
        // var urlParams = new URLSearchParams(window.location.search);
        // if(urlParams.has('recharge')){
        //   $("#recharge-tab").trigger("click");
        // }
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

  getKmsPurchase(){ 
    this.usersService.get_kms_purchase(this.car_id)
    .subscribe(
      (data:any) => {
        console.log(data);
        this.purchases = [];
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
        // this.purchases = data;
        // console.log(this.purchases)
    });
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
      this.getTrips();
    }
  }

  get_nip(){
    let siguiente = true;
     this.usersService.get_nip(this.nip).subscribe(
      (data: any)=>{
        console.log(data)
        if(data.respose == siguiente){
          //this.getTrips();
          this.view_trips = 2;
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
    this.usersService.get_trips(this.car_id).subscribe(
      (data: any) => {
        console.log(data);
        this.id_trip = data.id
        if(data){
          this.has_trip = true
          for(let trip of data) {
            this.trips.push(trip);
          }
        }else{
          this.has_trip = false
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
     this.usersService.get_trips_by_date(this.car_id).subscribe(
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

  car_error(title, header, error){
    this.title_modal_mechanic = title
    this.header_modal_mechanic = header
    this.error_modal = error
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
            this.map = L.map('map');
             
            L.tileLayer('http://mt.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
              attribution: '<a href="https://sxkm.mx">SXKM</a> Google Maps, INEGI'
            }).addTo(this.map);

            this.map.setView(start, 12);

            var Start_icon = L.marker(start,{
              icon: L.icon({
              iconUrl: "assets/img/origen.png",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
              })
            }).bindTooltip(this.start_trip);

            var End_icon = L.marker(end,{
              icon: L.icon({
              iconUrl: "assets/img/destino.png",
              iconSize:     [20, 30],
              iconAnchor:   [0, 30]
              })
            }).bindTooltip(this.end_trip); 

            var line = L.polyline(data.latLngs,{color: "#76bd1d"}).addTo(this.map).addTo(this.map);
            var line2 = L.polyline(data.high, {color: "red"}).bindTooltip("Velocidad mayor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line3 = L.polyline(data.medium, {color: "blue"}).bindTooltip("Velocidad mayor a 40 kms/hr y menor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line4 = L.polyline(data.low, {color: "green"}).bindTooltip("Velocidad menor a 40 kms/hr", {"sticky":true}).addTo(this.map);

            this.map.invalidateSize();
            Start_icon.addTo(this.map);
            End_icon.addTo(this.map); 
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
