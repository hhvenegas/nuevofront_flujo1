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

declare var $:any;
import swal from 'sweetalert';


@Component({
  selector: 'app-panelquotes',
  templateUrl: './panelquotes.component.html',
  styleUrls: ['./panelquotes.component.scss']
})
export class PanelquotesComponent implements OnInit {
	quotes: any = [];
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
	page: any = 1;
	pages:any = 1;
	pagination: any = [];
	filters:any= [""];
	seller_id:any;
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

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService) { }
	ngOnInit() {
		//MArcas
		this.quotationService.getMakers()
			.subscribe(makers => this.makers = makers)
		//Años
		this.quotationService.getYears()
			.subscribe(years => this.years = years)

		//Se traen los vendedores
		this.operatorsService.getSellers()
			.subscribe((data:any)=>{
				this.sellers = data;
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
		if($("#month_birth").val() < 10)
			birth_date = $("#year_birth").val()+"-0"+$("#month_birth").val()+"-"+$("#day_birth").val(); 
		else birth_date = $("#year_birth").val()+"-"+$("#month_birth").val()+"-"+$("#day_birth").val(); 
		
		if($("#year_birth").val()!="" && $("#month_birth").val()!="" && $("#day_birth").val()!=""){
			let dia =  $("#day_birth").val();
			let mes = $("#month_birth").val();
			let year = $("#year_birth").val();
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
		//this.setHubspot();
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

	sendEmailQuote(quote_id){
		this.operatorsService.sendEmailQuotes(quote_id)
			.subscribe((data:any)=>{
				console.log(data);
				swal("Se ha enviado el correo correctamente", "", "success");
			});
	}

	searchQuote(){
		this.quotes = Array();
		this.spinner.show();
		this.operatorsService.getQuotes(this.quote_info)
			.subscribe((data:any)=>{
				console.log(data)
				this.quotes = data.quotes;
				this.pages  = data.pages;
				this.pagination = this.paginationService.getPager(this.pages,this.page,5);
				this.spinner.hide();
			});
	}

	setPagination(page){
		this.page = page;
		this.quote_info.page = this.page;
		$('body,html').stop(true,true).animate({
            scrollTop: 0
        },1000);
		this.searchQuote();
	}

	setFilters(){
		let quote_state = Array();
		let payment_state = Array();;
		let seller_state = Array();
		
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
		});
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
		$("#modal3").modal("close");
		this.quotes.forEach(
			item => {
				console.log("Item:"+item.id+" ["+i+"]")
				if(item.id==this.delete_quote.quote_id){
					j = i;
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
				i++; 
			}
		);
	}

}
