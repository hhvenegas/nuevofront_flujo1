import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { CartService } from '../../services/cart.service';
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

declare var $:any;
declare var M:any;
declare var OpenPay: any;
import Swiper from 'swiper';
import swal from 'sweetalert';
import { Quote } from '@angular/compiler';
import { element } from 'protractor';
import { zip } from 'rxjs/operators';
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
  cupon: any = "";
  checkbox_envio: any = true;

  payment = {
    car: null,
    packages: null,
    package_selected:null,
    package_id_selected: null,
    cards: null,
    card: {
      card: "",
      card_name: "",
      cvv: "",
      month:"",
      year:""
    },
    promotional_code: "",
    discount: 0.00,
    suscription: 299.00,
    total_cost: 0.00
  }

  payment_object = {
    promotional_code: "",
    token_id: "",
    device_session_id: "",
    paymethod: "card",
    subscription: false,
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
      zip_code: "",
      federal_entity: ""
    },
    billing: {
      zip_code: "",
      legal_name: "",
      rfc: ""
    },
    policy: {
      //email: "",
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
  suburbs: any = {
    policy: null,
    shipping: null,
    billing: null
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private cartService: CartService) { }

  ngOnInit() {
    this.action   = this.route.snapshot.params['action'];

    if(this.action=='compra'){
      this.quote_id = this.route.snapshot.params['id'];
      this.operatorsService.getQuote(this.quote_id)
        .subscribe((data:any)=>{
          this.quote = data.quote;
          this.payment = {
            car: this.quote.car,
            packages: this.quote.packages_costs,
            package_selected:this.quote.packages_costs[0],
            package_id_selected: null,
            cards: null,
            promotional_code: "",
            card: {
              card: "",
              card_name: "",
              cvv: "",
              month:"",
              year:""
            },
            discount:0.00,
            suscription: 299.00,
            total_cost: this.quote.packages_costs[0].total_cost
          }
          this.payment_object.policy = {
            //email: this.quote.user.email,
            first_name: this.quote.user.first_name,
            last_name: this.quote.user.last_name,
            second_last_name: this.quote.user.second_last_name,
            cellphone: this.quote.user.phone,
            phone: "",
            street: "",
            ext_number: "",
            int_number: "",
            suburb: "",
            municipality: "",
            zip_code: this.quote.user.zip_code,
            federal_entity: ""
          }
          this.payment_object.car = {
            id: this.quote.car.id,
            motor_number: "",
            vin: "",
            plates: ""
          }
          this.getSuburbs('policy')
        });
    }
    else{
      this.policy_id = this.route.snapshot.params['id'];
      this.operatorsService.getPolicy(this.policy_id)
        .subscribe((data:any)=>{
          this.policy = data.policy;
          this.payment = {
            car: this.policy.car,
            packages: null,
            package_selected: null,
            package_id_selected: null,
            cards: null,
            promotional_code: "",
            card: {
              card: "",
              card_name: "",
              cvv: "",
              month:"",
              year:""
            },
            discount:0.00,
            suscription: 299.00,
            total_cost: 299.00
          }
          console.log(this.payment)
        });
    }
  }
  getSuburbs(type){
    let zipcode= "";
    if(type=='policy') zipcode = this.payment_object.policy.zip_code;
    if(type=='shipping') zipcode = this.payment_object.shipping.zip_code;
		this.quotationService.getSububrs(zipcode)
	    	.subscribe((data:any) => {
          console.log(data)
          if(type=='policy'){
            this.suburbs.policy = data;
            this.payment_object.policy.suburb = data[0].suburb;
            this.payment_object.policy.municipality = data[0].municipality;
            this.payment_object.policy.federal_entity = data[0].state;
          }
          if(type=='shipping'){
            this.suburbs.shipping = data;
            this.payment_object.shipping.suburb = data[0].suburb;
            this.payment_object.shipping.municipality = data[0].municipality;
            this.payment_object.shipping.federal_entity = data[0].state;
          }
	    	});
	}
  setAction(action){
    this.action = action;
    this.payment.suscription = 299.00;
    if(this.action=='recarga'){
      this.payment.suscription = 0;
    }
    if(this.action=='compra'){
      this.payment_object.kilometer_purchase= {
        cost: this.payment.package_selected.cost_by_package,
        initial_payment: 299,
        kilometers: this.payment.package_selected.package,
        total: this.payment.package_selected.total_cost,
      }
    }
    this.payment.total_cost = this.payment.package_selected.cost_by_package+this.payment.suscription-this.payment.discount;
  
  }

  setPackageSelected(){
    this.payment.packages.forEach(element => {
      if(element.package==this.payment.package_id_selected){
        this.payment.package_selected = element;
        this.setAction('compra')
      }
    });
  }
  cleanCard(){
    this.payment_object.token_id = "";
    this.payment_object.device_session_id = "";
    this.payment_object.subscription = false;
  }


  onSubmit(){
    this.cleanShipping();
    if(this.payment_object.paymethod=='card'){
      this.paymentCard();
    }
    else this.sendForm();
  }

  searchCupon(){
    let valid = true;
    if(this.cupon!=""){
      this.quotationService.searchCupon(this.cupon)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.promotional_code == this.cupon){
            if(data.status=="active"){
              if(data.promotion.need_kilometer_package){
                if(data.promotion.kilometers!=this.payment.package_id_selected){
                  valid=false;
                }
              }
              if(data.promotion.subscribable){
                this.payment_object.subscription = true;
              }
              if(data.for_card){
                this.payment_object.paymethod = "card";
                if(data.promotion.card_type){
                  console.log("solo card_Type")
                }
                if(data.promotion.card_brand){
                  console.log("solo brand")
                }
              }
            }
            else valid = false;
            if(valid){
              console.log("si aplica");
              data.promotion.apply_to.forEach( item => {
                if(item=='MonthlyPayment')
                  this.payment.discount += (299*(data.promotion.discount/100));
                if(item=="KilometerPurchase")
                  this.payment.discount+=(this.payment.package_selected.total_cost *(data.promotion.discount/100));
              });
              this.payment.total_cost = this.payment.package_selected.total_cost - this.payment.discount;
              this.payment_object.promotional_code = this.cupon;
            }
            else{
              this.deleteCupon();
              swal("No se pudo aplicar el descuento", "Inténtalo con otro nuevamente", "error");
            }
        }
        else swal("El cupón no existe ", "Inténtalo con otro nuevamente", "error");
        });
    }
    else this.deleteCupon()
  }
  deleteCupon(){
    this.cupon = "";
    this.payment_object.promotional_code = "";
    this.payment.discount=0;
  }
  setCheckboxEnvio(){
    if(this.checkbox_envio){
      this.payment_object.shipping = {
        street: "",
        ext_number: "",
        int_number: "",
        suburb: "",
        municipality: "",
        zip_code: "",
        federal_entity: ""
      }
      this.suburbs.shipping = Array();
      this.checkbox_envio = false;
    }
    else{
      this.checkbox_envio = true;
    } 
  }

  cleanShipping(){
    if(this.checkbox_envio){
      this.payment_object.shipping = {
        street: this.payment_object.policy.street,
        ext_number: this.payment_object.policy.ext_number,
        int_number: this.payment_object.policy.int_number,
        suburb: this.payment_object.policy.suburb,
        municipality: this.payment_object.policy.municipality,
        zip_code: this.payment_object.policy.zip_code,
        federal_entity: this.payment_object.policy.federal_entity
      }
    }
  }
  setCheckboxSuscription(){
    if(this.payment_object.subscription)
      this.payment_object.subscription = false;
    else this.payment_object.subscription = true;
  }

  setCheckboxInvoicing(){
    if(this.payment_object.invoicing)
      this.payment_object.invoicing = false;
    else this.payment_object.invoicing = true;
  }
  

  /**** Openpay ****/
	paymentCard(){

    
		let openpay:any = false;
    if(this.cartService.modeProd) openpay = this.cartService.openpay_prod;
		else openpay = this.cartService.openpay_sandbox;
		console.log(openpay);
		OpenPay.setId(openpay.id);
    OpenPay.setApiKey(openpay.apikey);
    OpenPay.setSandboxMode(openpay.sandbox);

    this.payment_object.device_session_id = OpenPay.deviceData.setup();
    
    console.log(this.payment_object.device_session_id);

		let angular_this = this;
		let sucess_callback = function (response){
		    angular_this.payment_object.token_id = response.data.id;
        angular_this.sendForm();
        
		}
		let errorCallback = function (response){
			swal("No se pudo realizar el pago", "Inténtalo con otro método de pago", "error");
    }
    let card = {
      "card_number": this.payment.card.card,
      "holder_name": this.payment.card.card_name,
      "expiration_year": this.payment.card.year,
      "expiration_month": this.payment.card.month,
      "cvv2": this.payment.card.cvv
    }
		OpenPay.token.create(card,sucess_callback, errorCallback);
  }


  sendForm(){
    console.log(this.payment_object);
    if(this.action=='compra'){
      this.operatorsService.pay_quote(this.quote_id,this.payment_object)
      .subscribe((data:any)=>{
        console.log(data)
      });

    }
    //this.router.navigate(['/panel/poliza/editar/1040']); 
  }


}
