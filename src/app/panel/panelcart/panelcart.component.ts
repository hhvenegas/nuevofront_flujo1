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
    car: null,
    packages: null,
    package_selected:null,
    package_id_selected: 250,
    cards: null,
    discount: 0.00,
    suscription: 299.00,
    total_cost: 0.00
  }

  payment_object = {
    promotional_code: "",
    token_id: "",
    device_session_id: "",
    paymethod: "card",
    subscription: true,
    invoicing: false,
    kilometer_purchase: {
      initial_payment: 299,
      cost: 0.00,
      total: 0.00,
      kilometers: 250
    },
    car: {
      id: "",
      motor_number: "",
      vin: "",
      plates: ""
    },        
    shipping: {
      street: "",
      ext_number: "",
      int_number: "",
      suburb: "",
      municipality: "",
      zip_code: 11560,
      federal_entity: ""
      },
      billing: {
        zip_code: "",
        legal_name: "",
        rfc: ""
      },
      policy: {
        first_name: "",
        last_name: "",
        second_last_name: "",
        cellphone: "",
        phone: "",
        street: "",
        ext_number: "",
        int_number: "",
        suburb: "",
        municipality: "",
        zip_code: null,
        federal_entity: ""
      }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.action   = this.route.snapshot.params['action'];

    if(this.action=='compra'){
      this.quote_id = this.route.snapshot.params['id'];
      this.operatorsService.getQuote(this.quote_id)
        .subscribe((data:any)=>{
          this.quote = data.quote;
          this.payment = {
            user: this.quote.user,
            car: this.quote.car,
            packages: this.quote.packages_costs,
            package_selected:this.quote.packages_costs[0],
            package_id_selected: 250,
            cards: null,
            discount:0.00,
            suscription: 299.00,
            total_cost: this.quote.packages_costs[0].total_cost
          }
          console.log(this.payment)
        });
    }
    else{
      this.policy_id = this.route.snapshot.params['id'];
      this.operatorsService.getPolicy(this.policy_id)
        .subscribe((data:any)=>{
          this.policy = data.policy;
          this.payment = {
            user: this.policy.user,
            car: this.policy.car,
            packages: null,
            package_selected: null,
            package_id_selected: 250,
            cards: null,
            discount:0.00,
            suscription: 299.00,
            total_cost: 299.00
          }
          console.log(this.payment)
        });
    }
  }

  setAction(action){
    this.action = action;
    if(this.action=='recarga'){
      this.payment.suscription = 0;
    }
    else{
      this.payment.suscription = 299.00;
    }

    this.payment.total_cost = this.payment.package_selected.cost_by_package+this.payment.suscription-this.payment.discount;
  }

  setPackageSelected(){
    console.log("SE CAMBIA")
    this.payment.packages.forEach(element => {
      if(element.package==this.payment.package_id_selected){
        this.payment.package_selected = element;
        console.log("SI SON IGUALES")
      }
    });
  }


  onSubmit(){
    
  }





}
