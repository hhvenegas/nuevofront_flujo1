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

@Component({
  selector: 'app-loading-error1',
  templateUrl: './loading-error1.component.html',
  styleUrls: ['./loading-error1.component.scss']
})
export class LoadingError1Component implements OnInit {
	quote_id: any;
	package_id: any;
  params_from_ops: any = '';

  	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router) {
      this.quote_id = this.route.snapshot.params['id'];
   		this.package_id = this.route.snapshot.params['package'];
      const params = new URLSearchParams(window.location.search);

      console.log("parametros", params);

      if(params.has('buf')){
        this.params_from_ops = params.get('buf')
        console.log("buf", this.params_from_ops)
      }

    }

 	ngOnInit() {

  	}

  go_back(){
  
  }

}
