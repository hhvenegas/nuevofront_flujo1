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
import { Quote } from '@angular/compiler';
import { element } from 'protractor';
import { zip } from 'rxjs/operators';
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
    first_name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    phone: "",
    zip_code: ""
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
  boolean_card = true;
  boolean_shipping = false;
  payment_object: any = {
    promotional_code: "",
    token_id: "k7r3b3gvtv7i06tz2w5r",
    device_session_id: "CaKdMxLVVfdiI1M1GfY73up6fhIzntX0",
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
      first_name: "usuario",
      last_name: "prueba1",
      second_last_name: "prueba2",
      cellphone: "555555555",
      phone: "555555555",
      street: "emerson",
      ext_number: "304",
      int_number: "Piso 1",
      suburb: "Polanco V Sección",
      municipality: "Miguel Hidalgo",
      zip_code: 11560,
      federal_entity: "Ciudad de México"
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
          this.user = {
            id: data.quote.user.id,
            first_name: data.quote.user.first_name,
            last_name: data.quote.user.last_name,
            second_last_name: data.quote.user.second_last_name,
            email: data.quote.user.email,
            phone: data.quote.user.phone,
            zip_code: data.quote.user.zip_code
          }
          this.car = {
            id: data.quote.car.id,
            maker: data.quote.car.maker,
            year: data.quote.car.year,
            model: data.quote.car.model,
            version: data.quote.car.model
          }
          this.package_costs = data.quote.packages_costs;
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
  onSubmit(){
    console.log(this.payment_object)
  }
 
  


}
