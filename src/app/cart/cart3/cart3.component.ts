import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { CartService } from '../../services/cart.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Policy } from '../../constants/policy';
import { Aig } from '../../constants/aig';
import { Store } from '../../constants/store';

declare var OpenPay: any;
//import * as $ from 'jquery';
declare var $ : any;

import swal from 'sweetalert';

@Component({
  selector: 'app-cart',
  templateUrl: './cart3.component.html',
  styleUrls: ['./cart3.component.scss']
})
export class Cart3Component implements OnInit {
	msi:boolean =  false;
	checkbox_factura: boolean = false;
	checkbox_suscription: boolean = false;
	checkbox_terminos: boolean = false;
	checkbox_dir: boolean = false;
	quote_id:any;
	package_id:any=1;
	package: any = null;
	packages:any = null;
	total_cost: any = null;
	discount: any = 0;
	cupon: any = "";
	error_cupon: any = "";
	onlycard: boolean = false;
	suscription: boolean = false;
	quotation:any; 
	zipcodeBoolean: boolean = true;
	pago: string = "tarjeta";
	pagoBoolean: boolean = false;
	suburbs3: any = Array();
	aig: Aig = null;
	stores: Store[];
	store:any="";
	error_store: string ="";
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false,false,'','');

	card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
	}
	card_id: any = "";
	kilometer_purchase:any = {
		initial_payment: 299,
		cost: 0,
		total: 299,
		kilometers: 250
	};
	isPromotional: boolean = false;

	landing:any;
	sbs:number = 1;
	suscription_sbs:number;
	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private cartService: CartService,private hubspotService: HubspotService, private operatorsService: OperatorsService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];

		if(this.package_id==5){
			this.msi = true;
		}
		if (isPlatformBrowser(this.platformId)) {
			if(!localStorage.getItem("cart")){
				this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id]);
			}
			this.policy = JSON.parse(localStorage.getItem("cart"));
			if(this.policy.promotional_code)
				this.isPromotional = true;
		}
		this.getQuotation();
		this.getStores();
		this.landing = localStorage.getItem("landing")
		if(this.landing == "sbs"){
			this.sbs = 164.10;
			this.suscription_sbs = 299 * 164.10
		}
	}
	getQuotation(){
		this.operatorsService.getQuote(this.quote_id)
	    	.subscribe((data:any) => {
				console.log(data)
	    		this.quotation=data.quote;
	    		this.aig = data.quote.car;
	    		this.packages 	= data.quote.packages_costs;
	    		this.getPackage();
	    	});
	}
	getPackage(){
		this.quotationService.getPackage(this.package_id)
	    	.subscribe((data:any) => {
	    		this.packages.forEach( item => {
	    			if(item.package==data.kilometers){
	    				this.package = item;
						this.total_cost = item.total_cost;
						console.log(item);
						this.kilometer_purchase = {
							initial_payment: 299,
							cost: item.cost_by_package,
							total: item.total_cost,
							kilometers: item.package
						}

	    				if(this.quotation.promotional_code){
			    			this.searchCupon2(this.quotation.promo_code);
			    		}
	    			}
          		});
          		console.log(this.package)
	    	});
	}
	changeDir(){
		if(this.checkbox_dir){
			this.checkbox_dir = false;
			this.policy.street3 	= "";
			this.policy.ext_number3 = "";
			this.policy.int_number3 = "";
			this.policy.zipcode3 	= "";
			this.policy.suburb3 	= "";
		}
		else{ 
			this.checkbox_dir = true;
		}
	}
	changeSuscription(){
		console.log("SUSCRIPCION")
		if(this.checkbox_suscription) this.checkbox_suscription = false;
		else this.checkbox_suscription = true;
	}
	changeTerminos(){
		if(this.checkbox_terminos) this.checkbox_terminos = false;
		else this.checkbox_terminos = true;
	}
	changeFactura(){
		console.log("Factura")
		this.policy.street3     = "";
		this.policy.zipcode3    = "";
		this.policy.ext_number3 = "";
		this.policy.int_number3 = "";
		this.policy.suburb3     = "";
		this.policy.rfc			= "";
		this.policy.razon_social= "";
		if(this.checkbox_factura) this.checkbox_factura = false;
		else this.checkbox_factura = true;
	}
	validateZipcode(){
		this.quotationService.validateZipcode(this.policy.zipcode3)
	    	.subscribe((data:any) => {
	    		if(data.status==1){
	    			this.getSuburbs(this.policy.zipcode3);
	    			this.zipcodeBoolean = true;
	    		}
	    		else this.zipcodeBoolean = false;
	    	});
	}
	getSuburbs(zipcode){
		this.quotationService.getSububrs(zipcode)
	    	.subscribe((data:any) => {
	    		console.log(data);
	    		this.suburbs3 = data;
	    		this.policy.suburb3= "";
	    		this.policy.state3 = data[0].state;
	    		this.policy.city3  = data[0].municipality;
	    		
	    	});
	}
	changePayment(payment){
		this.pago = payment;
		this.policy.store = "";
		this.error_store = "";
	}
	getStores(): void {
	    this.cartService.getStores()
	    	.subscribe(stores => this.stores = stores)
	}
	setStore(store,url){
		this.policy.store = store;
		this.store = url;
		if(store=='Oxxo')
			this.policy.payment_method = "oxxo";
		else this.policy.payment_method = "open_pay";
	}
	onSubmit(){
		let active = true;
		this.policy.total_amount = this.total_cost.toFixed(2);
		this.policy.deviceIdHiddenFieldName = "";
		this.policy.token_id = "";
		this.policy.factura = this.checkbox_factura;
		this.policy.subscription = this.checkbox_suscription;
		if(this.pago=='tarjeta'){
			this.policy.payment_method = "credit_card";
		}
		if(this.pago=='spei'){
			this.policy.payment_method = "spei";
		}

    	localStorage.setItem("cart",JSON.stringify(this.policy));
    	this.cartService.setPolicy(this.policy);
    	//console.log(this.policy);
		if(this.pago=='tarjeta'){
			this.paymentCard();
		}
		if(this.pago=='efectivo'){
			if(this.policy.store==''){
				active = false;
				this.error_store = "Selecciona una tienda";
				$('body,html').stop(true,true).animate({
		            scrollTop: 0
		        },1000);
			}
			else this.error_store = '';
		}

		if(active && this.pago!='tarjeta'){
			this.sendForm();
		}
	}

	
	sendForm(){
		let payment = {
			promotional_code: this.policy.promotional_code,
			card_id: this.card_id,
			device_session_id: this.policy.deviceIdHiddenFieldName,
			paymethod: this.policy.payment_method,
			subscription: this.policy.subscription,
			invoicing: this.policy.factura,
			kilometer_purchase: this.kilometer_purchase,
			car: {
				motor_number: "",
				vin: "",
				plates: this.policy.plates
			},        
			shipping:  {
				street: this.policy.street2,
				ext_number: this.policy.ext_number2,
				int_number: this.policy.int_number2,
				suburb: this.policy.suburb2,
				municipality: this.policy.city2,
	 			zip_code: this.policy.zipcode2,
				federal_entity: this.policy.state2
			},
			billing: {
				zip_code: this.policy.zipcode3,
				legal_name: this.policy.razon_social,
				rfc: this.policy.rfc
			},
			policy: {
				first_name: this.policy.first_name,
				last_name: this.policy.last_name_one,
				second_last_name: this.policy.last_name_two,
				cellphone: this.policy.cellphone,
				phone: this.policy.cellphone,
				street: this.policy.street1,
				ext_number: this.policy.ext_number1,
				int_number: this.policy.int_number1,
				suburb: this.policy.suburb1,
				municipality: this.policy.city1,
				zip_code: this.policy.zipcode1,
				federal_entity: this.policy.state1
			},
			msi: this.policy.msi
		}
		console.log(payment);
		
		this.operatorsService.pay_quote(this.quote_id,payment)
		.subscribe((data:any)=>{
			console.log(data)
			if(data.result){
				this.validateAccessToken();
				localStorage.removeItem("cart");
				
				if(this.pago!="efectivo")
					this.router.navigate(['ficha/'+this.pago+'/'+this.quote_id+'/'+data.data.id]);
				else this.router.navigate(['ficha/'+this.pago+'/'+this.store+'/'+this.quote_id+'/'+data.data.id]);

			}
			else{
				this.router.navigate(['error/'+this.quote_id+'/'+this.package_id]);
			}
		});
		this.router.navigate(['comprando']);
		

	}


	/**** Openpay ****/
	paymentCard(){
		let openpay = this.cartService.keysOpenpay();
		let angular_this = this;
	
		OpenPay.setId(openpay.id);
		OpenPay.setApiKey(openpay.apikey);
		OpenPay.setSandboxMode(openpay.sandbox);
	
		this.policy.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
	
		
		let sucess_callback = function (response){
			let card = {
			  user_id: angular_this.quotation.user.id,
			  token: response.data.id,
			  device_session_id: angular_this.policy.deviceIdHiddenFieldName 
			}
			angular_this.operatorsService.createCard(card)
			.subscribe((data:any)=>{
			  console.log(data);
			  if(data.result){
				angular_this.card_id = data.card.id;
				angular_this.sendForm();
			  }
			  else{
				angular_this.router.navigate(['error/'+this.quote_id+'/'+this.package_id]);
			  }
			});
			angular_this.router.navigate(['comprando']);
		}
		let errorCallback = function (response){
			angular_this.router.navigate(['error/'+this.quote_id+'/'+this.package_id]);
		}
		if(this.card_id==""){
			
		  OpenPay.token.create({
			  "card_number"    : angular_this.card.card_number,
			  "holder_name"    : angular_this.card.holder_name,
			  "expiration_year"  : angular_this.card.expiration_year,
			  "expiration_month"  : angular_this.card.expiration_month,
			  "cvv2"        : angular_this.card.cvv2
		  },sucess_callback, errorCallback);
		}
		else{
		  this.sendForm();
		}
	  }

    searchCupon(){
		console.log("Cupon: "+this.cupon);
		let valid = true;
		this.discount = 0;
		this.total_cost = this.package.total_cost;
		this.onlycard = false;
		this.policy.promotional_code = "";
		if(this.cupon!=""){
			this.quotationService.searchCupon(this.cupon)
	    	.subscribe((data:any) => {
	    		console.log(data);
	    		if(data.status=="active"){
	    			if(!data.promotion.only_seller){
			            if(data.referenced_email){
			              if(data.referenced_email!=this.policy.email){
			              	valid=false;
			              }
			            }
			            if(data.promotion.need_kilometer_package){
			              	if(data.promotion.kilometers!=this.package.package){
			                	valid=false;
			              	}
			            }
			            if(data.promotion.subscribable){
			            	this.suscription = true;
			            }
			            if(data.for_card){
			            	this.onlycard = true;
			            	if(data.promotion.card_type){
			                	console.log("solo card_Type")
			              	}
			              	if(data.promotion.card_brand){
			              		console.log("solo brand")
			              	}
			            }
					}
					else valid = false;
	    		}
	    		else valid = false;


	    		///
	    		if(valid){
	    			console.log("si aplica");
	    			this.onlycard = true;
	    			data.promotion.apply_to.forEach( item => {
			            if(item=='MonthlyPayment')
			            	this.discount+= (299*(data.promotion.discount/100));
			            if(item=="KilometerPurchase")
			            	this.discount+=(this.package.cost_by_package*(data.promotion.discount/100));
			        });
			        this.total_cost = this.package.total_cost - this.discount;
					this.policy.promotional_code = this.cupon;
					swal("Cupón válido","","success");
	    		}
	    		else {
	    			this.cupon = "";
	    			this.policy.promotional_code = this.cupon;
	    			swal("El código de promoción es inválido","Prueba con otro cupón","error");
	    			console.log("no aplica");
	    		}
	    		if(this.onlycard){
	    			this.changePayment('tarjeta');
	    		}
	    	});
		}
	}
	searchCupon2(cupon){
		console.log("Cupon de referencia: "+cupon);
		let valid = true;
		this.discount = 0;
		this.total_cost = this.package.total_cost;
		this.onlycard = false;
		this.policy.promotional_code = "";
		if(cupon!=""){
			this.quotationService.searchCupon(cupon)
	    	.subscribe((data:any) => {
	    		console.log(data);
	    		if(data.status=="active"){
	    			if(!data.promotion.only_seller){
			            if(data.referenced_email){
			              if(data.referenced_email!=this.policy.email){
			              	valid=false;
			              }
			            }
			            if(data.promotion.need_kilometer_package){
			              	if(data.promotion.kilometers!=this.package.package){
			                	valid=false;
			              	}
			            }
			            if(data.promotion.subscribable){
			            	this.suscription = true;
			            }
			            if(data.for_card){
			            	this.onlycard = true;
			            	if(data.promotion.card_type){
			                	console.log("solo card_Type")
			              	}
			              	if(data.promotion.card_brand){
			              		console.log("solo brand")
			              	}
			            }
			        }
	    		}
	    		else valid = false;


	    		///
	    		if(valid){
	    			console.log("si aplica");
	    			this.onlycard = true;
	    			data.promotion.apply_to.forEach( item => {
			            if(item=='MonthlyPayment')
			            	this.discount+= (299*(data.promotion.discount/100));
			            if(item=="KilometerPurchase")
			            	this.discount+=(this.package.cost_by_package*(data.promotion.discount/100));
			        });
			        this.total_cost = this.package.total_cost - this.discount;
			        this.policy.promotional_code = cupon;
	    		}
	    		else {
	    			cupon = "";
	    			this.policy.promotional_code = cupon;
	    			console.log("no aplica");
	    		}
	    		if(this.onlycard){
	    			this.changePayment('tarjeta');
	    		}
	    	});
		}
	}

	validateAccessToken(){
		this.hubspotService.validateToken(localStorage.getItem("access_token"))
        	.subscribe((data:any) =>{ 
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
		this.hubspotService.getContactByEmail(this.quotation.email,localStorage.getItem("access_token"))
        	.subscribe((data:any) =>{ 
        		console.log(data.vid);
        		localStorage.setItem("vid",data.vid);
        		this.setHubspot();
        	})

	}
	setMSI(msi){
		this.policy.msi=msi;
	}
	setHubspot(){
		let hubspot = Array();
		hubspot.push(
			{"property": 'checkbox_factura', 'value':this.checkbox_factura},
			{"property": 'checkbox_suscripcion', 'value':this.checkbox_suscription},
			{"property": 'forma_pago', 'value':this.pago},
			{"property": 'store_payment', 'value':this.store},
			{"property": 'kilometros_paquete', 'value':this.package.package},
			{"property": 'acepta_terminos', 'value':this.checkbox_terminos},
			{"property":'total', 'value': this.total_cost}
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

}
