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

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Cu-Api-Key": "aE8CmQlvIjFFO8uFvYw1Fh4Q" })
};

declare var OpenPay: any;

@Injectable({
  providedIn: 'root'
})
export class CartService {
	//private url = 'https://app.sxkm.mx/api/v3/';
	private url = 'https://app.sxkm.mx/api/v3/';
  private potosi_ur_catalog = 'https://quotes.sxkm.mx/api/Catalogos/';
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
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false,false,'','');
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
