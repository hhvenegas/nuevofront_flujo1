import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
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
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');
	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];
		this.getQuotation();
		if (isPlatformBrowser(this.platformId)) {
			if(localStorage.getItem("cart")){
				this.policy = JSON.parse(localStorage.getItem("cart"));
			}

		}
	}
	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		this.quotation=data.quote;
	    		this.aig = data.aig;
	    		this.packages 	= data.cotizaciones;
	    		this.getPackage();
	    		this.initCart();
	    	});
	}
	initCart(){
		this.policy.quote_id				= this.quote_id;
		this.policy.cellphone 				= this.quotation.cellphone;
		this.policy.email      				= this.quotation.email;
		this.policy.kilometers_package_id 	= this.package_id;
		this.policy.promotional_code 		= this.quotation.promo_code;
		this.getZipcode(this.quotation.zipcode_id);
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
	getZipcode(zipcode_id){
		this.quotationService.getZipcode(zipcode_id)
	    	.subscribe((data:any) => {
	    		this.policy.zipcode1 = data.zipcode;
	    		this.policy.city1 = data.municipality;
	    		this.policy.state1 = data.state;
	    		this.getSuburbs(this.policy.zipcode1);
	    	});
	}
	getSuburbs(zipcode){
		this.quotationService.getSububrs(zipcode)
	    	.subscribe((data:any) => {
	    		localStorage.setItem("suburbs1",JSON.stringify(data));
	    	});
	}
	onSubmit(){
		console.log(this.policy);
		localStorage.setItem("cart",JSON.stringify(this.policy));
		this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id+'/2']);
	}

}