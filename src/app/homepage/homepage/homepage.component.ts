import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { ValidatorsService } from '../../services/validators.service';
import { OperatorsService } from '../../services/operators.service';
import { MarketingService } from '../../services/marketing.service';
import { HubspotService } from '../../services/hubspot.service';
import { Router,ActivatedRoute, NavigationStart } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';

import * as $ from 'jquery';
import Swiper from 'swiper';
import swal from 'sweetalert';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
	steps: any =1;
	loaderModels: boolean = false;
	loaderVersions: boolean = false;
	//car: string = "";
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
	birthdate: any = {
		day: "",
		month: "",
		year: ""
	}
	error_date: any = "";
	years_birth:any = Array();
	dispositivo:any = 'desktop';
	landing: any = '';
	loading: any = false;

	quotation =  new Quotation('','','','','','','','','','',2,'','','','');

	marketing = {
		utm_source: "",
		utm_medium: "",
		utm_campaign: "",
		utm_term: "",
		utm_content: "",
		fbclid: "",
		gclid:""

	}
	cellphone_validator = true;
	cellphone_focus = "cellphone";
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService, private marketingService: MarketingService, private validatorsService: ValidatorsService) { }
	ngOnInit() {
		this.getMakers();
		this.getYears();

		let swiper = new Swiper('.swiper-container', {
		    navigation: {
		        nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		    },
		});


		 if (isPlatformBrowser(this.platformId)) {
	        if(this.router.url!="/"){
			    if(this.router.url.indexOf("?") != -1){
			      	let url_string = this.router.url.split("?");
			      	let params = url_string[1].split("&");
				    params.forEach( item => {
				        let param = item.split("=");
				      	if(param[0]=='promo_code')
				      		this.quotation.promo_code = param[1];
				      	if(param[0]=='referred_code')
							this.quotation.referred_code = param[1];
						if(param[0]=='utm_source')
							this.marketing.utm_source = param[1];
						if(param[0]=='utm_medium')
							this.marketing.utm_medium = param[1];
						if(param[0]=='utm_campaign')
							this.marketing.utm_campaign = param[1];
						if(param[0]=='utm_term')
							this.marketing.utm_term = param[1];
						if(param[0]=='utm_content')
							this.marketing.utm_content = param[1];
						if(param[0]=='fbclid')
							this.marketing.fbclid = param[1];
						if(param[0]=='gclid')
							this.marketing.gclid = param[1];
					});
					console.log("Marketing")
					console.log(this.marketing)
				}

				this.createReference();
		    }

		    this.landing = localStorage.getItem("landing");
		    console.log("Landing"+localStorage.getItem("landing"));

	    }
	    this.setBirthCalendar();
	}

	createReference(){
		this.marketingService.create_reference(this.marketing)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.result){
				localStorage.setItem("reference_id",data.reference_id);
			}
		})

	}
	updateReference(quote_id){
		let data = {
			visit_reference_id: localStorage.getItem("reference_id"),
			policy_id: quote_id
		}
		this.marketingService.update_reference(data)
		.subscribe((data:any)=>{
			console.log(data);
		})
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
		if(this.birthdate.month < 10)
			birth_date = this.birthdate.year+"-0"+this.birthdate.month+"-"+this.birthdate.day;
		else birth_date = this.birthdate.year+"-"+this.birthdate.month+"-"+this.birthdate.day;

		if(this.birthdate.year!="" && this.birthdate.month!="" && this.birthdate.day){
			let dia =  this.birthdate.day;
			let mes = this.birthdate.month;
			let year = this.birthdate.year;
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
	    this.quotationService.getMakersWS()
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


		this.makers.forEach(element => {
			if(element.id==this.quotation.maker)
				this.quotation.maker_name = element.name;
		});
		//this.quotation.maker_name   = $('select[id="maker"] option:selected').text();
		//this.quotation.maker_name = this.quotation.maker;

		console.log(this.quotation);
		this.setHubspot();
		if(!this.cellphone_validator)
			$("#"+this.cellphone_focus).focus();

		if(this.quotation.model != "" && this.quotation.version!="" && this.zipcode==1 && this.quotation.birth_date!="" && this.cellphone_validator){
			this.steps=3;
			let age = this.quotationService.getAge(this.birthdate.year);
			let quotation = {
				user: {
					phone: this.quotation.cellphone,
					age: age,
					gender: this.quotation.gender,
					birth_date: this.quotation.birth_date,
					zip_code: this.quotation.zipcode,
					first_name: null,
					last_name: null,
					second_last_name: null,
					email: this.quotation.email
				},
				car: {
					maker: this.quotation.maker_name,
					year: this.quotation.year,
					model: this.quotation.version_name,
					version_id: ""+this.quotation.sisa
				},
				promo_code: this.quotation.promo_code,
				referred_code: this.quotation.referred_code,
        utm: this.marketing.utm_source,
			};
			console.log(quotation);

			this.loading = true;
			this.operatorsService.requote(quotation)
			.subscribe((data:any)=>{
				console.log(data);
				if(data.result){
					this.updateReference(data.quote.id);
					this.router.navigate(['/cotizaciones/'+data.quote.token]);
				}
				else{
					this.loading = false;
					swal("No se pudo realizar la cotización","Inténtalo nuevamente","error");
				}
			})

		}
	}

	setHubspot(){
		let hubspot = Array();
		let gender = "Hombre";

		if(this.quotation.gender==1) gender = "Mujer";
		let date = new Date(this.quotation.birth_date);

		hubspot.push(
			{
            	"property": "origen_cotizacion",
            	"value": "Nuevo flujo - www.sxkm.mx"
          	},
          	{
            	"property": "dispositivo",
            	"value": this.dispositivo
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

	changeCellphone(type){
		if(type==2){
			this.cellphone_focus="cellphone_mobile";
		}
		this.cellphone_validator = this.validatorsService.validateCellphone(this.quotation.cellphone);
	}


}
