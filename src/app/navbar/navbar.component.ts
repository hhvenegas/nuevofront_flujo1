import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router,ActivatedRoute, NavigationStart } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { LoginService } from '../services/login.service';

import * as $ from 'jquery';
declare var M:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  	landing: any = 1;
    navbar: any ="";
  	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private loginService: LoginService) { }

  	ngOnInit(){
      console.log("INICIO")
       if (isPlatformBrowser(this.platformId)) {
    		this.router.events.subscribe(event => {
          if(event instanceof NavigationStart) {
            let URLactual = window.location.pathname;
            if(URLactual=="/"){
              localStorage.setItem("landing","");
            }
            if(URLactual=="/aig"){
              localStorage.setItem("landing","aig");
            }
            if(URLactual =="/potosi"){
              localStorage.setItem("landing","potosi");
            }
            this.landing = localStorage.getItem("landing");


            //SESSION
            if(localStorage.getItem('user')){
              this.navbar = localStorage.getItem("user");
              console.log("El usuario es: "+this.navbar);
            }    
          }
        });
      }
  	}
    logout(){
      this.loginService.logout().subscribe(
        (data:any)=>{
          localStorage.removeItem("user");
          localStorage.removeItem("rol");
          localStorage.removeItem("seller_id");
          localStorage.removeItem("seller_company");
          window.location.pathname = '/login';
        },(error:any)=>{
          console.log(error)
        }
      )

  }

}
