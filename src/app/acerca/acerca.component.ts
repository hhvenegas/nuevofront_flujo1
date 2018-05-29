import { Component, OnInit } from '@angular/core';
declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent implements OnInit {
  title = 'Acerca de - Seguro por kilometro';
  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  constructor() { }

  ngOnInit() {
  }
  // action triggered when user swipes
  swipe(carousel, action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      $("#"+carousel).carousel('prev');
      console.log("DErecha");
    }
    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      $("#"+carousel).carousel('next');
      console.log("Izquierda0");
    }
  }

}
