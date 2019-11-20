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
export class QuotationService {

	private url    = 'http://50.16.87.211/api/v2/quotations/';
	private url_nf = "http://50.16.87.211/v2/api/v1/web_services/";

	private url_zipcode = "http://50.16.87.211/quotations/autocomplete_zipcode?term=";
	private url_promocode = "http://50.16.87.211/api/v1/promotional_references/"

	/* private url    = 'https://dev2.sxkm.mx/api/v2/quotations/';
	private url_nf = "https://dev2.sxkm.mx/v2/api/v1/web_services/";

	private url_zipcode = "https://dev2.sxkm.mx/quotations/autocomplete_zipcode?term=";
	private url_promocode = "https://dev2.sxkm.mx/api/v1/promotional_references/"
 */
	constructor(private http: HttpClient) { }

	getMakers(): Observable<Maker[]> {
	  return of(MAKERS);
	}
	getMakersWS(){
		return this.http.get<Maker[]>(this.url+"makers")
		.pipe(
			tap(makers => this.log('fetched getMakersWS')),
		  catchError(this.handleError('getMakersWS', []))
		);
	}
	getYears(): Observable<Year[]> {
	  return of(YEARS);
	}
	getModels(year,maker): Observable<Model[]> {
		return this.http.get<Model[]>(this.url+"models?year="+year+"&maker="+maker)
		    .pipe(
		      tap(models => this.log('fetched models')),
		      catchError(this.handleError('getModels', []))
		    );
	}

	getVersions(maker,year,model): Observable<Version[]> {
		return this.http.get<Version[]>(this.url+'model_versions?year='+year+'&maker='+maker+'&model='+model)
		    .pipe(
		      tap(models => this.log('fetched versions')),
		      catchError(this.handleError('getVersions', []))
		    );
	}
	getSisa(maker,year,version) {
		return this.http.get(this.url+'version_id?year='+year+'&maker='+maker+'&model='+version)
		    .pipe(
		      tap(sisa => this.log('fetched sisa')),
		      catchError(this.handleError('getSisa', []))
		    );
	}
	getYearsBirth(){
		let date = new Date();
		let years_birth= Array();
		let maxDate = date.getFullYear()-20;
		let minDate = date.getFullYear()-70;
	
		for(let i = minDate; i<=maxDate;i++){
			years_birth.push(i);
		}
		return years_birth;
	}
	getAge(year){
		console.log(year)
		let date = new Date();
		return date.getFullYear()-year;
	}
	getQuotation(id){
		return this.http.get(this.url_nf+'get_quotation?quote_id='+id)
		    .pipe(
		      tap(quotation => this.log('fetched quotation')),
		      catchError(this.handleError('getQuotation', []))
		    );
	}
	getPackage(id){
		return this.http.get(this.url_nf+'get_kilometers_package?kilometers_package_id='+id)
		    .pipe(
		      tap(package_km => this.log('fetched package_km')),
		      catchError(this.handleError('error getPackage', []))
		    );
	}
	getZipcode(zipcode_id){
		return this.http.get(this.url_nf+'get_zipcodeid?zipcode_id='+zipcode_id)
		    .pipe(
		      tap(zipcode => this.log('fetched getZipcode')),
		      catchError(this.handleError('error getZipcode', []))
		    );
	}
	getSububrs(zipcode){
		return this.http.get(this.url_nf+'get_zipcode?zipcode='+zipcode)
		    .pipe(
		      tap(zipcode => this.log('fetched getSuburbs')),
		      catchError(this.handleError('error getSuburbs', []))
		    );
	}
	validateZipcode(zipcode){
		return this.http.get(this.url_zipcode+zipcode)
		    .pipe(
		      tap(zipcode => this.log('fetched zipcode')),
		      catchError(this.handleError('error validateZipcode', []))
		    );
	}
	searchCupon(cupon){
		return this.http.get(this.url_promocode+cupon)
		    .pipe(
		      tap(cupon => this.log('fetched searchCupon')),
		      catchError(this.handleError('error searchCupon', []))
		    );
	}

	/** POST: add a new hero to the server */
	sendQuotation (quotation: Quotation): Observable<Quotation> {
	    return this.http.post<Quotation>(this.url_nf+"create_quote", quotation, httpOptions).pipe(
	      tap((quotation: Quotation) => this.log('post')),
	      catchError(this.handleError<Quotation>('add quotation'))
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
