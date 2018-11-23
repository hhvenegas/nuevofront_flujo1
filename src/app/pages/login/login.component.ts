import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { LoginService } from '../../services/login.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
//import { User } from '../../constants/user';
import { Login } from '../../constants/login';

//import * as M from "node_modules/materialize-css/dist/js/materialize.min.js";
import * as $ from 'jquery';
declare var M:any;
import Swiper from 'swiper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm = new Login('','')
  errorMsg:string;
  Seller: boolean = true; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
      }

  onSubmit(){
    var datos = {
      rest_api: this.LoginForm.rest_api,
      user:{
        email: this.LoginForm.email, 
        password: this.LoginForm.password
      }
    }
    console.log(datos)
    this.loginService.logout().subscribe(
      (data:any)=>{
        console.log(data)
        localStorage.removeItem('user')
        this.loginService.login(datos).subscribe(
          (user:any)=>{
            if(user.is_seller){
              window.location.pathname = '/panel/cotizaciones';
              //this.router.navigate(["/panel"]);
              localStorage.setItem('rol', "operador");
              localStorage.setItem('seller_company', "operador");
              localStorage.setItem('seller_id', "2");
            }
            else{
              //this.router.navigate(["/user"]);
              window.location.pathname = '/user';
              localStorage.setItem('rol', "user");
            }
            
            localStorage.setItem('user', user.email);
            
          },error =>{
            this.errorMsg = error
          }
        )
      },(error:any)=>{
        console.log(error)
      }
    )
  }
}
