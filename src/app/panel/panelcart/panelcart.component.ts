import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { UsersService } from '../../services/users.service';
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
@Component({
  selector: 'app-panelcart',
  templateUrl: './panelcart.component.html',
  styleUrls: ['./panelcart.component.scss']
})
export class PanelcartComponent implements OnInit {
  action: any = "compra"; /**Compra, recarga,suscripcion **/
  object_id: any = ""; /** Puede ser de cotizacion o de poliza **/
  user: any = {
    id: "",
    email: ""
  }
  car: any = {
    id: "",
    maker: "",
    year: "",
    model: "",
    version: ""
  }
  package_costs: any = Array();
  cards: any = Array();
  card: any = {
    card_number: "",
    holder_name: "",
    expiration_year: "",
    expiration_month: "",
    cvv2: ""
  }

  boolean_card = true;
  boolean_shipping = false;
  payment_object: any = {
    promotional_code: "",
    token_id: "",
    device_session_id: "",
    paymethod: "card",
    subscription: false,
    invoicing: false,
    kilometer_purchase: {
      initial_payment: 299,
      cost: 0.0,
      total: 0.0,
      kilometers: 250
    },
    car: {
      id: 30877,
      motor_number: "",
      vin: "",
      plates: ""
    },        
    shipping: {
        street: "emerson",
        ext_number: "304",
        int_number: "Piso 1",
        suburb: "Polanco V Sección",
        municipality: "Miguel Hidalgo",
        zip_code: 11560,
        federal_entity: "Ciudad de México"
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
      zip_code: "",
      federal_entity: ""
    }
  }
  discount: any = 0;
  subtotal: any = 0;
  total: any    = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private cartService: CartService,private userService: UsersService) { }

  ngOnInit() {
    this.object_id = this.route.snapshot.params['id'];
    this.action = this.route.snapshot.params['action'];
    if(this.action=='compra'){
      this.operatorsService.getQuote(this.object_id)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.payment_object.policy =  {
            first_name: data.quote.user.first_name,
            last_name: data.quote.user.last_name,
            second_last_name: data.quote.user.second_last_name,
            cellphone: "",
            phone: data.quote.user.phone,
            street: "",
            ext_number: "",
            int_number: "",
            suburb: "",
            municipality: "",
            zip_code: data.quote.user.zip_code,
            federal_entity: ""
          }
          this.user = {
            id: data.quote.user.id,
            email: data.quote.user.email
          }
          this.car = {
            id: data.quote.car.id,
            maker: data.quote.car.maker,
            year: data.quote.car.year,
            model: data.quote.car.model,
            version: data.quote.car.model
          }
          this.package_costs = data.quote.packages_costs;
          this.getZipcode('policy',this.payment_object.policy.zip_code);
          this.changePackage();
          if(this.user.id){
            this.userService.getCards(this.user.id)
            .subscribe((data:any)=>{
              console.log(data)
              if(data.result){
                this.cards = data.cards;
                if(this.cards.lenght>0) this.boolean_card = false;
              }
            })
          }
        }
      })
    }
    
  }
  getZipcode(tipo,zipcode){
    console.log(zipcode)
    this.quotationService.getZipcode(zipcode)
    .subscribe((data:any)=>{
      console.log(data)
    })
  }
  changePackage(){
    if(this.action=='compra'){
      this.package_costs.forEach( item => {
        if(this.payment_object.kilometer_purchase.kilometers==item.package){
          this.payment_object.kilometer_purchase = {
            initial_payment: 299,
            cost: item.cost_by_package,
            total: item.total_cost,
            kilometers: item.package
          }
          this.setPayment();

        }
      });
    }
  }
  changePaymethod(){
    this.payment_object.token_id = "";
    this.payment_object.device_session_id = "";
    if(this.payment_object.paymethod=='card'){
      if(this.cards.length>0)
        this.boolean_card = false;
      else this.boolean_card = true;
    }
    else{
      this.boolean_card = false;
      this.payment_object.subscription = false;
    }
  }
  changeShipping(){
    if(this.boolean_shipping)
      this.boolean_shipping = false;
    else this.boolean_shipping = true;
  }
  changeInvoincing(){
    if(this.payment_object.invoicing){
      this.payment_object.invoicing = false;
    }
    else this.payment_object.invoicing = true;
  }
  changeSubscription(){
    if(this.payment_object.subscription)
      this.payment_object.subscription = false;
    else this.payment_object.subscription = true;
  }

  setPayment(){
    if(this.action=='compra'){
      this.subtotal = this.payment_object.kilometer_purchase.total;
    }
    if(this.action=='recarga'){
      this.subtotal = this.payment_object.kilometer_purchase.cost;
    }
    if(this.action=='suscripcion'){
      this.subtotal = this.payment_object.kilometer_purchase.initial_payment;
    }

    this.total = this.subtotal - this.discount;
  }
  setCupon(){
    if(this.payment_object.promotional_code!=''){
      this.quotationService.searchCupon(this.payment_object.promotional_code)
      .subscribe((data:any)=>{
        console.log(data)
      })
    }
    else{
      this.discount = 0.0;
    }
  }
  /**** Openpay ****/
  paymentCard(card){
    let openpay:any;
    if(this.cartService.modeProd) openpay = this.cartService.openpay_prod;
    else openpay = this.cartService.openpay_sandbox;
    
    OpenPay.setId(openpay.id);
    OpenPay.setApiKey(openpay.apikey);
    OpenPay.setSandboxMode(openpay.sandbox);

    this.payment_object.device_session_id = OpenPay.deviceData.setup();


    let angular_this = this;
    let sucess_callback = function (response){
        angular_this.payment_object.token_id = response.data.id;
        angular_this.onSubmit();
    }
    let errorCallback = function (response){
      swal("No se pudo realizar el pago","Inténta con otra tarjeta o con otro método de pago","error")
    }
    this.router.navigate(['comprando']);
    OpenPay.token.create({
        "card_number"    : card.card_number,
        "holder_name"    : card.holder_name,
        "expiration_year"  : card.expiration_year,
        "expiration_month"  : card.expiration_month,
        "cvv2"        : card.cvv2
      },sucess_callback, errorCallback);
  }
  onSubmit(){
    console.log(this.payment_object)
  }
 
  


}
