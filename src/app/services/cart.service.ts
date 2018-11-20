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
import { Policy } from '../constants/policy';
import { Store } from '../constants/store';
import { STORES } from '../constants/stores';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CartService {
	private url = "https://dev2.sxkm.mx/v2/api/v1/web_services/";
	public modeProd = false;
	public openpay_prod: any = {
		"id"      : 'mtpac6zng162oah2h67h',
		"apikey"  : "pk_42af74150db6413692eb47624a1e903a",
		"sandbox" : false
	}
	public openpay_sandbox: any = {
		"id"      : 'mdt4m9gkdvu9xzgjtjrk',
		"apikey"  : "pk_3670bc7e899241ad87ceffb49757979c",
		"sandbox" : true
	}
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false,false,'','');
	constructor(private http: HttpClient) { }
	setPolicy(policy){
		this.policy = policy;
	}
	
	getStores(): Observable<Store[]> {
	  return of(STORES);
	}
	
	/** POST: add a new hero to the server */
	sendPolicy (policy: Policy): Observable<Policy> {
		console.log(policy);
	    return this.http.post<Policy>(this.url+"create_payment", policy, httpOptions).pipe(
	      tap((policy: Policy) => this.log('post policy')),
	      catchError(this.handleError<Policy>('error post policy'))
	    );
	}


	getTicket(transaction_id){
		return this.http.get(this.url+'get_transaction?transaction_id='+transaction_id)
		    .pipe(
		      tap(quotation => this.log('fetched quotation')),
		      catchError(this.handleError('getQuotation', []))
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
