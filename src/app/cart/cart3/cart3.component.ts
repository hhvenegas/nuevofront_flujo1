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
  templateUrl: './cart3.component.html',
  styleUrls: ['./cart3.component.scss']
})
export class Cart3Component implements OnInit {
	checkbox_factura: boolean = false;
	quote_id:any;
	package_id:any=1;
	quotation:any; 
	zipcodeBoolean: boolean = true;
	pago: string = "tarjeta";
	suburbs3: any = Array();
	aig: Aig = null;
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');

	card: string = "";
	card_name:string = "";
	vigency_year: string = "";
	vigency_month:string = "";
	cvv: string = "";
	
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
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
	}
	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		this.quotation=data.quote;
	    		this.aig = data.aig;
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
	validateZipcode(){
		this.quotationService.validateZipcode(this.policy.zipcode3)
	    	.subscribe((data:any) => {
	    		if(data==1){
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
	    		this.policy.state3 = data[0].state;
	    		this.policy.city3  = data[0].municipality;
	    		
	    	});
	}
	changePayment(payment){
		this.pago = payment;
	}
	onSubmit(){
		console.log(this.policy);
		localStorage.setItem("cart",JSON.stringify(this.policy));
		//this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id+'/3']);
	}

}
