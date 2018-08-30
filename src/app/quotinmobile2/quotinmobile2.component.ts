import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../services/quotation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../constants/maker';
import { Year } from '../constants/year';
import { Model } from '../constants/model';
import { Version } from '../constants/version';
import { Quotation } from '../constants/quotation';

//import * as M from "node_modules/materialize-css/dist/js/materialize.min.js";
import * as $ from 'jquery';
declare var M:any;

@Component({
  selector: 'app-quotinmobile2',
  templateUrl: './quotinmobile2.component.html',
  styleUrls: ['./quotinmobile2.component.scss']
})

export class Quotinmobile2Component implements OnInit {
	steps: number = 1;
	loaderModels: boolean = false;
	loaderVersions: boolean = false;
	car: string = "";
	zipcode: number = 2;

	makers: Maker[];
	years: Year[];
	models: Model[];
	versions: Version[];

	quotation =  new Quotation('','','','','','','','','',2,'','','','');

	date = new Date();
	maxDate = this.date.getFullYear()-25;
    minDate = this.date.getFullYear()-70;


	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
	ngOnInit() {
		this.getMakers();
		this.getYears();
		if (isPlatformBrowser(this.platformId)) {
			let elems = document.querySelectorAll('.carousel');
	    	let instances = M.Carousel.init(elems, {
			    fullWidth: true,
			    indicators: true
			});
		}

	}
	getMakers(): void {
	    this.quotationService.getMakers()
	    	.subscribe(makers => this.makers = makers)
	}
	getYears(): void {
		this.quotationService.getYears()
			.subscribe(years => this.years = years)
	}
	getModels():void {
		if(this.quotation.maker!="" && this.quotation.year!=""){
			this.quotation.model = "";
			this.quotation.version = "";
			this.models = null;
			this.versions = null;
			this.loaderModels = true;
			this.quotationService.getModels(this.quotation.year,this.quotation.maker)
				.subscribe(models => {this.models = models; this.loaderModels=false})
		}
	}
	getVersions():void{
		this.quotation.version = "";
		this.loaderVersions = true;
		this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
			.subscribe(versions => {this.versions = versions; this.loaderVersions = false})
	}
	getSisa():void{
		this.quotationService.getSisa(this.quotation.maker, this.quotation.year,this.quotation.version)
			.subscribe((sisa:string) => this.quotation.sisa = sisa)
	}

	setGender(gender){
		this.quotation.gender = gender;
	}
	selectMaker(id){
		this.quotation.maker = id;
		this.goTop();

	}
	goTop(){
		$('body,html').stop(true,true).animate({
            scrollTop: 0
        },1000);
	}
	validateZipcode(){
		this.quotationService.validateZipcode(this.quotation.zipcode)
			.subscribe((zipcode:any)=>{
				this.zipcode = zipcode.status;
			})
	}

	onSubmit(){
		this.quotation.maker_name   = $('select[id="maker"] option:selected').text();
		this.quotation.version_name = $('select[id="version"] option:selected').text();
		if(this.quotation.model != "" && this.quotation.version!="" && this.zipcode==1){
			this.steps=3;
			let quote;
			this.quotationService.sendQuotation(this.quotation)
			.subscribe((quote:any) => {
				 this.router.navigate(['/cotizaciones/'+quote.quote.id]);

			});
		}
	}

	onSubmit2(){
		if(this.zipcode==1){
			this.steps=3;
			let quote;
			this.quotationService.sendQuotation(this.quotation)
			.subscribe((quote:any) => {
				 this.router.navigate(['/cotizaciones/'+quote.quote.id]);

			});
		}
	}


}
