import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';

//import * as M from "node_modules/materialize-css/dist/js/materialize.min.js";
import * as $ from 'jquery';
declare var M:any;
import Swiper from 'swiper';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
	steps: any =1;
	loaderModels: boolean = false;
	loaderVersions: boolean = false;
	car: string = "";
	zipcode: number = 2;
	active = 1;
	mobile = false;

	makers: Maker[];
	years: Year[];
	models: Model[];
	versions: Version[];
	model = false;
	version = false;
	birth_date: any = '';

	quotation =  new Quotation('','','','','','','','','',2,'','','','');

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
	ngOnInit() {
		this.getMakers();
		this.getYears();
		let swiper = new Swiper('.swiper-container', {
		    slidesPerView: 1,
		    loop: true,
			pagination: {
			   	el: '.swiper-pagination',
			    clickable: true,
			},
		});
		if (isPlatformBrowser(this.platformId)) {
			
		}
	}
	//Acciones en el sitio
	cambiar(active){
		this.active = active;
	}
	showAll(){
		$("#id-collapse").show();

	}
	setBirthdate(id){
		if(id==1){
			this.birth_date = $("#birth_date").val();
			$("#birth_date_mobile").val(this.birth_date);
		}
		if(id==2){
			this.birth_date = $("#birth_date_mobile").val();
			$("#birth_date").val(this.birth_date);
		}
		this.quotation.birth_date = this.birth_date;
		console.log(this.quotation.birth_date);
	}

	//Cotizador GETS
	getMakers(): void {
	    this.quotationService.getMakers()
	    	.subscribe(makers => this.makers = makers)
	}
	getYears(): void {
		this.quotationService.getYears()
			.subscribe(years => this.years = years)
	}
	getModels():void {
		this.model = false;
		this.version = false;
		if(this.quotation.maker!="" && this.quotation.year!=""){
			this.quotation.model = "";
			this.quotation.version = "";
			this.models = null;
			this.versions = null;
			this.loaderModels = true;
			this.quotationService.getModels(this.quotation.year,this.quotation.maker)
				.subscribe(models => {
					this.models = models; 
					this.loaderModels=false;
					if(this.models.length>0)
						this.model = true;
				})
		}
	}
	getVersions():void{
		this.quotation.version = "";
		this.loaderVersions = true;
		this.version = false;
		this.quotationService.getVersions(this.quotation.maker,this.quotation.year,this.quotation.model)
			.subscribe(versions => {
				this.versions = versions; 
				this.loaderVersions = false
				if(this.versions.length>0)
						this.version = true;
			})
	}
	getSisa():void{
		this.quotationService.getSisa(this.quotation.maker, this.quotation.year,this.quotation.version)
			.subscribe((sisa:string) => this.quotation.sisa = sisa)
	}

	setGender(gender){
		this.quotation.gender = gender;
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
		//this.quotation.maker_name   = $('select[id="maker"] option:selected').text();
		this.quotation.maker_name = this.quotation.maker;
		this.quotation.version_name = $('select[id="version"] option:selected').text();
		if(this.quotation.model != "" && this.quotation.version!="" && this.zipcode==1){
			this.steps=3;
			let quote;
			this.quotationService.sendQuotation(this.quotation)
			.subscribe((quote:any) => {
				this.router.navigate(['/cotizaciones/'+quote.quote.id]);
			});
			this.router.navigate(['/cotizando']);
		}
	}


}
