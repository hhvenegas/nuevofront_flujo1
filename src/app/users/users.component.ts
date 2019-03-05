import { Component, OnInit, Inject, PLATFORM_ID, LOCALE_ID} from '@angular/core';
import { isPlatformBrowser, registerLocaleData, formatCurrency, getLocaleCurrencySymbol } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Location, DatePipe} from '@angular/common';
import Swiper from 'swiper';
import swal from 'sweetalert'
declare var $:any;
declare var _:any;
declare let L;
import Chart from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
//import { ENGINE_METHOD_DIGESTS } from 'constants';
import { Level } from '../constants/level';
import { allResolved } from 'q';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Es' }],//
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
  aig_rewards: any;
  purchased_kms: any;
  covered_kms: any;
  km_left: any;
  package_id = 1000;
  last_purchase_date: any;
  last_purchase: any;
  last_trip_record_at:any;
  obd_connected: any;
  obd_events: any[];
  //car errors
  title_modal_mechanic:any;
  header_modal_mechanic:any;
  error_modal:any;
  error_car:any[]
  errors_car:any;
  description_error :any [];
  data:any[];
  tripsModalData:any=[];
  has_subscription:any;

  // viajes
  nip:any="";
  error_nip:any = "";
  purchases: any = [];
  id_trip:any;
  map:any;
  map2:any;
  view_trips: number = 1;
  list_trips: any;
  trips: any = [];
  trips_group: any = [];
  start_trip: any;
  end_trip: any;
  date_trip: any;
  date_trip_end: any;
  has_trip:boolean;

  covered_kilometers: any = 0;
  hard_brakes: any = 0;
  idling_time: any = 0;
  speeding_events: any =[];
  total_score: any;
  trips_total_distances: any = [];
  fuel_used: any = [];
  trips_distance: any = 0;
  date_trip_start:any = Array();
  trips_total: any = 0; 
  date_trip_start_week:any;
  trips_total_week: any = 0;
  total_score_week: any = 0;
  uncovered_kilometers: any = 0;
  habitos_tab: boolean = false;
  date_from:any;
  date_to:any;
  groups:any;
  label:any;

  valorSelect:any;

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
  level_image:any;
  level_points:any;
  level_rewards:any;
  levels: Level[];
  level_stay: any;
  level_name:any;

  tripsChart:any;

  tabAuto:string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router,private spinner: NgxSpinnerService, private usersService: UsersService) {
    registerLocaleData(es);
  }

	ngOnInit() {
    //this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
      localStorage.removeItem('package')
      document.getElementById("loading_principal").style.width ="100%";
      this.getCarBasic();
      this.getLevels();
      this.getKmsPurchase();
      //this.get_trips_by_week(); 
      this.valorSelect = "semana"
      this.imprimirValor(this.valorSelect)
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
          this.maker = this.car.maker 
          this.version = this.car.version
          this.model = this.car.model
          this.vin = this.car.vin
          this.year = this.car.year
          this.plates = this.car.plates
          this.policy_number = this.car.policy.policy_number
          this.aig_id = this.car.policy.aig_id
          this.policy_expires = this.car.policy.expires_at
          this.policy_start = this.car.policy.began_at
          this.policy_status = this.car['can_request_sos?'].has_policy_active
          this.purchased_kms= this.car.purchased_kms
          this.covered_kms= this.car.covered_kms
          this.km_left= this.car.km_left
          this.policy_token = this.car.policy.policy_token
          this.policy_user_id = this.car.policy.user_id
          this.has_subscription = this.car.policy.has_subscription;
          this.aig_rewards = this.car.aig_rewards_points;
          if(this.aig_rewards > 0 && this.aig_rewards <= 12000){
            this.level_stay = 1
          }else if(this.aig_rewards >= 12001 && this.aig_rewards <= 18000){
            this.level_stay = 2
          }else if(this.aig_rewards >= 18001 && this.aig_rewards <= 24001){
            this.level_stay = 3
          }else if(this.aig_rewards > 24001){
            this.level_stay = 4
          }
          this.obd_connected = this.car['can_request_sos?'].has_obd_connected;
          for(let monthlypayments of this.car.policy.get_monthly_payments){
            this.list_monthly_payments.push(monthlypayments)
            this.list_monthly_payments.sort(function(a,b){
               return (b.id) - (a.id);
            });
          }   
          this.get_packages()
        }
    })
  }

  get_event_obd(){
    this.usersService.event_obd(this.car_id).subscribe(
      (data:any)=>{
        console.log(data)
        this.obd_events = [];
        if(data){
          for(let obd_events of data)
          this.obd_events.push(obd_events)
          this.obd_events.sort(function(a,b){
            return (b.id) - (a.id);
         });
        }
      }
    )
  }

  getLevels(): void {
    this.usersService.getLevels().subscribe(
      levels => this.levels = levels
    )
  }

  get_Levels_Details(level){
    this.usersService.getLevels().subscribe(
      (levels: any) => {
        this.levels = levels
        this.levels.forEach(element => {
          if(element.url == level){
            this.level_image = element.image
            this.level_points = element.points
            this.level_rewards = element.beneficios
            this.level_name = element.level
          }
        });
    })
  }

  auto(){
    document.getElementById("loading_auto").style.width = "100%";
    this.usersService.getCarBasic(this.car_id).subscribe(
      (data: any)=>{
        console.log(data)
        this.get_last_dtc = this.car.get_last_dtc.dtc_count
        //this.errors_car = this.car.get_last_dtc.dtc_count
        this.last_trip_record = this.car.last_trip_record
        this.last_trip_record_at = this.car.last_trip_record.at
        this.description_error = this.car.get_last_dtc_description.car_errors
        document.getElementById("loading_auto").style.width = "0%";
      }
    )
  }

  changeSuscription(){
		if(this.checkbox_suscription) this.checkbox_suscription = false;
		else this.checkbox_suscription = true;
  }
  
  cancel_subscription(){
  let json =  {"policy_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].policy_id}
  return new Promise((resolve, reject) => {
   this.usersService.cancel_subscription(json).subscribe(
     data => {
      console.log(data)
      swal('Se cancelo tu subscripción exitosamente','Tu subscripción fue dada de baja de manera exitosa','success')
     },
     error => {
       reject(error);
       swal('Error al cancelar Subscripción','Ocurrio un problema al momento de realizar la cancelación de la subscripción','error')
     }
   )
  });
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
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  mouseHover(id){
		this.package_id = id;
	}

  get_select_package(event,package_select){
    this.select_package = package_select
  }

  confirm_package(packages){
    this.select_package = packages;
    localStorage.setItem('package', JSON.stringify(this.select_package))
    window.location.href = '/user/pago/recarga-kilometros/'+this.car_id
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
            this.purchases.sort(function(a,b){
              return (b.id) - (a.id);
           });
          }
        }
        document.getElementById("loading_principal").style.width="0%";
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
      let siguiente = true;
      this.usersService.get_nip(this.nip).subscribe(
        (data: any)=>{
          console.log(data)
          if(data.respose == siguiente){
            //this.getTrips();
            this.getTrips();
          }else{
            this.error_nip="NIP incorrecto"
          }
        },
        (error: any)=>{
          console.log(error)
        }
      )
    }
  }

  /* get_nip(){
    let siguiente = true;
     this.usersService.get_nip(this.nip).subscribe(
      (data: any)=>{
        console.log(data)
        if(data.respose == siguiente){
          //this.getTrips();
          this.getTrips();
        }else{
          this.error_nip="NIP incorrecto"
        }
      },
      (error: any)=>{
        console.log(error)
      }
    )
  }
 */

  viewAllTrips(){
    document.getElementById("loading_viajes").style.width = "100%";
    this.getTrips();
  }

  getTrips(){
    this.view_trips = 2;
    this.usersService.get_trips(this.car_id).subscribe(
      (data: any) => {
        console.log(data);
        this.trips = [];
        this.id_trip = data.id
        if(data){
          for(let trip of data) {
            this.trips.push(trip);
          }
        }
        document.getElementById("loading_viajes").style.width = "0%";
      },
      (error: any)=>{
        swal("No se pudiero cargar tus viajes","Inténtalo nuevamente","error");
        this.view_trips = 1
        console.log(error)
      }
    )
  }
  

  get_trips_by_date(date: any) {
    //var param = new Date(date).toLocaleDateString("en-us");
    // console.log(date);*
    let param = date;
    if(param == null || param == "" ){
      swal("No se pueden cargar viajes", "Ingrese una fecha", "error")
      return
    }else{
      this.trips = [];
      document.getElementById("loading_viajes").style.width = "100%";
      this.usersService.get_trips_by_date(this.car_id).subscribe(
        (data: any) => {        
         if(data){
           this.list_trips = false;
           for(let trip of data) {
           //var date_trip = new Date(trip.started_at).toLocaleDateString("en-us");
           let date_trip = trip.started_at.substring(0,10);
           //var param = new Date(date).toLocaleDateString("en-us");
              if (date_trip == param){
                this.list_trips = true;
               //console.log(trip);
               //this.trips = trip;
               this.trips.push(trip);
              }
            }
            if(!this.list_trips){
              swal("No se econtrarón viajes","Seleccione otra fecha","error");
            }
          }
          document.getElementById("loading_viajes").style.width = "0%";
        },
       (error: any) => {
        swal("No se pudiero cargar tus viajes","Inténtalo nuevamente","error");
        this.view_trips = 2
         console.log(error)
       }
     );
    }
    
  }

  imprimirValor(valor){
    document.getElementById("loading_dateWeek").style.width="100%";
    if(valor == "semana"){
      var diasRes = 7; 
      this.date_from = new Date();
      this.date_from.setDate(this.date_from.getDate() - diasRes)
      var diaSum = this.date_from.getDate();
      var mesSum = this.date_from.getMonth()+1;
      var añoSum = this.date_from.getFullYear();
      this.date_from = añoSum + "-" + mesSum + "-" + diaSum 
      this.date_to = new Date();
      var dia = this.date_to.getDate();
      var mes = this.date_to.getMonth()+1;
      var año = this.date_to.getFullYear();
      this.date_to = año + "-" + mes + "-" + dia
      this.groups = "day";
      this.get_trips_range_date(this.date_from , this.date_to, this.groups)
      //alert(this.date_to)
    }else if(valor == "mes"){
      var diasRes = 30; 
      this.date_from = new Date();
      this.date_from.setDate(this.date_from.getDate() - diasRes)
      var diaSum = this.date_from.getDate();
      var mesSum = this.date_from.getMonth()+1;
      var añoSum = this.date_from.getFullYear();
      this.date_from = añoSum + "-" + mesSum + "-" + diaSum
      this.date_to = new Date();
      var dia = this.date_to.getDate();
      var mes = this.date_to.getMonth()+1;
      var año = this.date_to.getFullYear();
      this.date_to = año + "-" + mes + "-" + dia
      this.groups = "week";
      this.get_trips_range_date(this.date_from , this.date_to, this.groups)
    }else if(valor == "mesActual"){
      this.date_from = new Date();
      var primerDia = 1;
      var diaSum = this.date_from.getDate();
      var mesSum = this.date_from.getMonth()+1;
      var añoSum = this.date_from.getFullYear();
      this.date_from = añoSum + "-" +  mesSum + "-" + primerDia;
      this.date_to = new Date(this.date_from);
      var ultimoDia = (this.date_to.getDay()-5)*(-1);
      this.date_to.setDate(this.date_to.getDate()+ ultimoDia)
      var dia = this.date_to.getDate();
      var mes = this.date_to.getMonth()+2;
      var año = this.date_to.getFullYear();
      this.date_to = año + "-" + mes + "-" + dia;
      this.groups = "week";
      this.get_trips_range_date(this.date_from , this.date_to, this.groups)
    }else if(valor == "año"){
      var diasRes = 365; 
      this.date_from = new Date();
      this.date_from.setDate(this.date_from.getDate() - diasRes)
      var diaSum = this.date_from.getDate();
      var mesSum = this.date_from.getMonth()+1;
      var añoSum = this.date_from.getFullYear();
      this.date_from = añoSum + "-" + mesSum + "-" + diaSum
      this.date_to = new Date();
      var dia = this.date_to.getDate();
      var mes = this.date_to.getMonth()+1;
      var año = this.date_to.getFullYear();
      this.date_to = año + "-" + mes + "-" + dia
      this.groups = "month";
      this.get_trips_range_date(this.date_from , this.date_to, this.groups)
      //alert(this.date_to)
    }
  }

  get_trips_range_date(date_from, date_to, groups){
    // this.habitos_tab = true;
    this.groups = groups;
    this.date_from = date_from;
    this.date_to = date_to;
    this.usersService.get_trips_range_date(this.car_id, this.date_from, this.date_to, this.groups).subscribe(
      (data:any)=>{
        // var refreshId =  setInterval( function(){
        //   document.getElementById("loading_dateWeek").style.display="none";
        // },2000 );
        //console.log(data)
        this.data = data
        this.date_trip_start = Array();
        this.label = Array();
        var scoreArray = []
        this.total_score = [];
        this.trips_total_distances = 0;
        this.fuel_used = 0;
        this.hard_brakers = 0;
        this.hard_accelerations = 0;
        this.speedings = 0;
        var scoreTotal = 0;
        for(let trips_range in data){
          this.label.push(trips_range)
          var obj = data[trips_range]
          this.trips_total += obj.length;
          for(let tripss in obj){
            this.trips_total_distances += Number(Math.round(obj[tripss].distance) * 100) / 100
            this.fuel_used += Number(obj[tripss].fuel_used);
            this.hard_brakers += obj[tripss].hard_brake_events.length
            this.hard_accelerations += obj[tripss].hard_acceleration_events.length
            this.speedings += obj[tripss].speeding_events.length
            scoreTotal += Number(Math.round(obj[tripss].grade/this.trips_total)*100)/100;
            if (scoreTotal > 100){
              scoreTotal = 100
            }
            var w = trips_range.replace("-", "")
          }
          //console.log(scoreTotal)
          let dataModal = {
            distance: this.trips_total_distances,
            fuel_used: this.fuel_used,
            hard_brakes: this.hard_brakers, 
            hard_accelerations: this.hard_accelerations,
            hard_speeding: this.speedings       
          }
          this.tripsModalData.push(dataModal)
          scoreArray.push(scoreTotal)
          scoreTotal = 0
          this.trips_total = 0;
        }
        var min = Math.min.apply(null, scoreArray)
        var max = Math.max.apply(null, scoreArray)
        //console.log(min)
        //console.log(max)
        console.log(JSON.stringify(this.tripsModalData))
        if (this.tripsChart) {
          this.tripsChart.destroy();
        }
        let ctx = document.getElementById("trips");
        this.tripsChart = new Chart(ctx,{
          type: 'line',
          data: {
              labels: this.label,
              datasets: [{	
                  label: 'Calificación',
                  data: scoreArray,
                  backgroundColor: [
                    'transparent',
                  ],
                  borderColor: [
                      'rgb(15,49,42)',
                  ],
                  borderWidth: 2
              }]
          },
          options: {
            bezierCurve : true,
            elements: { 
              // point:{ 
              //     radius: 2,
              // },
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: "Calificación por viaje",
                  fontFamily: "OpenSansFont",
                  fontColor: "black",
                  fontSize: 15,
                },
                ticks: {
                  beginAtZero:true,
                  fontFamily: "OpenSansFont",
                  fontColor: "black",
                  fontSize: 12,
                  min: min,
                  max: max
                  //maxRotation: 0.1
                  //stepSize: 1
                }
              }],
              xAxes: [{
                ticks: {
                  beginAtZero:true,
                  fontFamily: "OpenSansFont",
                  fontColor: "black",
                  fontSize: 12
                  //maxRotation: 0.1
                  //stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: "Rango de fecha",
                  fontFamily: "OpenSansFont",
                  fontColor: "black",
                  fontSize: 15,
                }
              }]
            },
            onClick: (evt, activeElements) =>{
              console.log(activeElements)
              if (activeElements[0]){
                var elementIndex = activeElements[0]._index; 
                this.score = this.tripsChart.data.datasets[0].data[elementIndex]
                this.start_trip = this.tripsChart.data.labels[elementIndex]
                //var w = this.start_trip.replace("-","")
                this.trips_total_distances = this.tripsModalData[elementIndex].distance
                this.fuel_used = this.tripsModalData[elementIndex].fuel_used
                this.hard_brakers = this.tripsModalData[elementIndex].hard_brakes
                this.hard_accelerations = this.tripsModalData[elementIndex].hard_accelerations
                this.speedings = this.tripsModalData[elementIndex].hard_speeding
                $("#modal-grafica").modal("show");
              }
            }
          }
        });
        document.getElementById("loading_dateWeek").style.width="0%";
      }
    );
  }

  showData(event:any){
    console.log("hola")
    var data = this.tripsChart.getElementAtEvent(event)
    console.log(data[0]._model)
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
              iconSize:     [40, 45],
              iconAnchor:   [20, 46]
              })
            }).bindTooltip(this.start_trip);

            var End_icon = L.marker(end,{
              icon: L.icon({
              iconUrl: "assets/img/users/pin.svg",
              iconSize:     [40, 45],
              iconAnchor:   [20, 46]
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
        console.log(data)
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
        var speedChart = new Chart(ctx, {
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
            bezierCurve : true,
            elements: { 
              point:{ 
               radius: 0
              },
            }, 
            scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero:true,
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

  getForceG(){
    console.log(this.id_trip);
    this.y = Array();
    this.x = Array();
    this.z = Array();
    this.tiempo = Array();
    this.usersService.getForce(this.id_trip).subscribe(
      (data:any)=>{
        console.log(data)
        data.y_axis_negative.forEach(item => {
          //this.y = item[2] * -1
          this.y.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          console.log(JSON.stringify(item[4]))
          var marker = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Giros_bruscos.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("VUELTA A LA IZQUIERDA").addTo(this.map)
          return marker
        })
        data.y_axis_positive.forEach(item => {
          //this.y = item[2] * -1
          this.y.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker2 = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Giros_bruscos.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              // shadowSize:   [50, 80], // size of the shadow
              // shadowAnchor: [4, 62], 
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("VUELTA A LA DERECHA").addTo(this.map)
          return marker2
        })
        this.y.push(0)
        data.x_axis_negative.forEach(item => {
          //this.y = item[2] * -1
          this.x.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker3 = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Acelerados_bruscos.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              // shadowSize:   [50, 80], // size of the shadow
              // shadowAnchor: [4, 62], 
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("ACELERADO BRUSCO").addTo(this.map)
          return marker3
        })
        data.x_axis_positive.forEach(item => {
          //this.y = item[2] * -1
          this.x.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker4 = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Frenados_bruscos.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              // shadowSize:   [50, 80], // size of the shadow
              // shadowAnchor: [4, 62], 
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("FRENADOS BRUSCOS").addTo(this.map)
          return marker4
        })
        this.x.push(0)
        data.z_axis_negative.forEach(item => {
          this.z.push(item[2] * -1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker5 = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Baches.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              // shadowSize:   [50, 80], // size of the shadow
              // shadowAnchor: [4, 62], 
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("BACHES").addTo(this.map)
          return marker5
        })
        data.z_axis_positive.forEach(item => {
          console.log(item)
          this.z.push(item[2]*1)
          let d = item[1].replace(".000Z", "")
          d = d.replace("T", " ")
          this.tiempo.push(d)
          var marker6 = L.marker([item[4], item[5]],{
            icon: L.icon({
              iconUrl: "assets/img/map-icons/Topes.png",
              iconSize:     [40, 45], // size of the icon
              iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
              // shadowSize:   [50, 80], // size of the shadow
              // shadowAnchor: [4, 62], 
              popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            }) 
          }).bindTooltip("TOPES").addTo(this.map)
          return marker6
        })
        this.z.push(0)
        this.tiempo.splice(9,20)
        //console.log(this.tiempo)
        this.turns = this.x.length;
        this.topes = data.z_axis_positive.length;
        this.baches = data.z_axis_negative.length;
        this.speedings = data.y_axis_positive.length;
        // console.log("TOPES: "+this.topes)
        let ctx = document.getElementById("fuerzas-g");
        let gforceChart = new Chart(ctx, {
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
            bezierCurve : true,
            elements: { 
              point:{ 
               radius: 0 
              },
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