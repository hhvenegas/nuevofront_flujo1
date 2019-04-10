import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Hubspot } from '../constants/hubspot';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HubspotService {
	/* private url = "https://app.sxkm.mx/v2/api/v1/web_services/"; */
	private url = "https://dev2.sxkm.mx/v2/api/v1/web_services/";
	hubspot:any;
	constructor(private http: HttpClient) { }

	sendHubspot(hubspot){

		return console.log(hubspot);
	}

	validateToken(access_token){
		return this.http.get(this.url+"hubspot_validate_token?access_token="+access_token)
			.pipe(
				tap(data => this.log('validar token')),
				catchError(this.handleError('validateToken', []))
			);
	}

	refreshToken(){
		return this.http.get(this.url+"hubspot_refresh_token")
		    .pipe(
		      tap(data => this.log('fetched refreshToken')),
		      catchError(this.handleError('error Refreshtoken', []))
		    );
	}

	getContactByEmail(email,access_token){
		return this.http.get(this.url+"hubspot_get_contact?email="+email+"&access_token="+access_token)
			.pipe(
				tap(data => this.log('fetched getContactbyEmail')),
				catchError(this.handleError('error getContactbyEmail', []))
			);
	}
  	
	createContact(form){
		return this.http.post(this.url+"hubspot_create_contact", form, httpOptions).pipe(
			tap((data) => this.log('post createContact')),
			catchError(this.handleError('error createContact'))
		);
	}
		
	updateContactVid(form){
		return this.http.post(this.url+"hubspot_update_contact", form, httpOptions).pipe(
			tap((data) => this.log('post updateContact')),
			catchError(this.handleError('error updateContact'))
		);
	}
		
	mergeContact(form){
		return this.http.post(this.url+"hubspot_merge_contact", form, httpOptions).pipe(
			tap((data) => this.log('post mergeContact')),
			catchError(this.handleError('error mergeContact'))
		);
	}
		
		private handleError<T> (operation = 'operation', result?: T) {
			return (error: any): Observable<T> => {
				// TODO: send the error to remote logging infrastructure
					console.error(error); // log to console instead
			 
					// TODO: better job of transforming error for user consumption
					this.log(`${operation} failed: ${error.message}`);
			 
					// Let the app keep running by returning an empty result.
				//return of(result as T);
				return of (error.error as T);
			};
		}
	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	    console.log(message)
	}
}

