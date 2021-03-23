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
import { Canceled } from '../constants/canceled';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cu-Api-Key': 'aE8CmQlvIjFFO8uFvYw1Fh4Q' })
};
@Injectable({
  providedIn: 'root'
})
export class QuotationService {

	private url    = 'http://69.164.193.249/api/v2/quotations/';
	private url_nf = "http://69.164.193.249/api/v1/web_services/";

	private url_zipcode = "http://69.164.193.249/quotations/autocomplete_zipcode?term=";
	private url_promocode = "http://69.164.193.249/api/v1/promotional_references/"
	private url_canceled = "http://69.164.193.249/api/v3/";
  private potosi_ur_catalog = 'https://quotes.sxkm.mx/api/Catalogos/';

	//private url    = 'http://69.164.193.249/api/v2/quotations/';
	//private url_nf = "http://69.164.193.249/v2/api/v1/web_services/";

	//private url_zipcode = "http://69.164.193.249/quotations/autocomplete_zipcode?term=";
	//private url_promocode = "http://69.164.193.249/api/v1/promotional_references/";
	//private url_canceled = "http://69.164.193.249/api/v3/";

	constructor(private http: HttpClient) { }


  getPotosiVehicletype(){
    return this.http.post(this.potosi_ur_catalog+'tipoDeVehiculosElPotosi',{'usuario': "MC864121"}, httpOptions2)
        .pipe(
          tap(quotation => this.log('fetched quotation')),
          catchError(this.handleError('getQuotation', []))
        );
  }

  getPotosiModels(anio, tipo_vehiculo, marca){
    let data = {'usuario': "MC864121", "anio": anio, "tipoVehiculo": tipo_vehiculo, "marca": marca}
    return this.http.post(this.potosi_ur_catalog+'modelosElPotosi',data, httpOptions2)
        .pipe(
          tap(quotation => this.log('fetched quotation')),
          catchError(this.handleError('getQuotation', []))
        );
  }

  getPotosiMakers(anio, tipo_vehiculo){
    let data = {'usuario': "MC864121", "anio": anio, "tipoVehiculo": tipo_vehiculo}
    return this.http.post(this.potosi_ur_catalog+'marcasElPotosi',data, httpOptions2)
        .pipe(
          tap(quotation => this.log('fetched quotation')),
          catchError(this.handleError('getQuotation', []))
        );
  }

  getPotosiVersions(anio, tipo_vehiculo, marca, model){
    let data = {'usuario': "MC864121", "anio": anio, "tipoVehiculo": tipo_vehiculo, "marca": marca, "modelo": model}
    return this.http.post(this.potosi_ur_catalog+'versionesElPotosi',data,httpOptions2)
        .pipe(
          tap(quotation => this.log('fetched quotation')),
          catchError(this.handleError('getQuotation', []))
        );
  }

  get_quotation_potosi(model_id, cp, year, gender, age, utm) {
    let data_to_quote = {
      "carid": model_id,
      "cp": cp,
      "anio": parseInt(year),
      "sexo": gender,
      "edad": parseInt(age),
      "campaignsource":utm.utm_source,
      "campaignmedium":utm.utm_medium,
      "campaignname":utm.utm_campaign,
      "campaignterm":utm.utm_term,
      "campaigncontent":utm.utm_content
    }
		return this.http.post('https://quotes.sxkm.mx/api/cotizador/cotizarEP', data_to_quote, httpOptions2)
		    .pipe(
		      tap(models => this.log('fetched tresponse quote')),
		      catchError(this.handleError('getModels', []))
		    );
	}
	getCaceled(pageId,search){

		let urlSearchCanceled = this.url_canceled+"policies?policy_states=canceled&page="+pageId+"&term="

		search != null ? urlSearchCanceled = this.url_canceled+"policies?policy_states=canceled&page="+pageId+"&term="+search : urlSearchCanceled = this.url_canceled+"policies?policy_states=canceled&page="+pageId+"&term="

		return this.http.get(urlSearchCanceled,httpOptions)
		.pipe(
			tap(canceled => this.log('fetched canceled')),
			catchError(this.handleError('get Canceled', []))
		);
	}

	sendLinkCanceled(canceled: Canceled): Observable<Canceled>{
		return this.http.post<Canceled>(this.url_canceled+"create_custom_payment",canceled,httpOptions)
		.pipe(
			tap((canceled: Canceled) => this.log('fetched Link')),
			catchError(this.handleError<Canceled>('post Link'))
		);

	}

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
    return this.http.get<Year[]>('https://quotes.sxkm.mx/api/catalogos/anios', httpOptions2)
		.pipe(
			tap(years => this.log('fetched years')),
		  catchError(this.handleError('getYearssWS', []))
		);
	}
	getModels(year,maker): Observable<Model[]> {
		return this.http.get<Model[]>(this.url+"models?year="+year+"&maker="+maker)
		    .pipe(
		      tap(models => this.log('fetched models')),
		      catchError(this.handleError('getModels', []))
		    );
	}

  getModelsNew(year): Observable<Model[]> {
		return this.http.get<Model[]>('https://quotes.sxkm.mx/api/catalogos/modelos/'+year+'', httpOptions2 )
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

  get_quotation_new_quote(model_id, cp, year, gender, age, utm): Observable<Model[]> {
   let data_to_quote = {
     "carid": model_id,
     "cp": cp,
     "anio": year,
     "sexo": gender,
     "edad": age,
     "campaignsource":utm ? utm.utm_source : '',
     "campaignmedium":utm ? utm.utm_medium : '',
     "campaignname":utm ? utm.utm_campaign : '',
     "campaignterm":utm ? utm.utm_term : '',
     "campaigncontent": utm ? utm.utm_content : ''
   }
   return this.http.post<Model[]>('https://quotes.sxkm.mx/api/cotizador/cotizar', data_to_quote, httpOptions2)
       .pipe(
         tap(models => this.log('fetched tresponse quote')),
         catchError(this.handleErrorQuote('getModels', []))
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


  getCompanys(){
    return this.http.get(this.url_canceled+'company_list',httpOptions)
        .pipe(
          tap(package_km => this.log('fetched companys')),
          catchError(this.handleError('error getCompanys', []))
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




  private handleErrorQuote<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
		    console.error(error); // log to console instead

		    // TODO: better job of transforming error for user consumption
		    this.log(`${operation} failed: ${error.message}`);

		    // Let the app keep running by returning an empty result.
			//return of(result as T);
			return of (error.status as T);
		};
	}


	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	    console.log(message)
	}
}
