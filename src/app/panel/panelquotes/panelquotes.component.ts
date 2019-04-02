<<<<<<< HEAD
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
declare var $:any;


@Component({
  selector: 'app-panelquotes',
  templateUrl: './panelquotes.component.html',
  styleUrls: ['./panelquotes.component.scss']
})
export class PanelquotesComponent implements OnInit {
	quotes: any = [];
	quotation_tipo: any = "nueva";
	quotation =  new Quotation('','','','','','','','','',2,'','','','');
	quote_selected:any;
	makers: Maker[];
	years: Year[];
	models: Model[];
	versions: Version[];
	modelLength = 0;
	versionLength=0;
	birth_date: any = '';
	birth_day:any = '';
	birth_month:any="";
	birth_year: any="";
	error_date: any = "";
	years_birth:any = Array();
	loaderModels: boolean = false;
	loaderVersions: boolean = false;
	zipcode:any = 1;

	sellers: Seller[];
	seller_id:any = "";
	page: any = 1;
	pages:any = 1;
	pagination: any = [];
	filters:any= ["quote_states,pending"];
	quotation_id:any;
	busqueda:any = "";
	quote_info: any = {
		total: 1,
		page: 1,
		seller_id: "",
		quote_state: "pending",
		payment_state: "",
		seller_state: "",
		term: "",
		from_date: "",
		to_date: ""
	}
	delete_quote: any = {
		quote_id: "",
		reason: "",
		password:""
	}
	email_quotes: any = {
		quote_id: "",
		email: ""
	}
	assign_seller: any = {
		email: "",
		quote_id: "",
		seller_id: "",
		hubspot_id: ""
	}
	delete_reasons: any;
	seller:any;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private loader: LoaderService) { }
	ngOnInit() {
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
				this.delete_reasons = data;
			}
		})
		/*
		if(localStorage.getItem("quote_info")){
			let quote_info= JSON.parse(localStorage.getItem("quote_info"));
			console.log("localstorage");
			console.log(quote_info);
			this.quote_info= {
				page: quote_info.page,
				seller_id: quote_info.seller_id,
				quote_state: quote_info.quote_state,
				payment_state:quote_info.payment_state,
				seller_state: quote_info.seller_state,
				term: quote_info.term
			}
			//if(this.quote_info.quote_state) this.filters = "quote_states,"+this.quote_info.quote_state;
			//if(this.quote_info.payment_state) this.filters = "payment_states,"+this.quote_info.payment_state;
			//if(this.quote_info.seller_state) this.filters = "seller_states,"+this.quote_info.seller_state;
		}*/
			
		
		this.searchQuote();

		this.years_birth= this.quotationService.getYearsBirth();
	}
	ordenar(param,orden){
		if(param=='id' && orden=='ASC') this.quotes.sort(function(a, b){return a.id - b.id});
		if(param=='id' && orden=='DESC') this.quotes.sort(function(a, b){return b.id - a.id});
	}
	setQuotation(quote){
		console.log(quote);
		let maker:any;
		let birth_date = quote.user.birth_date.split('-');
		this.quotation_tipo = "recotizar";
		this.birth_day = birth_date[2];
		this.birth_month = +birth_date[1];
		this.birth_year = birth_date[0];
		this.makers.forEach(element=>{
			if(element.name==quote.car.maker)
			maker = element.id;
		});

		this.quote_selected = quote;

		this.quotation = {
			maker: maker,
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
				this.loaderModels=false;
				this.modelLength = 1;
				this.models.forEach(element => {
					if(quote.car.model.indexOf(element.name) > -1){
						this.quotation.model = element.id;
					}
				});
				this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
					.subscribe(versions => {
						this.versions = versions; 
						this.loaderVersions = false
						if(this.versions.length>0){
							this.versionLength = 1;
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
	setQuotation2(){
		let maker:any = "";
		this.quotation_tipo = "nueva";
		this.birth_day = "";
		this.birth_month = "";
		this.birth_year = "";

		this.quote_selected = {
			user: {
				first_name: null,
				last_name: null,
				second_last_name: null
			}
		};

		this.quotation = {
			maker: maker,
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
	getModels():void {
		this.modelLength = 0;
		this.versionLength = 0;
		if(this.quotation.maker!="" && this.quotation.year!=""){
			this.quotation.model = "";
			this.quotation.version = "";
			this.quotation.version_name="";
			this.models = null;
			this.versions = null;
			this.loaderModels = true;
			this.quotationService.getModels(this.quotation.year,this.quotation.maker)
				.subscribe(models => {
					this.models = models; 
					this.loaderModels=false;
					if(this.models.length>0)
						this.modelLength = 1;
				})
		}
	}
	getVersions():void{
		this.quotation.version = "";
		this.quotation.version_name="";
		this.loaderVersions = true;
		this.versionLength = 0;
		this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
			.subscribe(versions => {
				this.versions = versions; 
				this.loaderVersions = false
				if(this.versions.length>0)
						this.versionLength = 1;
			})
	}
	validateZipcode(){
		this.quotationService.validateZipcode(this.quotation.zipcode)
			.subscribe((zipcode:any)=>{
				this.zipcode = zipcode.status;
				if(this.zipcode==0) this.quotation.zipcode = "";
			})
	}
	getSisa():void{
		this.quotationService.getSisa(this.quotation.maker, this.quotation.year,this.quotation.version)
			.subscribe((sisa:string) => this.quotation.sisa = sisa)
	}
	setVersionName(tipo){
		if( tipo == 1){
			this.quotation.version_name = $('select[id="version"] option:selected').text();
		}
		else this.quotation.version_name = $('select[id="version_mobile"] option:selected').text();
		console.log("Version:"+this.quotation.version_name);
	}

	setGender(gender){
		this.quotation.gender = gender;
	}
	setBirthDate(){
		let birth_date = "";
		if(this.birth_month < 10)
			birth_date = this.birth_year+"-0"+this.birth_month+"-"+this.birth_day; 
		else birth_date = this.birth_year+"-"+this.birth_month+"-"+this.birth_day;
		
		if(this.birth_year!="" && this.birth_month!="" && this.birth_day){
			let dia =  this.birth_day;
			let mes = this.birth_month;
			let year = this.birth_year;
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
	      		this.error_date = "";
	      	} else {
	      		this.quotation.birth_date = "";
	      		this.error_date = "Ingresa una fecha válida";
	      	}
		}
	}
	onSubmit(){
		$('#modalCotizador').modal('hide')
		this.loader.show();
		let quotation: any = Array();
		let age = this.quotationService.getAge(this.birth_year);
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
				first_name: this.quote_selected.user.first_name,
				last_name: this.quote_selected.user.last_name,
				second_last_name: this.quote_selected.user.second_last_name,
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
			.subscribe(
				(data:any)=>{
				console.log(data);
				if(data.result){
					let cotizaciones = "";
					data.quote.packages_costs.forEach(
						item => {
							cotizaciones+="Paquete "+item.package+": $"+item.cost_by_package+"\n";
						}
					);
					this.setHubspot(data.quote.packages_costs[0].cost_by_km,cotizaciones);
					if(this.quotation_tipo=='nueva'){
						this.loader.hide();
						this.quotes.unshift(data.quote);
						swal("Cotización exitosa", "", "success");
						$('#modalCotizador').modal('hide')
					}
					if(this.quotation_tipo=='recotizar'){
						console.log("La original es: "+this.quote_selected.id)
						this.delete_quote={
							quote_id: this.quote_selected.id,
							reason: "",
							password:""
						}
						console.log(this.delete_quote)
						let i =0; let j = 0;
						this.quotes.forEach(
							item => {
								console.log("Item:"+item.id+" ["+i+"]")
								if(item.id==this.delete_quote.quote_id){
									j = i;
									this.operatorsService.deleteQuote(this.delete_quote.quote_id,"requote")
										.subscribe((data2:any)=>{
											console.log(data2);
											if(data2.result){
												this.quotes.splice(j, 1);
												this.quotes.unshift(data.quote);
												this.loader.hide();
												
												swal("Se cotizó correctamente", "", "success");
												$('#modalCotizador').modal('hide')
											}
											else{
												$("#modalCotizador").modal("show");
												swal("Hubo un problema", data2.msg, "error");	
											} 
										}
									)
								}
								i++; 
							}
						);
					}

				}
				else{
					this.loader.hide();
					swal("Hubo un problema",data.msg,"error")
				}
			});
			
	}
	
	//ACCIONES
	changeSellerModal(email, quote_id,seller_id){
		this.assign_seller = {
			email: email,
			quote_id: quote_id,
			seller_id: seller_id,
			hubspot_id: ""
		}
		console.log(this.assign_seller);
		
		if(seller_id==null) this.assign_seller.seller_id = "";
	}
	changeSeller(){
		this.sellers.forEach(element => {
			if(this.assign_seller.seller_id==element.id)
			this.assign_seller.hubspot_id = element.hubspot_id
		});
		let full_name = "";
		let seller_id="";

		console.log("RESP");
		console.log(this.assign_seller)
		
		this.operatorsService.updateSellerQuotation(this.assign_seller.quote_id,this.assign_seller.seller_id)
			.subscribe((data:any)=>{
				this.sellers.forEach(
					item => {
						if(item.id==this.assign_seller.seller_id){
							full_name = item.full_name;
							seller_id = item.id;
						} 
					}
				);
				console.log("Nombre: "+full_name);
				this.quotes.forEach(
					item => {
						if(item.id==this.assign_seller.quote_id){
							item.seller.id = seller_id;
							item.seller.full_name = full_name;
							swal("Se ha cambiado al vendedor correctamente", "", "success");
							this.validateAccessToken();
						} 
					}
				);
				
			});
	}

	setEmailQuote(quote_id,email){
		this.email_quotes = {
			quote_id: quote_id,
			email: email
		}

	}

	sendEmailQuote(){
		$("#modalSendQuote").modal("hide");
		this.operatorsService.sendEmailQuotes(this.email_quotes)
			.subscribe((data:any)=>{
				console.log(data);
				if(data.result)
					swal("Se ha enviado el correo correctamente", "", "success");
				else swal("No se pudo enviar el correo ", "Inténtalo nuevamente", "error");
			});
	}

	searchQuote(tipo=null){
		console.log(this.quote_info);
		
		if(tipo!='paginator') this.quote_info.page = 1;
		console.log("LA FECHA FIN ES: "+this.quote_info.to_date)
		if(!this.quote_info.to_date)
			this.quote_info.to_date = this.quote_info.from_date;
		if(this.quote_info.to_date<this.quote_info.from_date)
			this.quote_info.to_date = this.quote_info.from_date;

		if(this.quote_info.seller_state=='unassigned')
			this.quote_info.seller_id="";
		this.quotes = Array();
		this.loader.show();
		localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
		
		this.operatorsService.getQuotes(this.quote_info)
			.subscribe((data:any)=>{
				console.log(data)
				this.quotes = data.quotes;
				this.pages  = data.pages;
				this.pagination = this.paginationService.getPager(this.pages,this.quote_info.page,5);
				this.quote_info.total = data.total_rows;
				this.quotes.forEach(element => {
					element.pending_payments = null;
					this.operatorsService.getPendingPaymentsQuotes(element.id)
					.subscribe((data2:any)=>{
						if(data2.result && data2.data.length>0){
							element.pending_payments = data2.data;
						}
					})
				});
				this.loader.hide();
			});
	}

	setPagination(page){
		this.page = page;
		this.quote_info.page = this.page;
		
		this.searchQuote('paginator');
	}

	setFilters(){
		let quote_state = Array();
		let payment_state = Array();
		let seller_state = Array();
		/**
		this.filters.forEach(element => {
			let filter = element.split(',');
			let filtro=filter[0], valor=filter[1];
			console.log(filtro)
			if(filtro!=""){
				if(filtro=='quote_states')
					quote_state.push(valor);
				if(filtro=='payment_states')
					payment_state.push(valor);
				if(filtro=='seller_states')
					seller_state.push(valor);
			}
		});**/
		let filter = this.filters.split(',');
		let filtro=filter[0], valor=filter[1];
		console.log("FILTROS")
		console.log(filtro)
		console.log(valor)
		if(filtro!=""){
			if(filtro=='quote_states')
				quote_state.push(valor);
			if(filtro=='payment_states')
				payment_state.push(valor);
			if(filtro=='seller_states')
				seller_state.push(valor);
		}

		if(quote_state.length<1) this.quote_info.quote_state = "";
		else this.quote_info.quote_state = quote_state[0];
		if(payment_state.length<1) this.quote_info.payment_state = "";
		else this.quote_info.payment_state = payment_state[0];
		if(seller_state.length<1) this.quote_info.seller_state = "";
		else this.quote_info.seller_state = seller_state[0];
		this.searchQuote();
		

	}

	deleteQuote(quote_id){
		this.delete_quote={
			quote_id: quote_id,
			reason: "",
			password:""
		}
		console.log(this.delete_quote)
	}
	deleteQuoteModal(){
		let i =0;
		let j = 0;
		console.log(this.seller.id);
		$("#modalDeleteQuote").modal("hide");
		this.quotes.forEach(
			item => {
				console.log("Item:"+item.id+" ["+i+"]")
				if(item.id==this.delete_quote.quote_id){
					j = i;
					this.operatorsService.validatePassword(this.seller.id,this.delete_quote.password)
				    .subscribe((data:any)=>{
				    	console.log(data);
					    if(data.result){
					      	this.operatorsService.deleteQuote(this.delete_quote.quote_id,this.delete_quote.reason)
							.subscribe((data:any)=>{
								console.log(data);
								if(data.result){
									console.log("La cotizacion a eliminar es la: "+this.delete_quote.quote_id)
									console.log("Index: "+j)
									if(this.quotes.splice(j, 1))
										swal("Se ha eliminado la cotización correctamente", "", "success");
								}
								else swal("No se pudo elimininar la cotización", data.msg, "error");
							})
					    }
					    else{
					    	swal("No se pudo elimininar la cotización", "La contraseña es incorrecta", "error");
					    }
				  	});
				}
				i++; 
			}
		);
	}

	setHubspot(cost_by_km,cotizaciones){
		console.log("HUBSPOT: "+this.seller.hubspot_id)
		let hubspot = Array();
		let gender = "Hombre";

		if(this.quotation.gender==1) gender = "Mujer";
		let date = new Date(this.quotation.birth_date);
            
		hubspot.push(
			{
            	"property": "origen_cotizacion",
            	"value": "Operaciones"
			},
			{
            	"property": "hubspot_owner_id",
            	"value": this.seller.hubspot_id
          	},  
          	{
            	"property": "dispositivo",
            	"value": "desktop"
          	},
          	{
	          "property": "vistas_cotizaciones",
	          "value": 0
	        },
	        {
	            "property": "auto_no_uber",
	            "value": true
	        },
	        {
	            "property": "auto_no_lucro",
	            "value": true
	        },
	        {
	            "property": "auto_no_siniestros",
	            "value": true
	        },
	        {
        		"property": "codigo_promocion",
            	"value": this.quotation.promo_code
          	},
          	{
            	"property": "codigo_referencia",
            	"value": this.quotation.referred_code
          	},
	        {
	        	"property": "email",
	            "value": this.quotation.email
	        },
	        {
	            "property": "sexo",
	            "value": gender
	        },
	        {
	        	"property": "mobilephone",
	            "value": this.quotation.cellphone,
	        },
	        {
	            "property": "zip",
	            "value": this.quotation.zipcode
	        },
	        {
	            "property": "fecha_nacimiento",
	            "value": 	date.getTime()
	        },
	        {
	            "property": "tipo_version",
	            "value": this.quotation.version_name
	        },
	        {
	            "property": "ano_modelo",
	            "value": this.quotation.year
	        },
	        {
	            "property": "marca_cotizador",
	            "value": this.quotation.maker_name
	        },
	        {
	            "property": "modelo_cotizador",
	            "value": this.quotation.model
			}
			,
			{'property':'cost_by_km', 'value': cost_by_km},
    		{'property':'cotizaciones', 'value': cotizaciones}
        );

        this.hubspotService.refreshToken()
        	.subscribe((data:any)=>{
        		localStorage.setItem("access_token",data.access_token);
        		let form = {
			    	"properties"  : hubspot,
			        "access_token": localStorage.getItem("access_token"),
			        "vid": ""
			    }
        		this.hubspotService.createContact(form)
        			.subscribe((data:any)=>{
        				localStorage.setItem("vid",data.vid);
        			})
        	});

	}
	updateHubspot(){
		let hubspot = Array();
		
    	hubspot.push(
			{
            	"property": "hubspot_owner_id",
            	"value": this.assign_seller.hubspot_id
          	}
    		
    	);
    	let form = {
			"properties"  : hubspot,
			"access_token": localStorage.getItem("access_token"),
			"vid": localStorage.getItem("vid")
		}



    	this.hubspotService.updateContactVid(form)
    		.subscribe((data:any)=>{
    			console.log(data)
    		})
	}

	validateAccessToken(){
		this.hubspotService.validateToken(localStorage.getItem("access_token"))
        	.subscribe((data:any) =>{ 
				console.log(data)
        		if(data.status=='error'){
        			this.hubspotService.refreshToken()
        			.subscribe((data:any)=>{
        				localStorage.setItem("access_token",data.access_token);
        				this.getContactHubspot();
        			});
        		}
        		else this.getContactHubspot();
        	});
	}
	getContactHubspot(){
		this.hubspotService.getContactByEmail(this.assign_seller.email,localStorage.getItem("access_token"))
        	.subscribe((data:any) =>{ 
        		console.log(data);
        		localStorage.setItem("vid",data.vid);
        		this.updateHubspot();
        	})

	}

}
=======
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
	show_select:boolean = false

	
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
			this.show_radios = false;
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
	
	changeResultCall(e){
		console.log(e.target.value)
		if(e.target.value == 7){
			this.show_select = true
			this.operatorsService.getCloseReasonCall().subscribe((data:any)=>{
				this.tracking_options.area.tracking_close_reasons = data.data;
			},
			(error:any)=>{
				console.log(error)
			});
		}else{
			this.show_select = false
		}
		console.log(this.show_radios)
		this.result_call_id = this.tracking_customer.tracking_call.call_result_id
		console.log(this.result_call_id)
		if(this.tracking_options.area.id== 4){
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
				this.operatorsService.getCloseReasonCall().subscribe((data:any)=>{
					this.tracking_options.area.tracking_close_reasons = data.data;
				},
				(error:any)=>{
					console.log(error)
				});
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
		this.tracking_customer.tracking_close_reason_id = this.tracking_customer.customer_tracking.tracking_close_reason_id;
    /* console.log(this.tracking_customer); */
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
		/* 	console.log(this.tracking_customer, new_call) */
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
          customer_tracking: {
            tracking_close_reason_id: this.tracking_customer.customer_tracking.tracking_close_reason_id,
            comment: this.tracking_customer.customer_tracking.coment
          }
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
>>>>>>> users_bootstrap
