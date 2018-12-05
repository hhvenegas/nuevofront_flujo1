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
export class UsersService {

	url = 'https://dev2.sxkm.mx/api/v1/my/';
	url_ = 'https://dev2.sxkm.mx/api/v2/quotations/';
	url2 = 'https://dev2.sxkm.mx/api/v3/';
	
	constructor(private http: HttpClient) { }
	getPersonalInfo(){
		return this.http.get(this.url+"profiles/get_current_user_data", httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getPersonalInfo')),
		      catchError(this.handleError('error getPersonalInfo', []))
		    );
	}
	updatePersonalInfo(user){
		return this.http.post(this.url+"profiles/update_user_basic_info", user,httpOptions)
		    .pipe(
		      tap((data:any) => this.log('updatePersonalInfo')),
		      catchError(this.handleError('error updatePersonalInfo', []))
		    );
	}
	updatePassword(password){
		return this.http.post(this.url+"profiles/update_password", password,httpOptions)
		    .pipe(
		      tap((data:any) => this.log('updatePassword')),
		      catchError(this.handleError('error updatePassword', []))
		    );
	}

	updateNip(nip){
		return this.http.post(this.url+"profiles/update_nip", nip,httpOptions)
		    .pipe(
		      tap((data:any) => this.log('updateNip')),
		      catchError(this.handleError('error updateNip', []))
		    );
	}

	getCars(){
		return this.http.get(this.url+"cars", httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getCars')),
		      catchError(this.handleError('error getCars', []))
		    );
	}

	get_cars_ids(){
		return this.http.get(this.url + 'cars/get_car_ids', httpOptions)
		.pipe(
			tap((data:any) => this.log('get_cars_ids')),
			catchError(this.handleError('error get_cars_ids', []))
		);
	}
	
	getCarBasic(id){
    	return this.http.get(this.url + 'cars/get_car_basic_info?id='+id+'', httpOptions)  
		.pipe(
			tap((data:any) => this.log('getCarBasic')),
			catchError(this.handleError('error getCarBasic', []))
		);
	}

	updateCarInfo(id, car_info){
		return this.http.post(this.url + 'cars/update_car_info?id='+id+'', car_info ,httpOptions)  
			.pipe(
			tap((data:any) => this.log('updateCarInfo')),
			catchError(this.handleError('error updateCarInfo', []))
		);
	}
	
	get_kms_purchase(id){
		return this.http.get(this.url + 'cars/' + id +"/kilometer_purchases", httpOptions)
		.pipe(
			tap((data:any) => this.log('get_kms_purchase')),
			catchError(this.handleError('error get_kms_purchase', []))
		);
	}
	
	get_packages(id){
		return this.http.get(this.url + "cars/"+ id +"/kilometer_purchases/packages_kms", httpOptions)
		.pipe(
			tap((data:any) => this.log('get_packages')),
			catchError(this.handleError('error get_packages', []))
		);
	}
	get_nip(nip){
			return this.http.get(this.url + 'trips/verify_nip?nip='+ nip +'', httpOptions)
			.pipe(
				tap((data:any) => this.log('get_nip')),
				catchError(this.handleError('error get_nip', []))
			);
	}

	get_trips(id){
			return this.http.get(this.url + "trips?car_id="+ id + "", httpOptions)	
			.pipe(
				tap((data:any) => this.log('get_trips')),
				catchError(this.handleError('error get_trips', []))
			);
	}

	get_trips_group(id, StartDate, EndDate){
		return this.http.get(this.url + "trips/group_by_days_trips?car_id="+ id + "&from_date="+StartDate+"&to_date="+EndDate+"", httpOptions)
		.pipe(
			tap((data:any) => this.log('get_trips_group')),
			catchError(this.handleError('error get_trips_group', []))
		);
	}

	get_trips_by_date(id){
		return this.http.get(this.url + "trips?car_id="+ id + "", httpOptions)
		.pipe(
			tap((data:any) => this.log('get_trips_by_date')),
			catchError(this.handleError('error get_trips_by_date', []))
		);
	}
	
  	get_trip_details(id_trip){
			return this.http.get(this.url + "trips/trip_details?trip_id="+ id_trip +".json", httpOptions)
			.pipe(
				tap((data:any) => this.log('get_trip_details')),
				catchError(this.handleError('error get_trip_details', []))
			);
	}

	getPackageByCost(rate){
		return this.http.get(this.url_ + "cost_by_package?prime="+ rate, httpOptions)
			.pipe(
				tap((data:any) => this.log('getPackageByCost')),
				catchError(this.handleError('error getPackageByCost', []))
		);
	}

	getForce(id_trip){
		return this.http.get(this.url + "trips/g_forces_trip?trip_id="+ id_trip, httpOptions)
			.pipe(
				tap((data:any) => this.log('getForce')),
				catchError(this.handleError('error getForce', []))
		);
	}


	getSpeedService(trip_id){
		return this.http.get(this.url + "trips/speeds_service?trip_id="+trip_id, httpOptions)
		.pipe(
			tap((data:any) => this.log('getSpeedService')),
			catchError(this.handleError('error getSpeedService', []))
		);
	}

	pay_with_oxxo(id, json){
		return this.http.post(this.url + 'cars/'+ id +'/kilometer_purchases/oxxo/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_oxxo')),
			catchError(this.handleError('error pay_with_oxxo', []))
		);
	}

	pay_with_openpay_store(id, json){
		return this.http.post(this.url + 'cars/'+ id +'/kilometer_purchases/pay_store_openpay/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_openpay_store')),
			catchError(this.handleError('error pay_with_openpay_store', []))
		);
	}

	pay_with_openpay_card(id, json){
		return this.http.post(this.url + 'cars/'+ id +'/kilometer_purchases/create_openpay_purchase/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_openpay_card')),
			catchError(this.handleError('error pay_with_openpay_card', []))
		);
	}

	pay_with_spei(id, json){
		return this.http.post(this.url + 'cars/'+ id +'/kilometer_purchases/spei/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_spei')),
			catchError(this.handleError('error pay_with_spei', []))
		);
	}

	//pago de membresia
	pay_with_openpay_store_monthly(json){
		return this.http.post(this.url + 'monthly_payments/pay_store_openpay', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_openpay_store_monthly')),
			catchError(this.handleError('error pay_with_openpay_store_monthly', []))
		);
	}

	pay_with_oxxo_monthly(json){
		return this.http.post(this.url + 'monthly_payments/oxxo', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_oxxo_monthly')),
			catchError(this.handleError('error pay_with_oxxo_monthly', []))
		);
	}

	pay_with_spei_monthly(json){
		return this.http.post(this.url + 'monthly_payments/spei', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('pay_with_spei_monthly')),
			catchError(this.handleError('error pay_with_spei_monthly', []))
		);
	}

	openpay_card_pay_method_monthly(json){
		return this.http.post(this.url + 'monthly_payments/make_payment_openpay/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('openpay_card_pay_method_monthly')),
			catchError(this.handleError('error openpay_card_pay_method_monthly', []))
		);
	}

	//pago recurrente
	openpay_card_pay_method_monthly_current(json){
		return this.http.post(this.url + 'monthly_payments/make_payment_openpay/', json, httpOptions)
		.pipe(
			tap((data:any) => this.log('openpay_card_pay_method_monthly_current')),
			catchError(this.handleError('error openpay_card_pay_method_monthly_current', []))
		);
	}

	getEditableInfo(user_id){
		return this.http.get(this.url2+'users/'+user_id+'/editable_info',httpOptions)
		.pipe(
			tap((data:any) => this.log('getEditableInfo')),
			catchError(this.handleError('error getEditableInfo', []))
		);	
	}
	updateUserInfo(user_id,user){
		return this.http.post(this.url2+"users/"+user_id+"/update",user,httpOptions)
		.pipe(
			tap((data:any) => this.log('updateUserInfo')),
			catchError(this.handleError('error updateUserInfo', []))
		);	
	}
	getCards(user_id){
		return this.http.get(this.url2+"cards?user_id="+user_id,httpOptions)
		.pipe(
			tap((data:any) => this.log('getCards')),
			catchError(this.handleError('error getCards', []))
		);
	}
	deleteCard(card_id){
		return this.http.post(this.url2+"cards/"+card_id+"/delete",null,httpOptions)
		.pipe(
			tap((data:any) => this.log('deleteCard')),
			catchError(this.handleError('error deleteCard', []))
		);

	}
	getSubscriptions(user_id){
		return this.http.get(this.url2+"subscriptions?user_id="+user_id,httpOptions)
		.pipe(
			tap((data:any) => this.log('getSubscriptions')),
			catchError(this.handleError('error getSubscriptions', []))
		);
	}
	createSubscriptions(data){
		return this.http.post(this.url2+"subscriptions",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('createSuscription')),
			catchError(this.handleError('error createSuscription', []))
		);


	}
	updateSubscriptions(subscription_id,data){
		return this.http.post(this.url2+"subscriptions/"+subscription_id+"/update",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('updateSubscriptions')),
			catchError(this.handleError('error updateSubscriptions', []))
		);
	}
	deleteSubscriptions(subscription_id){
		return this.http.post(this.url2+"subscriptions/"+subscription_id+"/cancel",null,httpOptions)
		.pipe(
			tap((data:any) => this.log('deleteSubscriptions')),
			catchError(this.handleError('error deleteSubscriptions', []))
		);
	}
	getPoliciesByIdUser(user_id){
		return this.http.get(this.url2+"users/"+user_id+"/policies",httpOptions)
		.pipe(
			tap(data => this.log('getPoliciesByIdUser')),
			catchError(this.handleError('error getPoliciesByIdUser', []))
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
