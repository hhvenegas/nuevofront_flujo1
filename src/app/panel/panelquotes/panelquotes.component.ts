import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Quotation2 } from '../../constants/quotation2';
import { Seller } from '../../constants/seller';

//import * as M from "node_modules/materialize-css/dist/js/materialize.min.js";
//import * as $ from 'jquery';
declare var $:any;
declare var M:any;
import Swiper from 'swiper';
import swal from 'sweetalert';
import { Quote } from '@angular/compiler';
import { element } from 'protractor';


@Component({
  selector: 'app-panelquotes',
  templateUrl: './panelquotes.component.html',
  styleUrls: ['./panelquotes.component.scss']
})
export class PanelquotesComponent implements OnInit {
	quotes: any = [];
	quotation =  new Quotation('','','','','','','','','',2,'','','','');
	quotation2 = new Quotation2(null,null);
	makers: Maker[];
	years: Year[];
	models: Model[];
	versions: Version[];
	modelLength = 0;
	versionLength=0;
	birth_date: any = '';
	error_date: any = "";
	years_birth:any = Array();
	loaderModels: boolean = false;
	loaderVersions: boolean = false;




	sellers: Seller[];
	page: any = 1;
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

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService) { }
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
	}
	ordenar(param,orden){
		if(param=='id' && orden=='ASC') this.quotes.sort(function(a, b){return a.id - b.id});
		if(param=='id' && orden=='DESC') this.quotes.sort(function(a, b){return b.id - a.id});
	}
	setQuotation(quote){
		console.log(quote);
		this.quotation = {
			maker: quote.car.maker,
			maker_name: quote.car.maker,
			year: quote.car.year,
			model: quote.car.model,
			version: quote.car.version_id,
			version_name: quote.car.version,
			sisa: quote.car.sisa,
			email: quote.user.email,
			cellphone: quote.user.cellphone,
			gender: quote.user.gender,
			zipcode: quote.user.zip_code,
			birth_date: quote.user.birth_date,
			referred_code: "",
			promo_code: ""

		}
		this.quotationService.getModels(this.quotation.year,this.quotation.maker)
			.subscribe(models => {
				console.log(models)
				this.models = models;
				
			})
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
		this.spinner.show();
		this.operatorsService.getQuotes(this.quote_info)
			.subscribe((data:any)=>{
				this.quotes = data.quotes;
				this.spinner.hide();
			});
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
