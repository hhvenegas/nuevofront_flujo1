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


import * as $ from 'jquery';

import Swiper from 'swiper';
import swal from 'sweetalert';

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


    this.loginService.login(datos).subscribe(
      (data:any)=>{
        console.log(data)
        localStorage.removeItem('user')
        this.loginService.login(datos).subscribe(
          (user:any)=>{
            console.log(user)
            if(user.is_seller){
                //this.router.navigate(["/panel"]);
                localStorage.setItem('id', user.id);
                localStorage.setItem('user', "operaciones");
                localStorage.setItem('rol', user.role);
                localStorage.setItem('seller_company', user.seller_company);
                localStorage.setItem('hubspot_id',user.hubspot_id);
                window.location.pathname = '/panel';
              }
              else{
                //this.router.navigate(["/user"]);
                localStorage.setItem('user', "user");
                window.location.pathname = '/user';
              }

          },error =>{
            swal("No se puede iniciar sesión","El usuario y/o contraseña es incorrecta","error");
            this.errorMsg = error
          }
        )
      },(error:any)=>{
        console.log(error)
      }
    )
  }
}
