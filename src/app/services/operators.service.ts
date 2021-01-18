import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';
import { Seller } from '../constants/seller';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	withCredentials: true,
};

const httpOptions_2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
	withCredentials: false,
};
@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
	url = 'http://69.164.193.249/api/v3/';
	link = 'http://69.164.193.249';
	//url = 'http://69.164.193.249/api/v3/';
	//link = 'http://69.164.193.249';
  url_new_product = "http://node-new-product-1182672866.us-west-2.elb.amazonaws.com/api/v1/"

	constructor(private http: HttpClient) { }

	getLink(){
		return this.link;
	}

	/* FILTRA LAS COTIZACIONES */
	getQuotes(quote_info){
		console.log("coti",quote_info)
		let url = this.url+"quotes?page="+quote_info.page;
		if(quote_info.seller_id)
			url+="&seller_id="+quote_info.seller_id;
		if(quote_info.quote_state)
			url +="&quote_state="+quote_info.quote_state;
		if(quote_info.payment_state)
			url += "&payment_state="+quote_info.payment_state;
		if(quote_info.seller_state)
			url += "&seller_state="+quote_info.seller_state;
		if(quote_info.from_date)
			url += "&from_date="+quote_info.from_date;
		if(quote_info.to_date)
			url += "&to_date="+quote_info.to_date;
    if(quote_info.company_id)
			url += "&company_id="+quote_info.company_id;
		if(quote_info.term)
			url += "&term="+quote_info.term;
		if(quote_info.tracking_department_id)
			url+="&tracking_department_id="+quote_info.tracking_department_id;
		if(quote_info.call_topic_id)
			url+="&call_topic_id="+quote_info.call_topic_id;
    if(quote_info.call_result_id)
      url+="&call_result_id="+quote_info.call_result_id;
		if(quote_info.phone_state)
			url+="&phone="+quote_info.phone_state;
		console.log(url)
		return this.http.get(url, httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getQuotes')),
		      catchError(this.handleError('error getQuotes', []))
		    );
	}

	requote(quotation){
		return this.http.post(this.url+"quotes",quotation,httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}


  getSinistersLive(){
		return this.http.get(this.url+"get_new_sinisters",httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}

  getSinistersById(id){
		return this.http.post(this.url+"find_sinister_by_policy_id", {"id":id} ,httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}

  getSinistersByPolicy(term){
		return this.http.post(this.url+"find_sinister_by_policy", {"term":term} ,httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}

  updateSinister(id, aasm_state, sinister_number, subject){
		return this.http.post(this.url+"update_sinister", {"sinister_id":id,"aasm_state":aasm_state, "subject": subject, "sinister_number": sinister_number } ,httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}

  getSinistersAll(){
		return this.http.get(this.url+"get_all_potosi_sinisters",httpOptions)
				.pipe(
					tap(data=> this.log('requote')),
					catchError(this.handleError("ERROR requote", []))
				)
	}

  sendPolicyToPay(payload){
		return this.http.post(this.url_new_product+`policy/try_to_pay`,payload,httpOptions_2)
    .pipe(
      tap(response => this.log('try_to_pay')),
        catchError(this.handleError('error try_to_pay')),
    );
  }

  getPoliciesAp(){
		return this.http.get(this.url_new_product+`policy/get_all`,httpOptions_2)
    .pipe(
      tap(response => this.log('get_policies')),
        catchError(this.handleError('error try_to_pay')),
    );
  }



  getActiveUsers(){
		return this.http.get(this.url+`users_with_policies`,httpOptions)
    .pipe(
      tap(response => this.log('user_with_policies')),
        catchError(this.handleError('error get users')),
    );
  }

  getCardsSrpago(user_id){
		return this.http.get(this.url_new_product+`cards/`+user_id+``,httpOptions_2)
    .pipe(
      tap(response => this.log('get_policies')),
        catchError(this.handleError('error try_to_pay')),
    );
  }

  paySrPago(data){
		return this.http.post(this.url_new_product+`payments`, data,httpOptions_2)
    .pipe(
      tap(response => this.log('get_policies')),
        catchError(this.handleError('error try_to_pay')),
    );
  }

  getIp(){
    return this.http.get("https://api.ipify.org/?format=json",httpOptions_2)
    .pipe(
      tap(response => this.log('get_policies')),
        catchError(this.handleError('error try_to_pay')),
    );

  }

  getPoliciesApId(id){
		return this.http.get(this.url_new_product+`policy/by_id/`+id+``,httpOptions_2)
    .pipe(
      tap(response => this.log('get_policies')),
        catchError(this.handleError('error try_to_pay')),
    );
  }

	getReasonsDeleteQuote(){
		return this.http.get(this.url+"quotes/cancelation_reasons",httpOptions)
		.pipe(
			tap(data=> this.log('getReasonsDeleteQuote')),
			catchError(this.handleError("ERROR getReasonsDeleteQuote", []))
		)
	}
	getReasonsCancelPolicy(){
		return this.http.get(this.url+"policies/cancelation_reasons",httpOptions)
		.pipe(
			tap(data=> this.log('getReasonsCancelPolicy')),
			catchError(this.handleError("ERROR getReasonsCancelPolicy", []))
		)
	}

	getCloseReasonCall(){
		return this.http.get(this.url+"customer_trackings/close_reasons",httpOptions)
		.pipe(
			tap(data=> this.log('getCloseReasonCall')),
			catchError(this.handleError("ERROR getCloseReasonCall", []))
		)
	}

	getSellers(): Observable<Seller[]> {
		return this.http.get<Seller[]>(this.url+"sellers?active=true", httpOptions)
		    .pipe(
		      tap(sellers => this.log('fetched sellers')),
		      catchError(this.handleError('error getSellers', []))
		    );
	}
	createSeller(seller){
		return this.http.post(this.url+"sellers",seller,httpOptions)
		.pipe(
			tap(data=> this.log('createSeller')),
			catchError(this.handleError("ERROR createSeller", []))
		)
	}
	updateSeller(seller_id,seller){
		return this.http.post(this.url+"sellers/"+seller_id+"/update",seller,httpOptions)
		.pipe(
			tap(data=> this.log('updateSeller')),
			catchError(this.handleError("ERROR updateSeller", []))
		)
	}
	getSeller(seller_id){
		return this.http.get(this.url+"sellers/"+seller_id+"/editable_info",httpOptions)
		.pipe(
			tap(data=> this.log('getSeller')),
			catchError(this.handleError("ERROR getSeller", []))
		)
	}
	getRoles(){
		return this.http.get(this.url+"sellers/roles",httpOptions)
		.pipe(
			tap(data=> this.log('getRoles')),
			catchError(this.handleError("ERROR getRoles", []))
		)

	}
	getFiltersQuotes(){
		return this.http.get(this.url+"quotes/filters",httpOptions)
		    .pipe(
		      tap(data => this.log('getFilters')),
		      catchError(this.handleError('error getFilters', []))
		    );
	}
	sendEmailQuotes(email_quote){
		let post = {
			email: email_quote.email
		}
		return this.http.post(this.url+"quotes/"+email_quote.quote_id+"/send_email", post,httpOptions)
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
	deleteQuote(quote_id,data){
		let reason = {
			reason: data
		}
		return this.http.post(this.url+"quotes/"+quote_id+"/cancel",reason,httpOptions)
		    .pipe(
		      tap(data => this.log('deleteQuote')),
		      catchError(this.handleError('error deleteQuote', []))
		    );
	}

	getQuote(quote_id){
		return this.http.get(this.url+"quotes/"+quote_id+"?",httpOptions)
		.pipe(
			tap(data => this.log('getQuote')),
			catchError(this.handleError('error getQuote', []))
		);
	}

	pay_quote(quote_id,payment){
		return this.http.post(this.url+'quotes/'+quote_id+'/pay',payment,httpOptions)
		.pipe(
			tap(data=>this.log('pay_quote')),
			catchError(this.handleError('error pay_quote',[]))
		)
	}
	getPendingPaymentsQuotes(quote_id){
		return this.http.get(this.url+'quotes/'+quote_id+'/pending_payments',httpOptions)
		.pipe(
			tap(data=>this.log('getPendingPayments')),
			catchError(this.handleError('error getPendingPayments',[]))
		)
	}
	getPendingPaymentsPolicy(policy_id){
		return this.http.get(this.url+'policies/'+policy_id+'/pending_payments',httpOptions)
		.pipe(
			tap(data=>this.log('getPendingPayments')),
			catchError(this.handleError('error getPendingPayments',[]))
		)
	}
	getAllPaymentsPolicy(policy_id){
		return this.http.get(this.url+"policies/"+policy_id+"/payments",httpOptions)
		.pipe(
			tap(data=>this.log('getAllPaymentsPolicy')),
			catchError(this.handleError('error getAllPaymentsPolicy',[]))
		)
	}
  setOnHoldKilometers(policy_id, data){
		return this.http.post(this.url+"policies/"+policy_id+"/hold_kilometers", data, httpOptions)
		.pipe(
			tap(data=>this.log('setKilometersOnhold')),
			catchError(this.handleError('error setKilometersOnhold',[]))
		)
	}
  setMonthlyToNormal(data){
		return this.http.post(this.url+"return_to_normal_monthly", data, httpOptions)
		.pipe(
			tap(data=>this.log('returnToNormal')),
			catchError(this.handleError('error returnToNormal',[]))
		)
	}
  get_policy_insurances(policy_id){
		return this.http.get(this.url+"policies/"+policy_id+"/get_policy_insurances",httpOptions)
		.pipe(
			tap(data=>this.log('get_policy_insurances')),
			catchError(this.handleError('error getAllPaymentsPolicy',[]))
		)
	}

	recharge_policy(policy_id,payment){
		return this.http.post(this.url+"policies/"+policy_id+"/recharge",payment,httpOptions)
		.pipe(
			tap(data=>this.log('recharge_policy')),
			catchError(this.handleError('error recharge_policy',[]))
		)
	}
	membership_policy(policy_id,payment){
		return this.http.post(this.url+"policies/"+policy_id+"/membership",payment,httpOptions)
		.pipe(
			tap(data=>this.log('membership_policy')),
			catchError(this.handleError('error membership_policy',[]))
		)
	}

	getPolicy(policy_id){
		return this.http.get(this.url+"policies/"+policy_id,httpOptions)
		.pipe(
			tap(data => this.log('getPolicy')),
			catchError(this.handleError('error getPolicy', []))
		);
	}
	getEditableInfoPolicy(policy_id){
		return this.http.get(this.url+'policies/'+policy_id+'/editable_info',httpOptions)
		.pipe(
			tap(data => this.log('getEditableInfoPolicy')),
			catchError(this.handleError('error getEditableInfoPolicy', []))
		);
	}
	updateEditablePolicy(policy_id,policy){
		return this.http.post(this.url+'policies/'+policy_id+'/update',policy,httpOptions)
		.pipe(
			tap(data => this.log('updateEditablePolicy')),
			catchError(this.handleError('error updateEditablePolicy', []))
		);
	}
	cancelPolicy(policy_id,data){
		let reason = {
			reason: data
		}
		return this.http.post(this.url+'policies/'+policy_id+'/cancel',reason,httpOptions)
		.pipe(
			tap(data=>this.log('cancelPolicy')),
			catchError(this.handleError('error cancelPolicy',[]))
		)
	}

	updateSellerPolicy(policy_id,seller_id){
		let post = {
			seller_id: seller_id,
			update: "true"
		}
		return this.http.post(this.url+"policies/"+policy_id+"/assign_seller",post,httpOptions)
		    .pipe(
		      tap(data => this.log('updateSellerPolicy')),
		      catchError(this.handleError('error updateSellerPolicy', []))
		    );
	}

	getDevices(page){
		return this.http.get(this.url+"devices?page="+page,httpOptions)
		.pipe(
			tap(data => this.log('getDevices')),
			catchError(this.handleError('error getDevices', []))
		);
	}

	searchDevice(imei){
		return this.http.get(this.url+"devices/autocomplete?term="+imei,httpOptions)
		.pipe(
			tap(data => this.log('searchDevice')),
			catchError(this.handleError('error searchDevice', []))
		);
	}
	updateDevicePolicy(policy){
		let post = {
			device_id: policy.device_id,
			update: "true"
		}
		return this.http.post(this.url+"policies/"+policy.policy_id+"/assign_device",post,httpOptions)
		    .pipe(
		      tap(data => this.log('updateDevicePolicy')),
		      catchError(this.handleError('error updateDevicePolicy', []))
		    );
	}


	// Policies
	getPolicies(policies_info){
		let params = "";
		console.log(policies_info)
		let url = this.url+"policies";

		if(policies_info.page){
			params = "?page="+policies_info.page;
		}
		if(policies_info.seller_id){
			params += "&seller_id="+policies_info.seller_id;
		}
		if(policies_info.policy_states !== ''){
				params += "&policy_states[]="+ policies_info.policy_states;
		}
		if(policies_info.membership_states !== ''){
					params += "&membership_state="+ policies_info.membership_states;
		}
		if(policies_info.seller_states){
			if(policies_info.seller_states.length == 1){
				policies_info.seller_states.forEach(element => {
					params += "&seller_state="+element;
				});
			}
		}
		if(policies_info.device_states && policies_info.device_states.length<4){
			policies_info.device_states.forEach(element => {
				params += "&device_states[]="+element;
			});
		}

		/* if(policies_info.vin_states){
			if(policies_info.vin_states.length == 1){
				policies_info.vin_states.forEach(element => {
					params += "&vin="+element;
				});
			}
		} */
		if(policies_info.vin_states !== ''){
			params += "&vin="+ policies_info.vin_states;
		}
		if(policies_info.km_states !== ''){
				params += "&km_states[]="+ policies_info.km_states;
		}
		if(policies_info.search!="")
			params += '&term='+policies_info.search;
		if(policies_info.from_date)
			params += "&from_date="+policies_info.from_date;
		if(policies_info.to_date)
			params += "&to_date="+policies_info.to_date;
		if(policies_info.tracking_department_id!=""){
			params+="&tracking_department_id="+policies_info.tracking_department_id
		}
		if(policies_info.call_topic_id!=""){
			params+="&call_topic_id="+policies_info.call_topic_id
		}
		console.log('params' + params);
		return this.http.get(url+params,httpOptions)
		.pipe(
			tap(data => this.log('getPolicies')),
		    catchError(this.handleError('error getPolicies', []))
		);
	}

	/* getPolicies(policies_info){
		let filtros = policies_info;
		let url = this.url+"policies";
		const httpOptions2 = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			withCredentials: true,
			params: filtros
		};
		return this.http.get(url,httpOptions2)
		.pipe(
			tap(data => this.log('getPolicies')),
		    catchError(this.handleError('error getPolicies', []))
		);
	} */

	validatePassword(seller_id,password){
		let data = {
			'password' : password
		}
		return this.http.post(this.url+'sellers/'+seller_id+'/confirm',data,httpOptions)
					.pipe(
						tap(data => this.log('validatePassword')),
				      catchError(this.handleError('error validatePassword', []))
					);

	}
	validateUser(email){
		return this.http.get(this.url+"users/exists?email="+email,httpOptions)
					.pipe(
						tap(data => this.log('validateUser')),
				      catchError(this.handleError('error validateUser', []))
					);

	}
	changeUserEmail(user_id,data){
		return this.http.post(this.url+"users/"+user_id+"/change_email",data,httpOptions)
			   .pipe(
					tap(data => this.log('changeUserEmail')),
				    catchError(this.handleError('error changeUserEmail', []))
				);
	}

	createCard(card){
		return this.http.post(this.url+"cards",card,httpOptions)
			   .pipe(
					tap(data => this.log('createCard')),
				    catchError(this.handleError('error createCard', []))
				);

	}


	getPromotions(page,status){
		return this.http.get(this.url+"promotions?page="+page+"&status="+status,httpOptions)
		.pipe(
			tap(data => this.log('getPromotions')),
		    catchError(this.handleError('error getPromotions', []))
		);
	}

	getPromotion(promotion_id){
		return this.http.get(this.url+"promotions/"+promotion_id,httpOptions)
		.pipe(
			tap(data => this.log('getPromotion')),
		    catchError(this.handleError('error getPromotion', []))
		);
	}
	createPromotions(promotion){
		return this.http.post(this.url+"promotions",promotion,httpOptions)
		.pipe(
			tap(data => this.log('createPromotions')),
		    catchError(this.handleError('error createPromotions', []))
		);

	}
	updatePromotion(promotion_id,promotion){
		return this.http.post(this.url+"promotions/"+promotion_id+"/update",promotion,httpOptions)
		.pipe(
			tap(data => this.log('updatePromotion')),
		    catchError(this.handleError('error updatePromotion', []))
		);

	}
	createPromoCode(promo_code){
		return this.http.post(this.url+"promo_codes",promo_code,httpOptions)
		.pipe(
			tap(data => this.log('createPromoCode')),
		    catchError(this.handleError('error createPromoCode', []))
		);

	}
	getPromotionApplied(page){
		return this.http.get(this.url+"promotions/applied?page="+page, httpOptions)
		.pipe(
			tap(data => this.log('getPromotionApplied')),
		    catchError(this.handleError('error getPromotionApplied', []))
		);
	}
	getPromoCodes(page,type){
		return this.http.get(this.url+"promo_codes?page="+page+"&type="+type,httpOptions)
		.pipe(
			tap(data => this.log('getPromoCodes')),
		    catchError(this.handleError('error getPromoCodes', []))
		);

	}
	getSubscriptionsByPolicy(policy_id){
		return this.http.get(this.url+"subscriptions?policy_id="+policy_id,httpOptions)
		.pipe(
			tap((data:any) => this.log('getSubscriptionsByPolicy')),
			catchError(this.handleError('error getSubscriptionsByPolicy', []))
		);
	}

	printLabel(label){
		return this.http.post("http://192.168.15.150/pstprnt",label,httpOptions)
		.pipe(
			tap((data:any) => this.log('printLabel')),
			catchError(this.handleError('error printLabel', []))
		);

	}
	createCustomerTracking(data){
		return this.http.post(this.url+"customer_trackings",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('createCustomerTracking')),
			catchError(this.handleError('error createCustomerTracking', []))
		);
	}
	getCustomerTracking(tracking_id){
		return this.http.get(this.url+"customer_trackings/"+tracking_id,httpOptions)
		.pipe(
			tap((data:any)=>this.log('getCustomerTracking')),
			catchError(this.handleError('error getCustomerTracking',[]))
		)
	}
	closeCustomerTracking(tracking_id,data){
		return this.http.post(this.url+"customer_trackings/"+tracking_id+"/close",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('closeCustomerTracking')),
			catchError(this.handleError('error closeCustomerTracking', []))
		);
	}
	createTrackingCall(tracking_id,data){
		return this.http.post(this.url+"customer_trackings/"+tracking_id+"/schedule_call",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('createCustomerTracking')),
			catchError(this.handleError('error createCustomerTracking', []))
		);
	}
	createTrackingCallMade(tracking_id,data){
		return this.http.post(this.url+"customer_trackings/"+tracking_id+"/call_made",data,httpOptions)
		.pipe(
			tap((data:any) => this.log('createTrackingCallMade')),
			catchError(this.handleError('error createTrackingCallMade', []))
		);
	}
	getTrackingOptions(){
		return this.http.get(this.url+"customer_trackings/tracking_options",httpOptions)
		.pipe(
			tap((data:any)=>this.log('getTrackingOptions')),
			catchError(this.handleError('error getTrackingOptions',[]))
		)
	}
	getAllCustomerTracking(tracking){
		let url="page="+tracking.page;

		if(tracking.policy_id)
			url+="&policy_id="+tracking.policy_id;
		return this.http.get(this.url+"customer_trackings?"+url,httpOptions)
		.pipe(
			tap((data:any)=>this.log('getAllCustomerTracking')),
			catchError(this.handleError('error getAllCustomerTracking',[]))
		)
	}
	getEmailTracking(email){
		let params="";
		if(email.params.user_id!="")
			params+="user_id="+email.params.user_id;
		return this.http.get(this.url+"users/get_mailer_data?"+params,httpOptions)
		.pipe(
			tap((data:any)=>this.log('getEmailTracking')),
			catchError(this.handleError('error getEmailTracking',[]))
		)
	}
	getSumary(date){
		return this.http.get(this.url+"sumary?date="+date,httpOptions)
		.pipe(
			tap((data:any)=>this.log('getSumary')),
			catchError(this.handleError('error getSumary',[]))
		)
	}
	paymentDevice(policy_id,payment){
		return this.http.post(this.url+"policies/"+policy_id+"/pay_device",payment,httpOptions)
		.pipe(
			tap((data:any)=>this.log('paymentDevice')),
			catchError(this.handleError('error paymentDevice',[]))
		)
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
