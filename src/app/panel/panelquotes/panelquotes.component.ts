import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { PaginationService } from '../../services/pagination.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Seller } from '../../constants/seller';
import { LoginService } from '../../services/login.service';
import { LoaderService } from '../../services/loader.service';


import swal from 'sweetalert';
import { AlertPromise } from 'selenium-webdriver';
declare var $:any;


@Component({
  selector: 'app-panelquotes',
  templateUrl: './panelquotes.component.html',
  styleUrls: ['./panelquotes.component.scss']
})
export class PanelquotesComponent implements OnInit {
	quotation =  new Quotation('','','','','','','','','','',2,'','','','');
	quotes: any = Array();
	
	quote_info: any = {
		total: 1,
		page: 1,
		pages:1,
		pagination: Array(),
		seller_id: "",
		quote_state: "pending",
		payment_state: "",
		seller_state: "assigned",
		term: "",
		from_date: "",
		to_date: ""
	}
	
	seller:any;
	sellers: Seller[];
	filter: any = "";


	makers: Maker[];
	years: Year[];
	models: Model[];
	versions: Version[];
	years_birth:any = Array();


	assign_seller: any = {
		seller_id: "",
		quote_id: "",
		hubspot_id: "",
	};
	email_quotes: any = {
		quote_id: "",
		email: ""
	}
	delete_quote: any = {
		delete_reasons: Array(),
		quote_id: "",
		reason_id: "",
		password: ""
	}
	quote: any = {
		quote_id: "",
		recotizar:false,
		birthdate: "",
		loaderModels: false,
		loaderVersions: false,
		zipcode: "",
		birth_day: "",
		birth_month: "",
		birth_year: "",
		user: {
			first_name: "",
			last_name: "",
			second_last_name: ""
		}
	}
	
	/**
	 * Type *
	 * 1. Nuevo seguimiento
	 * 2. Llamada con seguimiento
	 * 3. Llamada sin seguimiento
	*/
	tracking: any = {
		type: 3,
		action: "close",
		future_call: false,
		customer_tracking: { 
			customer_id: "",
			policy_id: "",
			open_reason: "cobranza"
		},
		tracking_call: {
			reason: "",
			assigned_user_id: "",
			scheduled_call_date: "",
			result: "",
			note: ""
		},
		customer_tracking_close: {
			status: "closed",
			close_reason: 0,
			coment: "test"
		}
	}
	


	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private loader: LoaderService) { }
	ngOnInit(){
		this.loader.show();
		this.seller = this.loginService.getSession();

		this.quote_info.seller_id = this.seller.id;
		//MArcas
		this.quotationService.getMakersWS()
			.subscribe(makers => this.makers = makers)
		//Años
		this.quotationService.getYears()
			.subscribe(years => this.years = years)

		//Se traen los vendedores
		this.operatorsService.getSellers()
			.subscribe((data:any)=>{
				if(data.result)
					this.sellers = data.sellers;
			});
		this.operatorsService.getReasonsDeleteQuote()
		.subscribe((data:any)=>{
			if(data){
				console.log(data)
				this.delete_quote.delete_reasons = data;
			}
		});
		
		if(localStorage.getItem("quote_info")){
			let quote_info= JSON.parse(localStorage.getItem("quote_info"));
			console.log("localstorage");
			console.log(quote_info);

			this.quote_info = {
				total: quote_info.total,
				page: quote_info.page,
				pages:quote_info.pages,
				pagination: quote_info.pagination,
				seller_id: quote_info.seller_id,
				quote_state: quote_info.quote_state,
				payment_state:quote_info.payment_state,
				seller_state: quote_info.seller_state,
				term: quote_info.term,
				from_date: quote_info.from_date,
				to_date: quote_info.to_date
			}
			if(this.quote_info.quote_state!='')	
				this.filter = "quote_state,"+this.quote_info.quote_state;
			if(this.quote_info.payment_state!='')	
				this.filter = "payment_state,"+this.quote_info.payment_state;
			
		}
		else{
			let dateInit = new Date();
			let year = dateInit.getFullYear();
			let month:any = dateInit.getMonth()+1;
			let day = dateInit.getDate();
			if(month < 10) this.quote_info.from_date = year+"-0"+month;
			else this.quote_info.from_date = year+"-"+month;
			if(day < 10) this.quote_info.from_date += "-0"+day;
			else this.quote_info.from_date += "-"+day;

			this.quote_info.to_date = this.quote_info.from_date
		}
			
		
		this.getQuotes();

		this.years_birth= this.quotationService.getYearsBirth();
	}

	getQuotes(){
		this.loader.show();
		if(!this.quote_info.to_date)
			this.quote_info.to_date = this.quote_info.from_date;
		if(this.quote_info.to_date<this.quote_info.from_date)
			this.quote_info.to_date = this.quote_info.from_date;
		this.quotes = Array();
		this.quote_info.pages=1;
		this.quote_info.pagination = Array();
		
		localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
		this.operatorsService.getQuotes(this.quote_info)
		.subscribe((data:any)=>{
			console.log("GET QUOTES")
			console.log(data)
			this.quotes = data.quotes;
			this.quote_info.total = data.total_rows;
			this.quote_info.pages = data.pages;
			this.quote_info.pagination = this.paginationService.getPager(this.quote_info.pages,this.quote_info.page,10);
			this.loader.hide();
		});
	}

	searchQuote(){
		this.quote_info.page = 1;
		this.quote_info.seller_id =  "";
		this.quote_info.quote_state =  "";
		this.quote_info.payment_state = "";
		this.quote_info.seller_state =  "";
		this.quote_info.from_date = "";
		this.quote_info.to_date = "";
		this.filter="";

		this.getQuotes();
		
	}

	setFilters(){
		let filter = this.filter.split(",");
		this.quote_info.quote_state = "";
		this.quote_info.payment_state = "";
		
		switch(filter[0]){
			case 'quote_state': 
				this.quote_info.quote_state = filter[1];
				break;
			case 'payment_state': 
				this.quote_info.payment_state = filter[1];
				break;
			case 'seller_state':
				this.quote_info.seller_state = filter[1];
				this.quote_info.seller_id  = "";
				break;

		}
		this.getQuotes();
	}
	setPagination(page){
		if(page<1) page=1;
		if(page>this.quote_info.pages) page = this.quote_info.pages;
		this.quote_info.page = page;
		this.getQuotes();

	}
	

	changeSellerQuote(quote_id, seller_id){
		if(!seller_id) seller_id="";
		this.assign_seller = {
			quote_id: quote_id,
			seller_id: seller_id,
			hubspot_id: ""
		}
	}
	changeSellerQuoteSubmit(){
		this.loader.show();
		this.sellers.forEach(element => {
			if(this.assign_seller.seller_id==element.id)
			this.assign_seller.hubspot_id = element.hubspot_id
		});
		let full_name = "";
		let seller_id="";

		this.operatorsService.updateSellerQuotation(this.assign_seller.quote_id,this.assign_seller.seller_id)
		.subscribe((data:any)=>{
			this.loader.hide();
			if(data.result){
				this.sellers.forEach(
					item => {
						if(item.id==this.assign_seller.seller_id){
							full_name = item.full_name;
							seller_id = item.id;
						} 
					}
				);
				this.quotes.forEach(
					item => {
						if(item.id==this.assign_seller.quote_id){
							item.seller.id = seller_id;
							item.seller.full_name = full_name;
							//this.validateAccessToken();
						} 
					}
				);	
				swal("Se ha cambiado al vendedor correctamente", "", "success");
				$("#modalChangeSeller").modal("hide")
			}	
			else{
				swal("Hubo un problema", data.msg, "error");
			}
		});

	}
	modalSendEmailQuotes(quote_id, email){
		this.email_quotes = {
			quote_id: quote_id,
			email: email
		}

	}
	sendEmailQuotes(){
		$("#modalSendEmailQuotes").modal("hide");
		this.operatorsService.sendEmailQuotes(this.email_quotes)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.result)
				swal(data.msg, "", "success");
			else swal("No se pudo enviar el correo ", data.msg, "error");
		});
	}
	modalDeleteQuote(quote_id){
		this.delete_quote.reason_id = "";
		this.delete_quote.password = "";
		this.delete_quote.quote_id = quote_id;
	}
	deleteQuote(){
		this.operatorsService.validatePassword(this.seller.id,this.delete_quote.password)
		.subscribe((data:any)=>{
			if(data.result){
				this.operatorsService.deleteQuote(this.delete_quote.quote_id,this.delete_quote.reason_id)
				.subscribe((data2:any)=>{
					if(data2.result){
						let i = 0;
						this.quotes.forEach(element => {
							if(element.id==this.delete_quote.quote_id){
								this.quotes.splice(i, 1);
							}
							i++;
						});
						$("#modalDeleteQuote").modal("hide");
						swal(data2.msg,"","success")
					}
					else{swal(data2.msg,"","error");}
				})
			}
			else{
				swal(data.msg,"","error")
			}
		})
	}
	setQuotation(quote){

	}
	getModels(){
		this.models = Array();
		if(this.quotation.maker!='' && this.quotation.year!=''){
			this.quotationService.getModels(this.quotation.year,this.quotation.maker)
			.subscribe((data:any)=>{
				console.log(data);
				this.models = data;
			})
		}
	}
	getVersions():void{
		this.quotation.version = "";
		this.quotation.version_name="";
		this.quotation.sisa="";
		this.quote.loaderVersions = true;
		this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
		.subscribe(versions => {
			this.versions = versions; 
			this.quote.loaderVersions = false
		})
	}
	getSisa(tipo){
		if(tipo == 1){
			this.quotation.version_name = $('select[id="version"] option:selected').text();
		}
		else this.quotation.version_name = $('select[id="version_mobile"] option:selected').text();
		console.log("Version:"+this.quotation.version_name);
		this.quotationService.getSisa(this.quotation.maker, this.quotation.year,this.quotation.version)
		.subscribe((sisa:string) =>{
			console.log(sisa)
			this.quotation.sisa = sisa
		})
	}
	setGender(gender){
		this.quotation.gender = gender;
	}
	validateZipcode(){
		this.quotationService.validateZipcode(this.quotation.zipcode)
		.subscribe((zipcode:any)=>{
			this.quote.zipcode = zipcode.status;
				if(this.quote.zipcode==0) this.quotation.zipcode = "";
			})
	}
	setBirthDate(){
		let birth_date = "";
		if(this.quote.birth_month < 10)
			birth_date = this.quote.birth_year+"-0"+this.quote.birth_month+"-"+this.quote.birth_day; 
		else birth_date = this.quote.birth_year+"-"+this.quote.birth_month+"-"+this.quote.birth_day;
		
		if(this.quote.birth_year!="" && this.quote.birth_month!="" && this.quote.birth_day){
			let dia =  this.quote.birth_day;
			let mes = this.quote.birth_month;
			let year = this.quote.birth_year;
			let fecha = new Date(+year,+mes-1,+dia);
			let birth_date2=fecha.getFullYear()+"-";
			
			if(fecha.getMonth() < 9)
	          birth_date2 += "0"+(fecha.getMonth()+1)+"-";
	        else
	          birth_date2 += ""+(fecha.getMonth()+1)+"-";

			if(fecha.getDate() < 10)
	          birth_date2 += "0"+fecha.getDate();
	        else
	          birth_date2 += ""+fecha.getDate();
	      	

	      	console.log("original:"+birth_date);
	      	console.log("res:"+birth_date2);

	      	if(birth_date==birth_date2){
	      		console.log("Si son iguales");
	      		this.quotation.birth_date = birth_date;
	      	} else {
	      		this.quotation.birth_date = "";
	      	}
		}
	}
	requote(quote){
		let maker = "";
		let birth_date = quote.user.birth_date.split('-');
		console.log("Cotización a recotizar: "+quote.id);
		this.quote.recotizar = true;
		this.quote.quote_id = quote.id;
		this.makers.forEach(element=>{
			if(element.name==quote.car.maker)
				maker = element.id;
		});

		this.quote.birth_day = birth_date[2];
		this.quote.birth_month = +birth_date[1];
		this.quote.birth_year = birth_date[0];

		this.quotation = {
			name: "",
			maker:maker,
			maker_name: quote.car.maker,
			year: ""+quote.car.year+"",
			model: "",
			version: quote.car.version_id,
			version_name: quote.car.version,
			sisa: quote.car.version_id,
			email: quote.user.email,
			cellphone: quote.user.phone,
			gender: +quote.user.gender,
			zipcode: quote.user.zip_code,
			birth_date: quote.user.birth_date,
			referred_code: "",
			promo_code: ""
		}
		this.quotationService.getModels(this.quotation.year,this.quotation.maker)
		.subscribe(models => {
			console.log(models)
			this.models = models;
			this.quote.loaderModels=false;
			this.models.forEach(element => {
				if(quote.car.model.indexOf(element.name) > -1){
					this.quotation.model = element.id;
				}
			});
			this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
			.subscribe(versions => {
				this.versions = versions; 
				this.quote.loaderVersions = false
				if(this.versions.length>0){
					this.versions.forEach(element => {
						if(quote.car.version.indexOf(element.name) > -1){
							this.quotation.version = element.id;
							this.quotation.version_name = element.name;
						}
					});
				}
			})		
		})

	}
	newQuote(){
		this.quote = {
			quote_id: "",
			recotizar:false,
			birthdate: "",
			loaderModels: false,
			loaderVersions: false,
			zipcode: "",
			birth_day: "",
			birth_month: "",
			birth_year: "",
			user: {
				first_name: "",
				last_name: "",
				second_last_name: ""
			}
		}
		this.quotation = {
			name: "",
			maker: "",
			maker_name: "",
			year: "",
			model: "",
			version: "",
			version_name: "",
			sisa: "",
			email: "",
			cellphone: "",
			gender: 2,
			zipcode: "",
			birth_date: "",
			referred_code: "",
			promo_code: ""
		}
	}
	sendQuotation(){
		$('#modalCotizador').modal('hide')
		this.loader.show();
		let quotation: any = Array();
		let age = this.quotationService.getAge(this.quote.birth_year);
		this.makers.forEach(element => {
			if(element.id==this.quotation.maker)
				this.quotation.maker_name = element.name;
		});
		quotation = {
			user: {
				phone: this.quotation.cellphone,
				age: age,
				gender: this.quotation.gender,
				birth_date: this.quotation.birth_date,
				zip_code: this.quotation.zipcode,
				first_name: this.quote.user.first_name,
				last_name: this.quote.user.last_name,
				second_last_name: this.quote.user.second_last_name,
				email: this.quotation.email
			},
			car: {
				maker: this.quotation.maker_name,
				year: this.quotation.year,
				model: this.quotation.version_name,
				version_id: ""+this.quotation.sisa
			}
		}

		console.log(quotation);
		this.operatorsService.requote(quotation)
		.subscribe((data:any)=>{
			console.log(data);
			this.loader.hide();
			if(data.result){
				if(this.quote.recotizar){
					console.log("Recotizar");
					this.delete_quote.quote_id = this.quote.quote_id;
					this.delete_quote.reason_id ="requote";
					this.operatorsService.deleteQuote(this.delete_quote.quote_id,this.delete_quote.reason_id)
					.subscribe((data2:any)=>{
						console.log(data2);
						if(data2.result){
							
							this.quotes.forEach(element => {
								if(element.id==this.delete_quote.quote_id){
									console.log(data.quote);
									element.id = data.quote.id;
									element.packages_costs =  data.quote.packages_costs;
									element.car = data.quote.car;
									element.created_at = data.quote.created_at;
									element.user = data.quote.user;
									element.promo_code = data.quote.promo_code;
									element.seller = data.quote.seller;
									element.status = data.quote.status;
									swal("Cotización exitosa", "", "success");
								}
							});
							
						}
						else{swal(data2.msg,"","error");}
					})
					
				}
				else{
					this.quotes.unshift(data.quote);
					swal("Cotización exitosa", "", "success");
				}
			}
			else{
				swal(data.msg,"","error");
			}
		})
	}

	setCustomerTracking(type,quote){
		let future_call = false;
		let tracking_call_result = "";
		if(type==1){
			future_call = true;
			tracking_call_result = null;
		}

		
		this.tracking = {
			type: type,
			future_call: future_call,
			call_date: "",
			call_time: "",
			customer_tracking: { 
				customer_id: quote.user.id,
				policy_id: quote.id,
				open_reason: "cobranza",
				coment: ""
			},
			tracking_call: {
				reason: "",
				assigned_user_id: this.seller.id,
				scheduled_call_date: "",
				result: tracking_call_result,
				note: ""
			},
			customer_tracking_close: {
				status: "closed",
				close_reason: 0,
				coment: ""
			}
		}
		 
	}

	saveTracking(){
		let data : any;
		this.tracking.tracking_call.scheduled_call_date = this.tracking.call_date+" "+this.tracking.call_time;
		if(this.tracking.type==1){
			data = {
				customer_tracking: this.tracking.customer_tracking,
				tracking_call: this.tracking.tracking_call
			}
			this.createCustomerTracking(data);
		}
		if(this.tracking.type==2){
			data = { 
					tracking_call: {
						result: this.tracking.tracking_call.result,
						note: "test"
				}
			}
			this.updateTrakingCall(data);
		}
		console.log(data)
	}
	createCustomerTracking(data){
		this.operatorsService.createCustomerTracking(data)
		.subscribe((result:any)=>{
			console.log(result);
			if(result.result){
				swal(result.msg,"","success");
			}
		})
	}
	updateTrakingCall(data){
		this.operatorsService.createTrackingCallMade(17,data)
		.subscribe((result:any)=>{
			console.log(result);
			if(result.result){
				if(this.tracking.future_call){
					this.tracking.tracking_call.result=null;
					this.operatorsService.createTrackingCall(17,this.tracking.tracking_call)
					.subscribe((data2:any)=>{
						console.log(data2);
					})
				}	
			}
		})
	}
}