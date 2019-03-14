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
  templateUrl: './cart2.component.html',
  styleUrls: ['./cart2.component.scss']
})
export class Cart2Component implements OnInit {
	checkbox_dir: boolean = false;
	quote_id:any;
	package_id:any=1;
	package: any = null;
	packages:any = null;
	total_cost: any = null;
	quotation:any;
  user:any;
	zipcodeBoolean: boolean = true;
	suburbs1:any = Array();
	suburbs2: any = Array();
	aig: Aig = null;
	policy =  new Policy('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false,false,'','');
	isPromotional: boolean = false
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService,private hubspotService: HubspotService, private operatorsService: OperatorsService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		this.package_id = this.route.snapshot.params['package'];
		if (isPlatformBrowser(this.platformId)) {
			if(!localStorage.getItem("cart")){
				this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id]);
			}
			this.policy = JSON.parse(localStorage.getItem("cart"));
			this.suburbs1 = JSON.parse(localStorage.getItem("suburbs1"));
			console.log(this.policy);
			if(this.policy.promotional_code)
				this.isPromotional = true;
		}
		this.getQuotation();

	}
	getQuotation(){
		this.operatorsService.getQuote(this.quote_id)
	    	.subscribe((data:any) => {
				console.log(data)
          this.quotation=data.data.quote;
          this.aig = data.data.car;
          this.packages = data.data.cost;
          this.user = data.data.userCreate.data;
	    		this.getPackage();
	    	});
	}
	getPackage(){
		this.quotationService.getPackage(this.package_id)
	    	.subscribe((data:any) => {
          this.validateZipcode();
	    		this.packages.forEach( item => {
	    			if(item.package==data.kilometers){
	    				this.package = item;
	    				this.total_cost = item.total_cost;
	    			}
          		});
	    	});
	}
	changeDir(){
		console.log("HOLA")
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
	setDirShipping(){
		this.policy.street2 	= this.policy.street1;
		this.policy.ext_number2 = this.policy.ext_number1;
		this.policy.int_number2 = this.policy.int_number1;
		this.policy.zipcode2 	= this.policy.zipcode1;
		this.policy.suburb2 	= this.policy.suburb1;
	}
	validateZipcode(){
		this.quotationService.validateZipcode(this.quotation.zipcode)
	    	.subscribe((data:any) => {
	    		if(data.data.length > 0){
	    			this.getSuburbs(this.quotation.zipcode);
	    			this.zipcodeBoolean = true;
	    		}
	    		else this.zipcodeBoolean = false;
	    	});
	}
	getSuburbs(zipcode){
		this.quotationService.getSububrs(zipcode)
	    	.subscribe((data:any) => {
	    		console.log(data);
	    		this.suburbs1 = data.data;
	    		this.policy.suburb1= "";
	    		this.policy.state1 = data.data[0].federal_entity;
	    		this.policy.city1  = data.data[0].municipality;

	    	});
	}
	onSubmit(){
		console.log(this.policy);
		localStorage.setItem("cart",JSON.stringify(this.policy));
		this.validateAccessToken();
    let street = {
    	"street": this.policy.street1,
    	"external_number": this.policy.ext_number1,
    	"internal_number": this.policy.int_number1,
    	"colony": this.policy.suburb1,
    	"postal_code": String(this.quotation.zipcode),
    	"location": this.policy.suburb1,
    	"city": this.policy.city1,
    	"state": this.policy.state1,
    	"country":this.policy.city1,
    	"type": "MAIN"
    }
    let user_info = {
      "name": this.user.name,
      "lastname_one": this.user.lastname_one
    }
    this.save_address_user(this.user.id ,street)
    this.update_user_data(this.user.id, user_info)
		this.router.navigate(['/compra-kilometros/'+this.quote_id+'/'+this.package_id+'/3']);
	}

  save_address_user(user_id, street){
    this.quotationService.saveAddressUser(user_id, street)
	    	.subscribe((data:any) => {
	    		console.log('La direccion se creo');
	    	});
  }

  update_user_data(user_id, user_info){
    this.quotationService.UpdateUser(user_id, user_info)
        .subscribe((data:any) => {
          console.log('La direccion se creo');
        });
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
			{'property':'firstname', 'value': this.policy.first_name},
			{'property':'lastname', 'value': this.policy.last_name_one},
			{'property':'mobilephone', 'value': this.policy.cellphone},
			{'property':'address', 'value': this.policy.street1+", "+this.policy.city1+", "+this.policy.state1+", "+this.policy.zipcode1}


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
