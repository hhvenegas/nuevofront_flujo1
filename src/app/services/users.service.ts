import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';
import { Seller } from '../constants/seller';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	url = 'http://dev2.sxkm.mx/api/v1/my/';
	constructor(private http: HttpClient) { }
	getPersonalInfo(){
		return this.http.get(this.url+"profiles/get_current_user_data", httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getPersonalInfo')),
		      catchError(this.handleError('error getPersonalInfo', []))
		    );
	}
	updatePersonalInfo(user){
		return this.http.post(this.url+"profiles/update_user_basic_info", user,httpOptions)
		    .pipe(
		      tap((data:any) => this.log('updatePersonalInfo')),
		      catchError(this.handleError('error updatePersonalInfo', []))
		    );
	}
	updatePassword(password){
		return this.http.post(this.url+"profiles/update_password", password,httpOptions)
		    .pipe(
		      tap((data:any) => this.log('updatePassword')),
		      catchError(this.handleError('error updatePassword', []))
		    );
	}

	getCars(){
		return this.http.get(this.url+"cars", httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getCars')),
		      catchError(this.handleError('error getCars', []))
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
