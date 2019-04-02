
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

declare var OpenPay: any;

@Injectable({
  providedIn: 'root'
})
export class CartService {
	private url = "https://app.sxkm.mx/v2/api/v1/web_services/";
	/* private url = "https://dev2.sxkm.mx/v2/api/v1/web_services/"; */
	public modeProd = true;
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
	
	

	getTicket(transaction_id,type){
		return this.http.get(this.url+'payments/'+transaction_id+'?type='+type)
		    .pipe(
		      tap(quotation => this.log('fetched quotation')),
		      catchError(this.handleError('getQuotation', []))
		    );
	}

	keysOpenpay(){
		if(this.modeProd) return this.openpay_prod;
    else return this.openpay_sandbox;
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
