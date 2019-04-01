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
import { element } from '@angular/core/src/render3/instructions';
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
		quote_state: "",
		payment_state: "",
		phone_state: "",
		seller_state: "",
		term: "",
		from_date: "",
		to_date: "",
		tracking_department_id: "",
    call_topic_id: ""
	}

	
	seller:any;
	sellers: Seller[];
	filter: any = "";
	filters_tracking: any = Array();


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
	
	tracking:any ={
		id: 0,
    type: 1,
    future_call:false,
    date: "",
    time:"",
    customer_tracking:Array()
  }
  tracking_options: any = {
		areas: Array(),
    area: {
			id: 1,
      name: "",
      call_topics: Array(),
      tracking_close_reasons: Array(),
      call_types: Array(),
			call_results: Array(),
    }
  }
  
  tracking_customer: any = {
		customer_tracking: {
			customer_id: 0,
      policy_id: 0,
      tracking_department_id: null,
      coment: ""
    },
    tracking_call: {
			call_topic_id: null,
      call_type_id: null,
      assigned_user_id: null,
      scheduled_call_date: "",
      call_result_id: null,
      note: ""
    },
    close_tracking: true
  }
	// varibles para funcion changeTopic()
	show_radios:boolean = true;
	current_call_results:any[];
	topic_id:any;
	call_result: boolean = true;
	result_call_id: any;
	type_close:boolean =false;

	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private loader: LoaderService) { }
	ngOnInit(){
		this.loader.show();
		this.seller = this.loginService.getSession();
		if(this.seller.id==2)
			this.quote_info.seller_id = this.seller.id;
		//Marcas
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
		this.operatorsService.getTrackingOptions()
    .subscribe((data:any)=>{
      if(data.result){
				console.log(data)
				this.filters_tracking = data.data[3]
				/* this.tracking_customer.customer_tracking.tracking_department_id = 4; */
				/* 	this.tracking_options.area = this.tracking_options.areas[3]; */
				/* this.changeDepartment(3) */
      }
    })
		
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
				to_date: quote_info.to_date,
				tracking_department_id: quote_info.tracking_department_id,
				call_topic_id: quote_info.call_topic_id
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
		this.operatorsService.getTrackingOptions()
      .subscribe((data:any)=>{
        if(data.result){
          this.tracking_options.departments = data.data.departments 
          this.tracking_options = {
            areas: data.data,
            area: data.data[0]
          }
          this.getQuotes();
        }
      })
			
		
		

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
		this.quote_info.tracking_department_id = "";
    this.quote_info.call_topic_id = "";
		this.filter="";

		this.getQuotes();
		
	}

	setFilters(){
		let filter = this.filter.split(",");
		console.log(filter)
		this.quote_info.quote_state = "";
		this.quote_info.payment_state = "";
		
		switch(filter[0]){
			case 'quote_state': 
				this.quote_info.quote_state = filter[1];
				console.log(this.quote_info.quote_state)
				break;
			case 'payment_state': 
				this.quote_info.payment_state = filter[1];
				break;
			case 'seller_state':
				this.quote_info.seller_state = filter[1];
				this.quote_info.seller_id  = "";
				break;
			case 'phone_state':
				this.quote_info.phone_state = filter[1];
				console.log(this.quote_info.phone_state)
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
		let full_name="";
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
	getModels():void{
		this.models = Array();
		this.versions = Array();
		if(this.quotation.maker!="" && this.quotation.year!=""){
			this.quote.loaderModels = true;
			this.quotationService.getModels(this.quotation.year,this.quotation.maker)
			.subscribe((data:any)=>{
				console.log(data);
				this.models = data;
				this.quote.loaderModels = false;
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

	changeDepartmentSearch(type){
		if(type==1){
			this.quote_info.call_topic_id="";
		}
		this.getQuotes();
	}

	//Tracking
  setCustomerTracking(type,policy,tracking_id=null){
    this.tracking.type = type;
    this.tracking.id=tracking_id;
    this.tracking_customer.customer_tracking.customer_id = policy.user.id;
    this.tracking_customer.customer_tracking.policy_id = policy.id;
		this.tracking.customer_tracking=Array();
    if(this.tracking.id){
      this.operatorsService.getCustomerTracking(this.tracking.id)
      .subscribe((data:any)=>{
        console.log(data)
				if(data.result) 
				console.log("hola")
				this.tracking.customer_tracking=data.customer_traking;
				this.tracking.customer_tracking.department = this.tracking_customer.customer_tracking.tracking_department_id
				console.log(this.tracking.customer_tracking)
      })
    }
    
  }
  changeDepartment(event: any){
    let index = event.target.options.selectedIndex;
		console.log(index);
		if(index == 4){
			this.show_radios = false
			this.call_result = false;
		}else{
			this.show_radios = true
			this.call_result = true;
		}
    this.tracking_options.area = this.tracking_options.areas[index];
    console.log(this.tracking_options.area)
	}

	changeTopic(){
		this.tracking.future_call
		console.log(this.tracking.future_call)
		if(this.tracking_options.area.id == 4){
			this.topic_id = this.tracking_customer.tracking_call.call_topic_id
			console.log(this.topic_id)
			let array = this.tracking_options.area.call_results.filter(element => {
				console.log(element.topic_ids.includes(Number(this.topic_id))) 
				return element.topic_ids.includes(Number(this.topic_id))
			})
			this.current_call_results = array
			console.log(this.current_call_results)
				if(this.topic_id == 17){
					this.call_result = false;
					this.show_radios = false;
					this.tracking.future_call = false;
					this.tracking_customer.close_tracking = true;
				}else{
					this.show_radios=true;
				}
		}else{
			this.current_call_results = this.tracking_options.area.call_results
		}
	}
	
	changeResultCall(){
		console.log(this.show_radios)
		this.result_call_id = this.tracking_customer.tracking_call.call_result_id
		console.log(this.result_call_id)
		if(this.tracking_options.area.id == 4){
			if(this.result_call_id == 5 && this.show_radios == false ){
				this.call_result = true;
				this.tracking.future_call = true;
				this.tracking_customer.close_tracking = false;
				this.type_close = false;
			}else if(this.result_call_id == 6  && this.show_radios == false){
				this.call_result = false;
				this.tracking.future_call = false;
				this.tracking_customer.close_tracking = true;
				this.type_close = false
			}else if(this.result_call_id == 7  && this.show_radios == false){
				this.call_result = false;
				this.tracking.future_call = false;
				this.tracking_customer.close_tracking = true;
				this.type_close = true;
			}
		}
	}

  changeRadio(){
		this.tracking.future_call = !this.tracking.future_call;
		console.log(this.tracking.future_call)
    this.tracking.data="";
    this.tracking.time="",
		this.tracking_customer.customer_tracking.tracking_close_reason_id=null;
		this.tracking_customer.close_tracking = !this.tracking.future_call;
    console.log("cerrar", this.tracking_customer.close_tracking)
	}
	
  createTrackingCustomer(){
    this.tracking_customer.tracking_call.scheduled_call_date = this.tracking.date+"T"+this.tracking.time;

    console.log(this.tracking_customer);
    if(this.tracking.type==1 && !this.tracking.future_call){
      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          swal(data.msg,"","success");
          $("#modalSeguimiento").modal("hide");
          this.getQuotes();
        }
      })
    }
    if(this.tracking.type==1 && this.tracking.future_call){
      let new_call = { 
        tracking_call: {
          call_topic_id: this.tracking_customer.tracking_call.call_topic_id,
          call_type_id: this.tracking_customer.tracking_call.call_type_id,
          assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
          scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
          call_result_id: null,
          note: ""
        }
      }
      this.tracking_customer.tracking_call.scheduled_call_date = "";
      this.tracking_customer.tracking_call.assigned_user_id = this.seller.id;
			console.log(this.tracking_customer, new_call)
      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.operatorsService.createTrackingCall(data.customer_tracking.id,new_call)
          .subscribe((data2:any)=>{
            console.log(data2);
            if(data2.result){
              $("#modalSeguimiento").modal("hide");
              this.getQuotes();
              swal("Llamada registrada correctamente","","success")
              
            }
            else swal(data2.msg,"","error");
          })
        }
      })
    }
    if(this.tracking.type==2){
      console.log("2");
      let call_made:any;
      if(!this.tracking.future_call){
        call_made = { 
          tracking_call: {
            call_result_id: this.tracking_customer.tracking_call.call_result_id,
            note: this.tracking_customer.tracking_call.note
          },
          close_tracking: this.tracking_customer.close_tracking,
          /* customer_tracking: {
            tracking_close_reason_id: this.tracking_customer.customer_tracking.tracking_close_reason_id,
            comment: this.tracking_customer.customer_tracking.coment
          } */
        }
      }
      else{
				console.log("2");
        call_made = { 
          tracking_call: {
            call_result_id: this.tracking_customer.tracking_call.call_result_id,
            note: this.tracking_customer.tracking_call.note
          }
        }
      }

     console.log("llamada hacer",call_made)
     this.operatorsService.createTrackingCallMade(this.tracking.id,call_made)
     .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          if(this.tracking.future_call){
						console.log(this.tracking.future_call)
            let new_call = { 
              tracking_call: {
                call_topic_id: this.tracking_customer.tracking_call.call_topic_id,
                call_type_id: this.tracking_customer.tracking_call.call_type_id,
                assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
                scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
                call_result_id: null,
                note: ""
              }
            }

            this.operatorsService.createTrackingCall(this.tracking.id,new_call)
            .subscribe((data:any)=>{
              console.log(data);
              if(data.result){
                $("#modalSeguimiento").modal("hide");
								swal("Llamada registrada correctamente","","success")
								this.getQuotes();
              }
              else swal(data.msg,"","error");
            })
          }
          else {
            $("#modalSeguimiento").modal("hide");
            this.getQuotes();
            swal("Seguimiento cerrado correctamente","","success")
          }
        }
      }) 
    }
  }
}