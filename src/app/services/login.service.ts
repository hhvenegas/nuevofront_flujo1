import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';
import { Router,ActivatedRoute } from '@angular/router';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
	session:any;
	url = 'http://dev2.sxkm.mx/users/';
	constructor(private http: HttpClient, private router: Router) { }

	login(datos){
		return this.http.post(this.url+'sign_in.json',datos,httpOptions)
			.pipe(map((user: any) => {
					return user;
			}),(catchError(this.errorHandler)));
	}

	errorHandler(error: HttpErrorResponse){
	    console.log(error);
	    if (error.status == 401) {
				//console.log(error.error)
	      return throwError("Correo o contraseña inválidos.");
	    }
	}
	
	logout(){
		return this.http.delete(this.url+'sign_out.json',httpOptions)
	}


	VerifySession(){
    this.session = localStorage.getItem('user');
    if(this.session == null || this.session == ""){
      this.router.navigate(["/login"])
    }
  }
}
