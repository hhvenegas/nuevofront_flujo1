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
export class OperatorsService {
	url = 'http://dev2.sxkm.mx/api/v3/';
	constructor(private http: HttpClient) { }

	getQuotes(quote_info){
		console.log(quote_info)
		let url = this.url+"quotes?page="+quote_info.page;
		if(quote_info.term!="")
			url = this.url+"quotes/search?term="+quote_info.term+"&page="+quote_info.page;

		if(quote_info.seller_id)
			url+="&seller_id="+quote_info.seller_id;
		if(quote_info.quote_state)
			url +="&quote_state="+quote_info.quote_state;
		if(quote_info.payment_state)
			url += "&payment_state="+quote_info.payment_state;
		if(quote_info.seller_state)
			url += "&seller_state="+quote_info.seller_state;
	
		console.log(url)
		return this.http.get(url, httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getQuotes')),
		      catchError(this.handleError('error getQuotes', []))
		    );
	}
	requote(quotation){
		return this.http.post(this.url+"quotes/",quotation,httpOptions)
	}
	getSellers(): Observable<Seller[]> {
		return this.http.get<Seller[]>(this.url+"sellers", httpOptions)
		    .pipe(
		      tap(sellers => this.log('fetched sellers')),
		      catchError(this.handleError('error getSellers', []))
		    );
	}
	getFilters(){
		return this.http.get(this.url+"quotes/filters",httpOptions)
		    .pipe(
		      tap(data => this.log('getFilters')),
		      catchError(this.handleError('error getFilters', []))
		    );
	}
	sendEmailQuotes(quote_id){
		let post = {
			quote_id: quote_id
		}
		return this.http.post(this.url+"quotes/send_email", post,httpOptions)
		    .pipe(
		      tap(data => this.log('sendEmailQuotes')),
		      catchError(this.handleError('error sendEmailQuotes', []))
		    );
	}

	updateSellerQuotation(quote_id,seller_id){
		return this.http.post(this.url+"quotes/"+quote_id+"/assign_seller?seller_id="+seller_id,null,httpOptions)
		    .pipe(
		      tap(data => this.log('updateSellerQuotation')),
		      catchError(this.handleError('error updateSellerQuotation', []))
		    );
	}
	deleteQuote(quote_id){
		return this.http.post(this.url+"quotes/"+quote_id+"/cancel",null,httpOptions)
		    .pipe(
		      tap(data => this.log('deleteQuote')),
		      catchError(this.handleError('error deleteQuote', []))
		    );
	}


	//Policies
	getPolicies(policies_info){
		let params = "";
		if(policies_info.page)
			params = "?page="+policies_info.page;
		if(policies_info.policy_states && policies_info.policy_states.length<3){
			policies_info.policy_states.forEach(element => {
				params += "&policy_states[]="+element;	
			});
		}
		if(policies_info.membership_states){
			if(policies_info.membership_states.length == 1){
				policies_info.membership_states.forEach(element => {
					params += "&membership_state="+element;
				});
			}	
		}
		if(policies_info.seller_states){
			if(policies_info.seller_states.length == 1){
				policies_info.seller_states.forEach(element => {
					params += "&seller_states="+element;
				});
			}	
		}
		if(policies_info.device_states && policies_info.device_states.length<4){
			policies_info.device_states.forEach(element => {
				params += "&device_states[]="+element;	
			});
		}
		if(policies_info.vin_states){
			if(policies_info.vin_states.length == 1){
				policies_info.vin_states.forEach(element => {
					params += "&vin="+element;
				});
			}	
		}
		if(policies_info.km_states && policies_info.km_states.length<3){
			policies_info.km_states.forEach(element => {
				params += "&km_states[]="+element;	
			});
		}
		console.log(params);
		return this.http.get(this.url+"policies"+params,httpOptions)
			.pipe(
				tap(data => this.log('getPolicies')),
		      catchError(this.handleError('error getPolicies', []))
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
