import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';

import * as $ from 'jquery';
declare var M:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  	landing: any = 1;
  	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router) { }

  	ngOnInit(){
  		if (isPlatformBrowser(this.platformId)) {
  			console.log("HOLA:  "+this.route.snapshot.params['landing']);
  			if(this.router.url!="/"){
	  			console.log("HOLA22")
	  			if(this.route.snapshot.params['landing']=='/aig')
			    	this.landing = 2;
			    if(this.route.snapshot.params['landing']=='/potosi')
			    	this.landing = 3;
			}
  		}

	    console.log("Landing: "+this.landing);
  	}

}
