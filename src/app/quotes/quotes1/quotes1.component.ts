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

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['id'];
		console.log(this.quote_id);
		this.getQuotation();
	}
	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		this.quotation=data.quote;
	    		this.aig = data.aig;
	    		this.packages 	= data.cotizaciones;
	    		console.log(data);
	    	});
	}
	mouseHover(id){
		this.package_id = id;
	}

}
