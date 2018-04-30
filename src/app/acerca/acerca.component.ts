import { Component, OnInit } from '@angular/core';
declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {
  title = 'Acerca de - Seguro por kilómetro';
  constructor() { }

  ngOnInit() {
  	$("#carouselAcerca").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if(direction=='right')
            $("#carouselAcerca").carousel('prev');
          else 
            $("#carouselAcerca").carousel('next');
          console.log("You swiped " + direction );  
        },
      });
  	}

}
