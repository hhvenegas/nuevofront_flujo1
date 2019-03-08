import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { OperatorsService } from '../../services/operators.service';
import { HubspotService } from '../../services/hubspot.service';

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
  selector: 'app-quotes1',
  templateUrl: './quotes1.component.html',
  styleUrls: ['./quotes1.component.scss']
})
export class Quotes1Component implements OnInit {
	package_id = 1000;
	quote_id: any = "";
	quotation:any;
	aig: Aig = null;
	packages: any = null;
	cost_by_km: any = 0;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService,private hubspotService: HubspotService,private operatorsService: OperatorsService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		console.log(this.quote_id);
		this.getQuotation();
	}
	getQuotation(){
		this.operatorsService.getQuote(this.quote_id)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.data){
				this.quotation = data.data.quote;
				this.aig = data.data.car;
				this.packages = data.data.cost;
				this.packages.forEach(element => {
					if(element.cost_by_km>this.cost_by_km)
						this.cost_by_km = element.cost_by_km;
				});
				this.validateAccessToken();
			}
		});
	}
	mouseHover(id){
		this.package_id = id;
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
		let cotizaciones = "";
		let hubspot = Array();
		this.packages.forEach(
      		item => {
        		cotizaciones+="Paquete "+item.package+": $"+item.cost_by_package+"\n";
      		}
    	);
    	hubspot.push(
    		//{'property':'email', 'value': this.quotation.email},
    		{'property':'cost_by_km', 'value': this.quotation.packages_costs[0].cost_by_km.toFixed(2)},
    		{'property':'cotizaciones', 'value': cotizaciones},
    		{'property':'vistas_cotizaciones', 'value': '1'}
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
