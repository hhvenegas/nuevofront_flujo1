import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Api } from "../api.constants";
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	paso:      		any = "login";
	email:     		any = "";
	password:  		any = "";
	password2: 		any = "";
	input_check:	any = false;

	error_email:	any = "";
	error_password:	any = "";
	error_password2:	any = "";
	error_check:    any = "";

	constructor(private http: HttpClient,private router : Router) { }
	ngOnInit() {}
	cambiar(){
		this.input_check 	= false;
		this.email 			= "";
		this.password 		= "";
		this.password2 		= "";
		this.error_email 	= "";
		this.error_check 	= "";
		this.error_password = "";
		this.error_password2= "";
		
		if(this.paso=='login')
			this.paso="register";
		else this.paso="login";
	}
	cambiarCheck(){
		if(this.input_check==true)
			this.input_check = false;
		else this.input_check = true;
	}
	send_form(){
		let siguiente = true;
		let form = {
			"user": {
				"email"      : this.email,
				"password"   : this.password,
				//"password2:" : this.password2
			},
			"rest_api": true
		}
		if(this.email==''){
			siguiente=false;
			this.error_email = "Ingresa tu correo electrónico";
		}
		else{ 
		    //validar si es correo 
		    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		    var serchfind = regexp.test(this.email);
		    if(!serchfind){
		    	siguiente=false;
		     	this.error_email="Ingresa un correo válido";
		    }
		    else this.error_email = "";
		}
		if(this.password==''){
			siguiente=false;
			this.error_password = "Ingresa la contraseña";
		}
		else{ 
		    this.error_password = "";
		}
		if(this.paso=='login'){
		}
		else{
			if(this.password2==''){
				siguiente=false;
				this.error_password2 = "Confirma la contraseña";
			}
			else{ 
			    if(this.password2!= this.password){
			    	siguiente=false;
					this.error_password2 = "Las contraseñas no coinciden";
				}
				else{ 
				    this.error_password2 = "";
				}
			}
			if(!this.input_check){
				siguiente = false;
				this.error_check = "Acepta los términos y condiciones y el aviso de privacidad";
			}
			else{ 
			    this.error_check = "";
			}
		}
		
			
		console.log(form);
		if(siguiente){
			if(this.paso=='login'){
				this.http.post('http://192.168.15.219:3000/users/sign_in.json',form).subscribe(
					(data: any) => {
						localStorage.setItem("token",data.auth_token);
						this.router.navigate(["/mis-vehiculos/"]);
						//console.log(localStorage.getItem("token"));
					},
					(error: any) => {
						localStorage.removeItem("token");
						console.log("ERRROR: "+localStorage.getItem("token"));
					}
				);
			}
		}
	}

}
