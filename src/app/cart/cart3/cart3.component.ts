import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
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
import * as $ from 'jquery';
declare var M:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart3.component.html',
  styleUrls: ['./cart3.component.scss']
})
export class Cart3Component implements OnInit {
	checkbox_factura: boolean = false;
	checkbox_suscription: boolean = false;
	checkbox_terminos: boolean = false;
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
	error_store: string ="";
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');

	card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
	}
	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private cartService: CartService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];
		if (isPlatformBrowser(this.platformId)) {
			if(!localStorage.getItem("cart")){
				this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id]);
			}
			this.policy = JSON.parse(localStorage.getItem("cart"));
		}
		this.getQuotation();
		this.getStores();
	}
	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		this.quotation	= data.quote;
	    		this.aig 		= data.aig;
	    		this.packages 	= data.cotizaciones;
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
	    				if(this.quotation.promotional_code!=""){
			    			this.searchCupon2(this.quotation.promo_code);
			    		}
	    			}
          		});
          		console.log(this.package)
	    	});
	}
	changeDir(){
		if(this.checkbox_factura){
			this.checkbox_factura = false;
			this.policy.street3 	= "";
			this.policy.ext_number3 = "";
			this.policy.int_number3 = "";
			this.policy.zipcode3 	= "";
			this.policy.suburb3 	= "";
		}
		else{ 
			this.checkbox_factura = true;
		}
	}
	changeSuscription(){
		if(this.checkbox_suscription) this.checkbox_suscription = false;
		else this.checkbox_suscription = true;
	}
	changeTerminos(){
		if(this.checkbox_terminos) this.checkbox_terminos = false;
		else this.checkbox_terminos = true;
	}
	changeFactura(){
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
	setStore(store){
		this.policy.store = store;
	}
	onSubmit(){
		this.policy.deviceIdHiddenFieldName = "";
		this.policy.token_id = "";
    	localStorage.setItem("cart",JSON.stringify(this.policy));
    	this.cartService.setPolicy(this.policy);
    	//console.log(this.policy);
		if(this.pago=='tarjeta'){
			this.paymentCard(this.card);
		}
		if(this.pago=='efectivo'){
			if(this.policy.store==''){
				this.error_store = "Selecciona una tienda";
				$('body,html').stop(true,true).animate({
		            scrollTop: 0
		        },1000);
			}
			else this.error_store = '';
		}
		this.sendForm();
		//this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id+'/3']);
	}

	
	sendForm(){
		$("input").trigger("select");

		console.log(this.policy);
		//this.cartService.sendPolicy(this.policy)
		//	.subscribe((policy:any) => {
		//		 console.log(policy)
		//	});

	}


	/**** Openpay ****/
	paymentCard(card){
		let openpay:any;
		if(this.cartService.modeProd) openpay = this.cartService.openpay_prod;
		else openpay = this.cartService.openpay_sandbox;
		
		OpenPay.setId(openpay.id);
    	OpenPay.setApiKey(openpay.apikey);
    	OpenPay.setSandboxMode(openpay.sandbox);

		this.policy.deviceIdHiddenFieldName = OpenPay.deviceData.setup();

		let angular_this = this;
		let sucess_callback = function (response){
		    angular_this.policy.token_id = response.data.id;
		    angular_this.sendForm();
		    
		}
		OpenPay.token.create({
	    	"card_number"		: card.card_number,
	      	"holder_name"		: card.holder_name,
	      	"expiration_year"	: card.expiration_year,
	      	"expiration_month"	: card.expiration_month,
	      	"cvv2"				: card.cvv2
	    },sucess_callback, this.errorCallback);
	}
    errorCallback(){
    	localStorage.removeItem("token");
    	localStorage.removeItem("deviceIdHiddenFieldName");
    	console.log("ERROR card");
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
	    		}
	    		else {
	    			this.cupon = "";
	    			this.policy.promotional_code = this.cupon;
	    			M.toast({html: 'El código es inválido'})
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

}
