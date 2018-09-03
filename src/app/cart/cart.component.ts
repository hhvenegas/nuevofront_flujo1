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
import { Policy } from '../constants/policy';
import { Aig } from '../constants/aig';

import * as $ from 'jquery';
import Swiper from 'swiper';
declare var M:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
	paso = 1;
	pago = 'tarjeta';
	checkbox_dir: boolean = false;
	quote_id:any;
	package_id:any=1;
	quotation:any; 
	aig: Aig = null;
	policy =  new Policy('1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','','','','','','','','','','','','','','','','');
	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];
		this.getQuotation();
	}
	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		console.log(data);
	    		this.quotation=data.quote;
	    		this.aig = data.aig;
	    		this.initCart();
	    	});
	}
	initCart(){
		this.policy.quote_id = this.quote_id;
		this.policy.cellphone = this.quotation.cellphone;
		this.policy.email = this.quotation.email;
		this.policy.kilometers_package_id = this.package_id;
		this.policy.promotional_code = this.quotation.promo_code;
	}
	changeDir(){
		if(this.checkbox_dir){
			this.checkbox_dir 		= false;
			this.policy.street2 	= this.policy.street1;
			this.policy.ext_number2 = this.policy.ext_number1;
			this.policy.int_number2 = this.policy.int_number1;
			this.policy.zipcode2 	= this.policy.zipcode1;
			this.policy.suburb2 	= this.policy.suburb1;
		}
		else{ 
			this.checkbox_dir = true;
			this.policy.street2 	= "";
			this.policy.ext_number2 = "";
			this.policy.int_number2 = "";
			this.policy.zipcode2 	= "";
			this.policy.suburb2 	= "";
		}
	}

	onSubmit(){
		this.paso=this.paso+1;

		if(this.paso==4){
			console.log(this.policy);
		}
	}

}
