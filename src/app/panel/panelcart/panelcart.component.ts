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

declare var OpenPay: any;
declare var $:any;


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
  suburbs: any = {
    policy: Array(),
    shipping: Array()
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
    card_id: "",
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
  cupon: any = "";
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
          console.log(this.user)
          if(this.user.id){
            this.userService.getCards(this.user.id)
            .subscribe((data:any)=>{
              console.log(data)
              if(data.result){
                this.cards = data.cards;
                if(this.cards.length>0) this.boolean_card = false;
              }
            })
          }
        }
      })
    }
  }
  getZipcode(tipo,zipcode){
    console.log(zipcode)
    this.quotationService.getSububrs(zipcode)
    .subscribe((data:any)=>{
      console.log(data)
      if(tipo=='policy'){
        this.suburbs.policy = data;
      }
      if(tipo=='shipping'){
        this.suburbs.shipping = data;
      }

    })
  }
  setDireccion(tipo){
    if(tipo=='policy'){
      this.suburbs.policy.forEach( item => {
        if(item.suburb == this.payment_object.policy.suburb){
          this.payment_object.policy.municipality = item.municipality;
          this.payment_object.policy.federal_entity = item.state;
        }
      });
    }
    if(tipo=='shipping'){
      this.suburbs.shipping.forEach( item => {
        if(item.suburb == this.payment_object.shipping.suburb){
          this.payment_object.shipping.municipality = item.municipality;
          this.payment_object.shipping.federal_entity = item.state;
        }
      });
    }
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
    this.payment_object.card_id = "";
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
  changeCard(action){
    if(action=='mostrar'){
      this.payment_object.card_id = "";
      this.boolean_card = true;
    }
    else this.boolean_card = false;
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
    if(this.cupon!=''){
      this.quotationService.searchCupon(this.cupon)
      .subscribe((data:any)=>{
        console.log(data);
        let valid = true;
        if(data.status=="active"){
          if(data.referenced_email){
            if(data.referenced_email!=this.user.email){
              valid=false;
            }
          }
          if(data.promotion.need_kilometer_package){
            if(data.promotion.kilometers!=this.payment_object.kilometer_purchase.kilometers){
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


        ///
        if(valid){
          data.promotion.apply_to.forEach( item => {
            if(item=='MonthlyPayment')
              this.discount+= (299*(data.promotion.discount/100));
            if(item=="KilometerPurchase")
              this.discount+=(this.payment_object.kilometer_purchase.cost*(data.promotion.discount/100));
          });
          this.total = this.subtotal - this.discount;
          this.payment_object.promotional_code = this.cupon;
        }
        else {
          this.payment_object.promotional_code = "";
          this.discount = 0.0;
          this.total = this.subtotal;
        }
      })
    }
    else{
      this.payment_object.promotional_code = "";
      this.discount = 0.0;
      this.total = this.subtotal;
    }
  }
  /**** Openpay ****/
  paymentCard(){
    let openpay:any;
    if(this.cartService.modeProd) openpay = this.cartService.openpay_prod;
    else openpay = this.cartService.openpay_sandbox;
    
    OpenPay.setId(openpay.id);
    OpenPay.setApiKey(openpay.apikey);
    OpenPay.setSandboxMode(openpay.sandbox);

    this.payment_object.device_session_id = OpenPay.deviceData.setup();


    let angular_this = this;
    let sucess_callback = function (response){
        //angular_this.payment_object.token_id = response.data.id;
        let card = {
          user_id: angular_this.user.id,
          token: response.data.id,
          device_session_id: angular_this.payment_object.device_session_id 
        }
        angular_this.operatorsService.createCard(card)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.result){
            angular_this.payment_object.card_id = data.card.id;
            angular_this.sendForm();
          }
        });
    }
    let errorCallback = function (response){
      swal("No se pudo realizar el pago","Inténta con otra tarjeta o con otro método de pago","error")
    }
    OpenPay.token.create({
        "card_number"    : angular_this.card.card_number,
        "holder_name"    : angular_this.card.holder_name,
        "expiration_year"  : angular_this.card.expiration_year,
        "expiration_month"  : angular_this.card.expiration_month,
        "cvv2"        : angular_this.card.cvv2
      },sucess_callback, errorCallback);
  }
  onSubmit(){
    if(this.boolean_card)
      this.paymentCard();
    else this.sendForm();
  }
  sendForm(){
    console.log("SEND FORM")
    if(this.action=='compra'){
      this.operatorsService.pay_quote(this.object_id,this.payment_object)
      .subscribe((data:any)=>{
        console.log(data);
      })
    }
  }
}
