import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Maker } from '../constants/maker';
@Injectable({
  providedIn: 'root'
})
export class QuotationColombiaService {
  private url = 'http://sbs-balancer-1657829644.us-west-2.elb.amazonaws.com/api/v1/'
  constructor(private http: HttpClient) { }

  getMakersWS(){
		return this.http.get<Maker[]>(`${this.url}car_catalog/makers/3`)
		.pipe(
			tap(makers => this.log('fetched getMakersWS')),
		  catchError(this.handleError('getMakersWS', []))
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

  private log(message: string) {
    console.log(message)
  }
}
