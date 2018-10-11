import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MAKERS } from '../constants/makers';
import { Maker } from '../constants/maker';

import { YEARS } from '../constants/years';
import { Year } from '../constants/year';

import { Model } from '../constants/model';
import { Version } from '../constants/version';

import { Quotation } from '../constants/quotation';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
	private url    = 'http://dev2.sxkm.mx/api/v3/';
	private url_nf = "https://qa2.sxkm.mx/v2/api/v1/web_services/";
	constructor(private http: HttpClient) { }
	getQuotes(){
		this.getPackage(1);
	    }

	getPackage(id){
		return this.http.get(this.url_nf+'get_kilometers_package?kilometers_package_id='+id)
		    .pipe(
		      tap(package_km =>{ this.log('fetched package_km');console.log(package_km)}),
		      catchError(this.handleError('error getPackage', []))
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
