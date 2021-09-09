import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
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
import { Policy } from '../../constants/policy';
import { Aig } from '../../constants/aig';

@Component({
  selector: 'app-cart',
  templateUrl: './cart1.component.html',
  styleUrls: ['./cart1.component.scss']
})
export class Cart1Component implements OnInit {

	quote_id:any;
	package_id:any=1;
	package: any = null;
	packages:any = null;
	total_cost: any = null;
	quotation:any;
	aig: Aig = null;
	suburbs1:any = Array();
	isPromotional: boolean = false;
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false,false,'','','');
  payform: any = 'monthly';

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService,private hubspotService: HubspotService, private operatorsService: OperatorsService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];
		this.getQuotation();
		if (isPlatformBrowser(this.platformId)) {
			//localStorage.removeItem("cart")
			if(localStorage.getItem("cart")){
				this.policy = JSON.parse(localStorage.getItem("cart"));
			}

		}
	}
	getQuotation(){
		this.operatorsService.getQuoteByToken(this.quote_id)
	    	.subscribe((data:any) => {
				console.log(data)
	    		this.quotation=data.quote;
	    		this.aig = data.quote.car;
	    		this.packages 	= data.quote.packages_costs;
	    		this.getPackage();
	    		this.initCart();
	    	});
	}
	initCart(){
		this.policy.quote_id				= this.quotation.id;
		this.policy.cellphone 				= this.quotation.user.phone;
		this.policy.email      				= this.quotation.user.email;
		this.policy.kilometers_package_id 	= this.package_id;
		this.policy.promotional_code 		= this.quotation.promo_code;
		this.policy.zipcode1				= this.quotation.user.zip_code;
    this.policy.paytype = 'monthly'
		if(this.policy.promotional_code ) this.isPromotional=true;
		console.log(this.policy)
		this.getZipcode(this.quotation.user.zip_code);
	}
	getPackage(){
		this.quotationService.getPackage(this.package_id)
	    	.subscribe((data:any) => {
	    		this.packages.forEach( item => {
	    			if(item.package==data.kilometers){
	    				this.package = item;
	    				this.total_cost = item.total_cost;
	    			}
          		});
	    	});
	}
	getZipcode(zipcode){
		this.quotationService.getSububrs(zipcode)
		.subscribe((data:any)=>{
			console.log(data);
			this.policy.city1 = data[0].municipality;
	    	this.policy.state1 = data[0].state;
	    	this.getSuburbs(this.policy.zipcode1);


		});
		/*
		this.quotationService.getZipcode(zipcode)
	    	.subscribe((data:any) => {
	    		this.policy.zipcode1 = data.zipcode;
	    		this.policy.city1 = data.municipality;
	    		this.policy.state1 = data.state;
	    		this.getSuburbs(this.policy.zipcode1);
	    	});**/
	}
	getSuburbs(zipcode){
		this.quotationService.getSububrs(zipcode)
	    	.subscribe((data:any) => {
	    		localStorage.setItem("suburbs1",JSON.stringify(data));
	    	});
	}
	onSubmit(){
		console.log(this.policy);
    this.policy.paytype = this.payform
		localStorage.setItem("cart",JSON.stringify(this.policy));
		this.validateAccessToken();
		this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id+'/2']);
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
		this.hubspotService.getContactByEmail(this.quotation.user.email,localStorage.getItem("access_token"))
        	.subscribe((data:any) =>{
        		console.log(data.vid);
        		localStorage.setItem("vid",data.vid);
        		this.setHubspot();
        	})

	}
	setHubspot(){
		let hubspot = Array();

    	hubspot.push(
    		{'property':'kilometros_paquete', 'value': "Paquete de "+this.package.package+" kilómetros"}
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
