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
	quotation =  new Quotation('','','','','','','','','',2,'','','','');
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
	modelLength = 0;
	versionLength=0;


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
		type: "nueva",
		birthdate: "",
		loaderModels: false,
		loaderVersions: false
		

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

			this.quote_info= {
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
			
		
		this.getQuotes();

		this.years_birth= this.quotationService.getYearsBirth();
	}

	getQuotes(){
		this.loader.show();
		if(!this.quote_info.to_date)
			this.quote_info.to_date = this.quote_info.from_date;
		if(this.quote_info.to_date<this.quote_info.from_date)
			this.quote_info.to_date = this.quote_info.from_date;
		console.log(this.quote_info);
		this.quotes = Array();
		this.quote_info.pages=1;
		this.quote_info.pagination = Array();
		
		localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
		
		this.operatorsService.getQuotes(this.quote_info)
		.subscribe((data:any)=>{
			console.log(data)
			this.quotes = data.quotes;
			this.quote_info.total = data.total_rows;
			this.quote_info.page  = data.current_page;
			this.quote_info.pages = data.pages;
			this.quote_info.pagination = this.paginationService.getPager(this.quote_info.pages,this.quote_info.page,10);
			this.loader.hide();
		});
	}

	searchQuote(){
		this.quote_info.page = 1;
		this.quote_info.seller_id =  "";
		this.quote_info.quote_state =  "pending";
		this.quote_info.payment_state = "";
		this.quote_info.seller_state =  "";
		this.quote_info.from_date = "";
		this.quote_info.to_date = "";

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
		this.quotationService.getModels(this.quotation.year,this.quotation.maker)
		.subscribe((data:any)=>{
			this.models = data;
		})
	}
}