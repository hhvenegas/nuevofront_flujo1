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
	filters:any= [""];
	quotation_id:any;
	busqueda:any = "";
	quote_info: any = {
		page: 1,
		seller_id: "",
		quote_state: "pending",
		payment_state: "",
		seller_state: "",
		term: ""
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

	seller:any;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService) { }
	ngOnInit() {

		this.seller = this.loginService.getSession();
		console.log(this.seller)
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
				console.log(this.sellers);
			});
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
		

		this.spinner.show();
		
		this.operatorsService.requote(quotation)
			.subscribe((data:any)=>{
				console.log(data);
				if(data.result){
					let cotizaciones = "";
					data.quote.packages_costs.forEach(
						item => {
							cotizaciones+="Paquete "+item.package+": $"+item.cost_by_package+"\n";
						}
					);
					//this.setHubspot(data.quote.packages_costs[0].cost_by_km,cotizaciones);
					if(this.quotation_tipo=='nueva'){
						this.spinner.hide();
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
									this.operatorsService.deleteQuote(this.delete_quote.quote_id)
										.subscribe((data2:any)=>{
											console.log(data2);
											if(data2.result){
												this.quotes.unshift(data.quote);
												this.spinner.hide();
												
												swal("Se cotizó correctamente", "", "success");
												$('#modalCotizador').modal('hide')
											}
											else swal("No se pudo generar la cotización", "", "error");
										})
								}
								i++; 
							}
						);
					}

				}
				else{
					this.spinner.hide();
					swal("No se pudo generar la cotización", "", "error");
				}
			})
			
	}
	
	//ACCIONES
	changeSellerModal(quotation_id,seller_id){
		console.log("Vendedor Actual: "+seller_id);
		this.seller_id = seller_id;
		if(seller_id==null) this.seller_id = "";
		this.quotation_id = quotation_id;
	}
	changeSeller(){
		console.log("Vendedor Nuevo: "+this.seller_id+" / quote:"+this.quotation_id);
		let full_name="";
		let seller_id=this.seller_id;
		
		this.operatorsService.updateSellerQuotation(this.quotation_id,this.seller_id)
			.subscribe((data:any)=>{
				this.sellers.forEach(
					item => {
						if(item.id==this.seller_id){
							full_name = item.full_name;
							seller_id = item.id;
						} 
					}
				);
				console.log("Nombre: "+full_name);
				this.quotes.forEach(
					item => {
						if(item.id==this.quotation_id){
							item.seller.id = seller_id;
							item.seller.full_name = full_name;
							swal("Se ha cambiado al vendedor correctamente", "", "success");
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

	searchQuote(){
		this.quotes = Array();
		this.spinner.show();
		console.log(this.quote_info)
		this.operatorsService.getQuotes(this.quote_info)
			.subscribe((data:any)=>{
				console.log(data)
				this.quotes = data.quotes;
				this.pages  = data.pages;
				this.pagination = this.paginationService.getPager(this.pages,this.page,5);
				this.quotes.forEach(element => {
					element.pending_payments = null;
					this.operatorsService.getPendingPaymentsQuotes(element.id)
					.subscribe((data2:any)=>{
						if(data2.result && data2.data.length>0){
							element.pending_payments = data2.data;
						}
					})
				});
				this.spinner.hide();
			});
	}

	setPagination(page){
		this.page = page;
		this.quote_info.page = this.page;
		
		this.searchQuote();
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
		console.log(filtro)
		if(filtro!=""){
			if(filtro=='quote_states')
				quote_state.push(valor);
			if(filtro=='payment_states')
				payment_state.push(valor);
			if(filtro=='seller_states')
				seller_state.push(valor);
		}

		if(quote_state.length>1) this.quote_info.quote_state = "";
		else this.quote_info.quote_state = quote_state[0];
		if(payment_state.length>1) this.quote_info.payment_state = "";
		else this.quote_info.payment_state = payment_state[0];
		if(seller_state.length>1) this.quote_info.seller_state = "";
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
					      	this.operatorsService.deleteQuote(this.delete_quote.quote_id)
							.subscribe((data:any)=>{
								console.log(data);
								if(data.result){
									console.log("La cotizacion ha eliminar es la: "+this.delete_quote.quote_id)
									console.log("Index: "+j)
									if(this.quotes.splice(j, 1))
										swal("Se ha eliminado la cotización correctamente", "", "success");
								}
								else swal("No se pudo elimininar la cotización", "", "error");
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
		console.log("HUBSPOT")
		let hubspot = Array();
		let gender = "Hombre";

		if(this.quotation.gender==1) gender = "Mujer";
		let date = new Date(this.quotation.birth_date);
            
		hubspot.push(
			{
            	"property": "origen_cotizacion",
            	"value": "Nuevo flujo - seguro.sxkm.mx"
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

}