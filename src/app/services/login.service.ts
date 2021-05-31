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
	//url = 'https://app.sxkm.mx/';
	url = 'https://app.sxkm.mx/';
	//url = "http://192.168.15.30:3000/";
	constructor(private http: HttpClient, private router: Router) { }

	login(datos){
		return this.http.post(this.url+'users/sign_in.json',datos,httpOptions)
			.pipe(map((user: any) => {
					setTimeout(function(){ return user; }, 3000);

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
		return this.http.delete(this.url+'users/sign_out.json',httpOptions)
	}

	getSession(){
		let seller= {
			id: localStorage.getItem('id'),
			user: localStorage.getItem('user'),
          	rol: localStorage.getItem('rol'),
			seller_company: localStorage.getItem('seller_company'),
			hubspot_id: localStorage.getItem('hubspot_id')
		}
		return seller;
	}


	validateSession(){
		return this.http.get(this.url+"api/v3/sessions/validate", httpOptions)
		    .pipe(
		      tap((data:any) => this.log('validateSession')),
		      catchError(this.handleError('error validateSession', []))
		    );

  	}
  	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
		    console.error(error); // log to console instead

		    // TODO: better job of transforming error for user consumption
		    this.log(`${operation} failed: ${error.message}`);

		    // Let the app keep running by returning an empty result.
		    return of(result as T);
		};
	}
	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	    console.log(message)
	}

}
