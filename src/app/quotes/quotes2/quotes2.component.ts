import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';

import { Aig } from '../../constants/aig';

declare var M:any;

@Component({
  selector: 'app-quotes2',
  templateUrl: './quotes2.component.html',
  styleUrls: ['./quotes2.component.scss']
})
export class Quotes2Component implements OnInit {
	quote_id: any = 0;
  quote: any =null;
	quotation: any = null;
	aig: Aig = null;
  package_id=7000;
  package_selected: any = null;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService) { }

	ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
      	let elems = document.querySelectorAll('.dropdown-trigger');
      	let instances = M.Dropdown.init(elems, {});
      	this.getQuotation();
      }
  }
  getQuotation(): void {
  		this.quote_id = this.route.snapshot.params['id'];
		  this.quotationService.getQuotation(this.quote_id)
			  .subscribe((quotation:any) => {
          this.quote = quotation.quote;
          this.aig = quotation.aig; 
          this.quotation=quotation.cotizaciones; 
          console.log(quotation);
          this.changePackageSelected(this.quotation[0].package, this.quotation[0].vigency, this.quotation[0].cost_by_package, this.quotation[0].total_cost);
        });

	}
  changePackageSelected(package_km, vigency, cost,total){
    this.package_id = package_km ;
    let i = 1;
    if(package_km == 500)  i =2;
    if(package_km == 1000) i =3;
    if(package_km == 5000) i =4;
    if(package_km == 7000) i =5;
    this.package_selected = {
      "id" : i,
      "package" : package_km,
      "vigency" : vigency,
      "cost_by_package" : cost,
      "total_cost" : total
    }

  }

}
