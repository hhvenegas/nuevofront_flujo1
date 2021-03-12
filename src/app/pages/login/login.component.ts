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
import * as CryptoJS from 'crypto-js'

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




        var encdata = params['nice_user_id'];


        var decrypt = CryptoJS.AES.decrypt(encdata, 'mZq4t7w!z$C&F)J@', {
          iv: '5ty76ujie324$567',
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

        console.log(decrypt);

        var decrypted = decrypt.toString(CryptoJS.enc.Utf8);
        console.log(decrypted);

        this.loader.show();
        this.loginService.login_nice({"customer_id": decrypted}).subscribe(
          (data:any)=>{
            console.log(data)

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
                this.loader.hide();


              }
          },(error:any)=>{
            console.log(error)
            this.loader.hide();
            swal("No se puede iniciar sesión","El usuario y/o contraseña es incorrecta","error");
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
