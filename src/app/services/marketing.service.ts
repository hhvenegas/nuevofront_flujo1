import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //'Authorization': 'my-auth-token'
  }),
  //withCredentials: true

};
@Injectable({
  providedIn: 'root'
})
export class MarketingService {
	/* url: any = "https://dev2.sxkm.mx/api/v3/"; */
	url: any = "http://35.153.133.191/api/v3/";
  constructor(private http: HttpClient) { }
  create_reference(data){
		return this.http.post(this.url+"quotes/create_visit_reference",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('create_reference')),
			catchError(this.handleError('error create_reference', []))
		);
  }
  
  update_reference(data){
		return this.http.put(this.url+"quotes/update_visit_reference ",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('update_reference')),
			catchError(this.handleError('error update_reference', []))
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
