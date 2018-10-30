import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  trip_id:any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.trip_id = params.id_trip
      //console.log(this.car_id)
      this.get_trip_details()
    });
  }

  get_trip_details(){
    this.trip_id
    this.usersService.get_trip_details(this.trip_id).subscribe(
      (data: any) => {
        console.log(data); 
          this.start_trip = data.start_point.address
          console.log(this.start_trip)
          this.end_trip = data.end_point.address
          this.date_trip = data.start_point.at
          // var start = data.start_point.latLng;
          // var end = data.end_point.latLng;
          
        
          // if (this.map != undefined || this.map != null) {    
          //   this.map.remove();
          // }  
          // this.map = Leaflet.map('map');
             
          //   Leaflet.tileLayer('http://mt.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
          //     attribution: '<a href="https://sxkm.mx">SXKM</a> Google Maps, INEGI'
          //   }).addTo(this.map);

          //   this.map.setView(start, 12);

          //   var Start_icon = Leaflet.marker(start,{
          //     icon: Leaflet.icon({
          //     iconUrl: "assets/img/origen.png",
          //     iconSize:     [20, 30],
          //     iconAnchor:   [12, 20]
          //     })
          //   }).bindTooltip(this.start_trip);

          //   var End_icon = Leaflet.marker(end,{
          //     icon: Leaflet.icon({
          //     iconUrl: "assets/img/destino.png",
          //     iconSize:     [20, 30],
          //     iconAnchor:   [0, 30]
          //     })
          //   }).bindTooltip(this.end_trip); 

          //   var line = Leaflet.polyline(data.latLngs,{color: "#76bd1d"}).addTo(this.map).addTo(this.map);
          //   var line2 = Leaflet.polyline(data.high, {color: "red"}).bindTooltip("Velocidad mayor a 70 kms/hr", {"sticky":true}).addTo(this.map);
          //   var line3 = Leaflet.polyline(data.medium, {color: "blue"}).bindTooltip("Velocidad mayor a 40 kms/hr y menor a 70 kms/hr", {"sticky":true}).addTo(this.map);
          //   var line4 = Leaflet.polyline(data.low, {color: "green"}).bindTooltip("Velocidad menor a 40 kms/hr", {"sticky":true}).addTo(this.map);
          
      
          //   // $('#detalle_viaje').modal('open');   
          //   this.map.invalidateSize();
          //   Start_icon.addTo(this.map);
          //   End_icon.addTo(this.map); 
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
