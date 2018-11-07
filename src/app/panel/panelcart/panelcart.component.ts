import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
import { Quotation2 } from '../../constants/quotation2';
import { Seller } from '../../constants/seller';

//import * as M from "node_modules/materialize-css/dist/js/materialize.min.js";
//import * as $ from 'jquery';
declare var $:any;
declare var M:any;
import Swiper from 'swiper';
import swal from 'sweetalert';
import { Quote } from '@angular/compiler';
import { element } from 'protractor';
@Component({
  selector: 'app-panelcart',
  templateUrl: './panelcart.component.html',
  styleUrls: ['./panelcart.component.scss']
})
export class PanelcartComponent implements OnInit {
  action: any = "compra";
  quote_id:any = null;
  policy_id:any = null;
  quote: any = Array();
  policy:any = Array();

  payment = {
    user: null,
    packages: null,
    car: null
  }
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.action   = this.route.snapshot.params['action'];

    if(this.action=='compra'){
      this.quote_id = this.route.snapshot.params['id'];
      this.operatorsService.getQuote(this.quote_id)
        .subscribe((data:any)=>{
          this.quote = data;
          this.payment.user = this.quote.user;
          this.payment.packages = this.quote.packages_costs;
          this.payment.car = this.quote.car;
          console.log(this.payment.packages)
        });
    }
    else{
      this.policy_id = this.route.snapshot.params['id'];
    }
  }





}
