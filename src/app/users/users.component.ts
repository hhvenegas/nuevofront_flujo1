import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import Swiper from 'swiper';
import Leaflet from 'leaflet'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  car: any = null;
  car_id:any;
  nip:any="";
  error_nip:any = "";
  purchases: any = null;
  id_trip:any;
  map:any;
  view_trips: number = 1;
  list_trips: boolean = true;
  trips: any = [];
  trips_group: any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
	q: any = 1;
  p: any = 1;
  t: any = 1;


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
      console.log(this.car)
    });
  }

  getKmsPurchase(){ 
    this.usersService.get_kms_purchase(this.car_id)
    .subscribe(
      (data:any) => {
        this.purchases = data;
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
          this.getTrips();
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
          
      
            // $('#detalle_viaje').modal('open');   
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
