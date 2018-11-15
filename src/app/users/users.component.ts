import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import Swiper from 'swiper';
import swal from 'sweetalert'
declare var $:any;
declare let L;
import Chart from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // car
  car: any;
  car_id:any;
  rate_car: any;
  packages: any[];
  maker: any;
  model:any;
  vin:any;
  plates: any;
  version:any;
  year:any;
  policy_number:any;
  policy_status: any;
  policy_start: any;
  policy_expires: any;
  policy_token: any;
  policy_user_id: any;
  aig_id:any;
  purchased_kms: any;
  covered_kms: any;
  km_left: any;
  last_purchase_date: any;
  last_trip_record_at:any;
  //car errors
  title_modal_mechanic:any;
  header_modal_mechanic:any;
  error_modal:any;
  error_car:any[]
  errors_car:any;
  description_error :any [];
  // viajes
  nip:any="";
  error_nip:any = "";
  purchases: any = [];
  id_trip:any;
  map:any;
  map2:any;
  view_trips: number = 1;
  list_trips: boolean = true;
  trips: any = [];
  trips_group: any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
  date_trip_end: any;
  has_trip:boolean;

  // variables de paginacion
  q: any = 1;
  p: any = 1;
  t: any = 1;
  select_package = false;

  x:any = Array();
  y:any = Array();
  z:any = Array();
  tiempo:any= Array();

  at: any = Array();
  speed:any =  Array();
  speed_limit: any = Array();
  avg_speed_limit: any = Array()
  contextual_speed: any = Array();

  score: any = 0;
  speedings: any = 0;
  hard_accelerations: any = 0;
  hard_brakers: any = 0;
  turns: any = 0;
  topes: number = 0;
  baches: number = 0;

  distance: any = 0;
  max_speed: any = 0;
  avg_speed: any = 0;
  gas: any = 0;
  time: any = 0;
  time_stop: any = 0;

  suscription: boolean = false;
  checkbox_suscription: boolean = false;
  get_last_dtc: any;
  get_monthly_payments: any = null;
  last_trip_record:any;
  list_monthly_payments: any [];

  package_validate:boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router,private spinner: NgxSpinnerService, private usersService: UsersService) { }

	ngOnInit() {
    //this.route.snapshot.params['id'];
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
      this.getCarBasic();
      this.getKmsPurchase();
      localStorage.removeItem('package')
    });
		
  }

  getCarBasic(){
    this.usersService.getCarBasic(this.car_id).subscribe(
      (data: any)=>{
        console.log(data)
        this.list_monthly_payments = [];
        if(data){
          this.car = data
          this.rate_car = this.car.rate
          this.last_trip_record = this.car.last_trip_record
          this.get_last_dtc = this.car.get_last_dtc
          this.maker = this.car.maker 
          this.version = this.car.version
          this.model = this.car.model
          this.vin = this.car.vin
          this.year = this.car.year
          this.plates = this.car.plates
          this.policy_number = this.car.policy_number
          this.aig_id = this.car.policy.aig_id
          this.policy_expires = this.car.policy.expires_at
          this.policy_start = this.car.policy.began_at
          this.policy_status = this.car.policy.human_state
          this.purchased_kms= this.car.purchased_kms
          this.covered_kms= this.car.covered_kms
          this.km_left= this.car.km_left
          this.last_purchase_date= this.car.ast_purchase_date
          this.policy_token = this.car.policy_token
          this.policy_user_id = this.car.policy_user_id
          this.errors_car = this.car.get_last_dtc.dtc_codes.length
          this.last_trip_record_at = this.car.last_trip_record_at
          this.description_error =this.car.get_last_dtc_description.car_errors
          for(let monthlypayments of this.car.policy.get_monthly_payments){
            this.list_monthly_payments.push(monthlypayments)
          }   
          //   this.car.policy.get_monthly_payments.sort(function(a,b){
          //     return (b.id) - (a.id);
          //   });
          // }
          this.get_packages()
        }
      })
  }

  changeSuscription(){
		if(this.checkbox_suscription) this.checkbox_suscription = false;
		else this.checkbox_suscription = true;
	}

  get_packages(){
    console.log("rate " + this.rate_car)
    this.usersService.getPackageByCost(this.rate_car).subscribe(
      (data: any) => {
        console.log(data);
        this.packages = [];
        if (data){
          for(let package_kilometers of data) {
            this.packages.push(package_kilometers)
          }
        }
        //this.packages = data.packages
        // var urlParams = new URLSearchParams(window.location.search);
        // if(urlParams.has('recharge')){
        //   $("#recharge-tab").trigger("click");
        // }
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  get_select_package(event,package_select){
    this.select_package = package_select
    
  }

  confirm_package(){
    console.log(this.select_package)
    if(this.select_package){
      localStorage.setItem('package', JSON.stringify(this.select_package))
      console.log(this.select_package)
      window.location.href = '/user/pago/recarga-kilometros/'+this.car_id
      //this.route.navigateByUrl('/user/pago/recarga-kilometros/'+this.car_id)
      //this.router.navigate(['/user/pago/recarga-kilometros/'+this.car_id])
    }else{
      swal('Debes seleccionar un paquete de kilometros','error')
    }

  }
  
  // isActive(package_select){
  //   return this.select_package === package_select 
  // }

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
        }
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
    this.spinner.show();
    this.usersService.get_trips(this.car_id).subscribe(
      (data: any) => {
        console.log(data);
        this.id_trip = data.id
        //this.trips = [];
        if(data){
          this.has_trip = true
          for(let trip of data) {
            this.trips.push(trip);
          }
        }else{
          this.has_trip = false
        }
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  get_trips_by_date(date: any) {
    //var param = new Date(date).toLocaleDateString("en-us");
    // console.log(date);
    this.spinner.show();
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
        this.spinner.hide();
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
    console.log(id);
    this.id_trip = id;
    // this.spinner.show();
    this.usersService.get_trip_details(this.id_trip).subscribe(
      (data: any) => {

        this.hard_accelerations = data.hard_accelerations.length;
        this.hard_brakers = data.hard_brakes.length;
        this.max_speed = data.max_speed;
        this.gas = data.fuel_used;
        this.time_stop = (data.idling_time/60).toFixed(0);
        this.time = data.duration;
        this.distance = data.distance;
        this.score = data.score;

          this.start_trip = data.start_point.address.replace("Inicio | ", "");
          this.end_trip = data.end_point.address
          this.date_trip = data.start_point.at
          this.date_trip_end = data.end_point.at
          var start = data.start_point.latLng;
          var end = data.end_point.latLng;
          
          if (this.map != undefined || this.map != null) {    
            this.map.remove();
          }  
            this.map = L.map('map');
            L.tileLayer('http://mt.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
              attribution: '<a href="https://sxkm.mx">SXKM</a> Google Maps, INEGI'
            }).addTo(this.map);

            this.map.setView(start, 13);

            var Start_icon = L.marker(start,{
              icon: L.icon({
              iconUrl: "assets/img/users/bandera.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
              })
            }).bindTooltip(this.start_trip);

            var End_icon = L.marker(end,{
              icon: L.icon({
              iconUrl: "assets/img/users/pin.svg",
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
            let i = Math.round(data.latLngs.length / 3)
            this.map.panTo(data.latLngs[i]);
            this.getForceG();
            
      },
      (error: any) => {
        console.log(error);
      }
    );
    this.usersService.getSpeedService(this.id_trip).subscribe(
      (data:any) =>{
        this.at= Array();
        this.speed=  Array();
        this.speed_limit = Array();
        this.avg_speed_limit = Array()
        this.contextual_speed= Array();
        //let speeds = JSON.parse(data.speeds);
        data.speeds.forEach(element => {
          var d = element.at.replace(".000Z", "")
          d = d.replace("T"," ") 
          this.at.push(d);
          this.contextual_speed.push(element.contextual_speed);
          this.speed.push(element.speed);
          //this.avg_speed_limit.push(element.link_associated.avg_speed_limit);
          this.speed_limit.push(element.link_associated.speed_limit);
        });
        this.avg_speed = this.speed.reduce(function(a, b){
          return parseInt(a) + parseInt(b); //Regresa el acumulador más el siguiente
        }, 0); //Pero si no encuentras nada o no hay siguiente, regresa 0
        this.avg_speed = (this.avg_speed / this.speed.length).toFixed(2);

        var ctx = document.getElementById("speeds");
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: this.at,
              datasets: [{
                  label: 'Velocidad de trafico',
                  data: this.contextual_speed,
                  backgroundColor: [
                    'transparent',
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                  ],
                  borderWidth: 1
              },{
                label: 'Velocidad',
                  data: this.speed,
                  backgroundColor: [
                    'transparent',
                  ],
                  borderColor: [
                      'rgba(255, 206, 86, 1)',
                  ],
                    borderWidth: 1
              },{
                label: 'Limte de velcidad',
                data: this.speed_limit,
                backgroundColor: [
                    'transparent',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
              }]
          },
          options: {
            elements: { 
              point:{ 
               radius: 0 
              } 
            }, 
              scales: {
                  yAxes: [{
                      ticks: {
                        beginAtZero:true
                        //stepSize: 1
                      }
                  }]
              },
          }
        });

        this.spinner.hide();
      }
    )
  }

  getForceG(){
    console.log(this.id_trip);
    this.y = Array();
    this.x = Array();
    this.z = Array();
    this.tiempo = Array();
    this.usersService.getForce(this.id_trip).subscribe(
      (data:any)=>{
        //console.log(data)
        data.y_axis_negative.forEach(item => {
          //this.y = item[2] * -1
          this.y.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          console.log(JSON.stringify(item[4]))
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/derecha.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        data.y_axis_positive.forEach(item => {
          //this.y = item[2] * -1
          this.y.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/izquierda.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        this.y.push(0)
        data.x_axis_negative.forEach(item => {
          //this.y = item[2] * -1
          this.x.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/salpicadero.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        data.x_axis_positive.forEach(item => {
          //this.y = item[2] * -1
          this.x.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/salpicadero.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        this.x.push(0)
        data.z_axis_negative.forEach(item => {
          this.z.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/bache.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        data.z_axis_positive.forEach(item => {
          console.log(item)
          this.z.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/users/tope.svg",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
            }) 
          }).addTo(this.map)
          return marker
        })
        this.z.push(0)
        this.tiempo.splice(9,20)
        //console.log(this.tiempo)
        this.turns = this.x.length;
        this.topes = data.z_axis_positive.length;
        this.baches = data.z_axis_negative.length;
        this.speedings = data.y_axis_positive.length;
        console.log("TOPES: "+this.topes)
        let ctx = document.getElementById("fuerzas-g");
        let myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: this.tiempo,
              datasets: [{
                  label: 'Línea recta',
                  data: this.y,
                  backgroundColor: [
                    'transparent',
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                  ],
                  borderWidth: 1
              },{
                label: 'Topes y baches',
                  data: this.z,
                  backgroundColor: [
                    'transparent',
                  ],
                  borderColor: [
                      'rgba(255, 206, 86, 1)',
                  ],
                  borderWidth: 1
              },{
                label: 'Vueltas',
                  data: this.x,
                  backgroundColor: [
                      'transparent',
                  ],
                  borderColor: [
                      'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1
              }]
          },
          options: {
            elements: { 
              point:{ 
               radius: 0 
              },
              line:{
                tension: 0
              }
            }, 
            scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero:true,
                    //maxRotation: 0.1
                    //stepSize: 1
                  }
              }],
              xAxes: [{
                ticks: {
                  beginAtZero:true,
                  //maxRotation: 0.1
                  //stepSize: 1
                }
              }]
            },
          }
        });
      }
    )

  }
}
