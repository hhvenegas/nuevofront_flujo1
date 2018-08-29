import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as $ from 'jquery';
declare var M:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  	constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  	ngOnInit(){
  		if (isPlatformBrowser(this.platformId)) {
  			 M.AutoInit();
  		}
  	}

}
