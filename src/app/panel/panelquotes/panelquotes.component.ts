import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
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
import * as $ from 'jquery';
declare var M:any;
import Swiper from 'swiper';
//import { Verify } from 'crypto';


@Component({
  selector: 'app-panelquotes',
  templateUrl: './panelquotes.component.html',
  styleUrls: ['./panelquotes.component.scss']
})
export class PanelquotesComponent implements OnInit {
  	session:any;
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService) { }
	quotes: any = [];
	quotation =  new Quotation('','','','','','','','','',2,'','','','');
	quotation2 = new Quotation2(null,null);
	sellers: Seller[];
	page:any = 1;
	ngOnInit() {
		this.operatorsService.prueba()
			.subscribe((data:any)=>{
				console.log(data)
			})


		//Se traen los vendedores
		this.operatorsService.getSellers()
			.subscribe((data:any)=>{
				this.sellers = data;
				console.log(this.sellers);
			});
		//Se traen las cotizaciones 
		this.operatorsService.getQuotes(this.page)
			.subscribe((data:any)=>{
				this.quotes = data.quotes;
				console.log(data);
			});
	}
	ordenar(param,orden){
		if(param=='id' && orden=='ASC') this.quotes.sort(function(a, b){return a.id - b.id});
		if(param=='id' && orden=='DESC') this.quotes.sort(function(a, b){return b.id - a.id});
	}
	setQuotation(quote){
		console.log(quote);
		this.quotation2.user = {
			phone: quote.user.phone,
			age: quote.user.age,
			gender: quote.user.gender,
			birth_date: quote.user.birth_date,
			zip_code: quote.user.zip_code,
			first_name: quote.user.first_name,
			last_name: quote.user.last_name,
			second_last_name: quote.user.second_last_name,
			email: quote.user.email
		}
		this.quotation2.car = {
			maker: quote.car.maker,
			year: quote.car.year,
			model: quote.car.model,
			version_id: quote.car.version_id,
			id: quote.car.id
		}
	}
	sendEmailQuote(quote_id){
		this.operatorsService.sendEmailQuotes(quote_id)
			.subscribe((data:any)=>{
				console.log(data);
			});
	}

}
