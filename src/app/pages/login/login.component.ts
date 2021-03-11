import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { LoginService } from '../../services/login.service';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
//import { User } from '../../constants/user';
import { Login } from '../../constants/login';
import { LoaderService } from '../../services/loader.service';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private loginService: LoginService, private loader: LoaderService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if(params.hasOwnProperty('nice_user_id')){
        console.log("si nlo tiebne")
        this.loader.show();
        this.loginService.login_nice({"customer_id": params['nice_user_id']}).subscribe(
          (data:any)=>{
            console.log(data)
            this.loader.hide();
            if(data.msg.is_seller){
                //this.router.navigate(["/panel"]);
                localStorage.setItem('id', data.msg.id);
                localStorage.setItem('user', "operaciones");
                localStorage.setItem('rol', data.msg.role);
                localStorage.setItem('seller_company', data.msg.seller_company);
                localStorage.setItem('potosi_ajuster', data.msg.potosi_sinister);
                localStorage.setItem('nice_seller', data.msg.nice_seller);
                localStorage.setItem('hubspot_id',data.msg.hubspot_id);
                if(data.msg.potosi_sinister) {
                  window.location.pathname = '/siniestros/detalles/0';
                }else{
                  window.location.pathname = '/panel/cotizaciones';
                }


              }
          },(error:any)=>{
            console.log(error)
            this.loader.hide();
          }
        )
      }else{
        console.log("No lo tiene")
      }
    });

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
                localStorage.setItem('potosi_ajuster', user.potosi_sinister);
                localStorage.setItem('nice_seller', user.nice_seller);
                localStorage.setItem('hubspot_id',user.hubspot_id);
                if(user.potosi_sinister) {
                  window.location.pathname = '/siniestros/detalles/0';
                }else{
                  window.location.pathname = '/panel/cotizaciones';
                }


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
