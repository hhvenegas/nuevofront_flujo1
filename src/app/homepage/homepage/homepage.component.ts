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
	modelLength = 0;
	versionLength=0;
	birth_date: any = '';
	error_date: any = "";
	years_birth:any = Array();


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

	        if(this.router.url!="/"){
		      let url_string = this.router.url.split("?");
		      let params = url_string[1].split("&");
		      params.forEach( item => {
		        let param = item.split("=");
		      	if(param[0]=='promo_code')
		      		this.quotation.promo_code = param[1];
		      	if(param[0]=='referred_code')
		      		this.quotation.referred_code = param[1];  
		      });
		    }
	    }
	    this.setBirthCalendar();
	}

	setBirthCalendar(){
		//Calendario de fecha de nacimiento
		let date = new Date();
 	   	let maxDate = date.getFullYear()-20;
    	let minDate = date.getFullYear()-70;

    	for(let i = minDate; i<=maxDate;i++){
    		console
    		this.years_birth.push(i);
    	}

	}
	//Acciones en el sitio
	cambiar(active){
		this.active = active;
	}
	showAll(){
		$("#id-collapse").show();

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
	setBirthDate2(){
		let birth_date = "";
		if($("#month_birth_mobile").val() < 10)
			birth_date = $("#year_birth").val()+"-0"+$("#month_birth_mobile").val()+"-"+$("#day_birth_mobile").val(); 
		else birth_date = $("#year_birth_mobile").val()+"-"+$("#month_birth_mobile").val()+"-"+$("#day_birth_mobile").val(); 
		
		if($("#year_birth_mobile").val()!="" && $("#month_birth_mobile").val()!="" && $("#day_birth_mobile").val()!=""){
			let dia =  $("#day_birth_mobile").val();
			let mes = $("#month_birth_mobile").val();
			let year = $("#year_birth_mobile").val();
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
				if(this.zipcode==0) this.quotation.zipcode = "";
			})
	}

	setVersionName(tipo){
		if( tipo == 1){
			this.quotation.version_name = $('select[id="version"] option:selected').text();
		}
		else this.quotation.version_name = $('select[id="version_mobile"] option:selected').text();
		console.log("Version:"+this.quotation.version_name);
	}
	onSubmit(){
		//this.quotation.maker_name   = $('select[id="maker"] option:selected').text();
		this.quotation.maker_name = this.quotation.maker;

		console.log(this.quotation);
		if(this.quotation.model != "" && this.quotation.version!="" && this.zipcode==1 && this.quotation.birth_date!=""){
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
