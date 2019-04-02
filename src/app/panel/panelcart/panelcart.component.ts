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
import { LoaderService } from '../../services/loader.service';

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
  msi: boolean = false;
  object_id: any = "";
  action: any    = "compra";
  isCompra: any = false;
  isRecarga: any = false;
  isSubscription: any = false;
  isDevice: any = false;
  total:any = 0;
  subtotal: any = 0;
  discount: any = 0;
  cupon: any = "";

  promotional_code:any   =  "";
	card_id:any            =  "";
	device_session_id:any  =  "";
  paymethod:any          =  "credit_card";

  package_costs: any = Array();
  kilometer_purchase: any = Array();
  policy: any = Array();
  
  monthly_payment_id:any =  "";

  user: any = Array();
  car_object: any  = {
    maker: "",
    year: "",
    model: "",
    version: ""
  }
  car: any = {
    id: "",
    motor_number: "",
    vin: "",
    plates: ""
  }
  billing:any = {
    zip_code: "",
    legal_name: "",
    rfc: ""
  }
  cards: any= Array();
  card: any = {
    card_number: "",
    holder_name: "",
    expiration_year: "",
    expiration_month: "",
    cvv2: ""
  }

  suburbs: any = {
    policy: Array(),
    shipping: Array()
  }

  shipping: any = Array();
  boolean_shipping: any = false;
  boolean_terminos: any = false;
  boolean_invoicing: any= false;
  boolean_subscription: any = false;
  boolean_isOxxo: any = false;
  boolean_isOpenpay: any = false;
  boolean_isSpei:any = false;
  boolean_isCard:any = true;
  boolean_new_card: any = true;
  boolean_cupon: any = true;

  //Dispositivo
  date_device: any = "";
  months_device: any = 0;
  device_price: any = 200;
  months_price: any = 0;

  payment_success:boolean;
  ficha_pago:{};
  pending_divice:any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private cartService: CartService,private userService: UsersService, private loader: LoaderService) { }

  ngOnInit() {
    this.payment_success = false;
    //this.loader.show();
    this.object_id = this.route.snapshot.params['id'];
    this.action = this.route.snapshot.params['action'];
    this.validateAction();
    if(!this.isSubscription){
      this.kilometer_purchase.kilometers = 250;
    }
    if(this.isCompra){
      this.initializeQuote();
    }
    else{
      this.initializePolicy();
    }
  }
 
  validateAction(){
    if(this.action=='compra') this.isCompra= true;
    if(this.action=='recarga') this.isRecarga= true;
    if(this.action=='suscripcion') this.isSubscription= true;
    if(this.action=='dispositivo') this.isDevice = true;
  }
  changePackage(){
    this.package_costs.forEach( item => {
      if(this.kilometer_purchase.kilometers==item.package){
        if(this.isCompra){
          this.kilometer_purchase = {
            initial_payment: 299,
            cost: item.cost_by_package,
            total: item.total_cost,
            kilometers: item.package
          }

          this.subtotal = this.kilometer_purchase.total;
        }
        if(this.isRecarga){
          this.kilometer_purchase = {
            cost: item.cost_by_package,
            total: item.cost_by_package,
            kilometers: item.package
          }
          this.subtotal = this.kilometer_purchase.cost;
        }
        if(this.isSubscription){
          this.subtotal = 299;
        }
        this.setTotal();
      }
    });
    console.log(this.kilometer_purchase);
  }
  changeShipping(){
    if(this.boolean_shipping)
      this.boolean_shipping = false;
    else{
      this.shipping = {
        street: "",
        ext_number: "",
        int_number: "",
        suburb: "",
        municipality: "",
        zip_code: "",
        federal_entity: ""
      }
      this.boolean_shipping = true;
    }
  }
  validateShipping(){
    if(!this.boolean_shipping){
      this.shipping = {
        street: this.policy.street,
        ext_number: this.policy.ext_number,
        int_number: this.policy.int_number,
        suburb: this.policy.suburb,
        municipality: this.policy.municipality,
        zip_code: this.policy.zip_code,
        federal_entity: this.policy.federal_entity
      }
    }
  }
  changeInvoincing(){
    if(this.boolean_invoicing){
      this.boolean_invoicing = false;
    }
    else this.boolean_invoicing = true;
  }
  changePaymethod(){
    this.card_id = "";
    this.boolean_subscription = false;
    this.device_session_id = "";


    this.boolean_isOxxo    = false;
    this.boolean_isOpenpay = false;
    this.boolean_isSpei    = false;
    this.boolean_isCard    = false;

    if(this.paymethod=='credit_card'){
      this.boolean_isCard = true;
      
      if(this.cards.length>0)
        this.boolean_new_card = false;
      else this.boolean_new_card = true;
    }
    if(this.paymethod=='oxxo'){
      this.boolean_isOxxo = true;
    }
    if(this.paymethod=='open_pay'){
      this.boolean_isOpenpay = true;
    }
    if(this.paymethod=='spei'){
      this.boolean_isSpei = true;
    }
  }
  changeSubscription(){
    if(this.boolean_subscription)
      this.boolean_subscription = false;
    else this.boolean_subscription = true;
  }
  newCard(nueva){
    this.card = {
      card_number: "",
      holder_name: "",
      expiration_year: "",
      expiration_month: "",
      cvv2: ""
    }
    if(nueva){
      this.card_id = "";
      this.boolean_new_card = true;
    }
    else{
      this.boolean_new_card = false;
    }
    
  }
  initializeQuote(){
    this.operatorsService.getQuote(this.object_id)
      .subscribe((data:any)=>{
        if(data.result){
          this.package_costs = data.quote.packages_costs;
          this.policy =  {
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
          this.car_object = {
            id: data.quote.car.id,
            maker: data.quote.car.maker,
            year: data.quote.car.year,
            model: data.quote.car.model,
            version: data.quote.car.model
          }
          this.car =  {
            id: data.quote.car.id,
            motor_number: "",
            vin: "",
            plates: ""
          }
          if(this.user.id){
            this.userService.getCards(this.user.id)
            .subscribe((data:any)=>{
              this.loader.hide();
              console.log(data)
              if(data.result){
                this.cards = data.cards;
                if(this.cards.length > 0) this.boolean_new_card = false;
              }
            })
          }
          this.getZipcode('policy',data.quote.user.zip_code);
          this.changePackage();
          console.log(this.paymethod);
          if(localStorage.getItem("cart_panel_"+this.object_id)){
            let payment = JSON.parse(localStorage.getItem("cart_panel_"+this.object_id));
            console.log("SI EXISTE LOCALSTORAGE");
            console.log("ajaj")
            this.promotional_code = payment.promotional_code;
            this.card_id =  payment.card_id;
            this.device_session_id = payment.device_session_id;
            this.paymethod = payment.paymethod;
            this.boolean_subscription = payment.subscription;
            this.boolean_invoicing =payment.invoicing;
            this.kilometer_purchase= payment.kilometer_purchase,
            this.car= payment.car;       
            this.shipping= payment.shipping;
            this.billing= payment.billing;
            this.policy= payment.policy;
            
          }
          this.operatorsService.getPendingPaymentsQuotes(this.object_id)
          .subscribe((data:any)=>{
            console.log(data)
            if(data.result && data.data.length>0){
              swal("Existe una ficha de pago pendiente","", {
                buttons: ["Continuar al pago", "Ver ficha de pago"],
              })
              .then((value) => {
                console.log(value);
                if(value){
                  this.router.navigate([`/panel/ticket/compra/pendiente/${this.object_id}`])
                }
              })
            }
          })
        }
        else{
          swal("Hubo un problema","Esta cotización no fue encontrada","error")
        }
      });

  }

  initializePolicy(){
    this.operatorsService.getPolicy(this.object_id)
    .subscribe((data:any)=>{
      console.log(data);
      this.user = {
        id: data.policy.user.id,
        email: data.policy.user.email
      }
      this.car_object =  {
        maker: data.policy.car.maker,
        year: data.policy.car.year,
        model: data.policy.car.model,
        version: data.policy.car.version
      }
      this.package_costs = data.policy.packages_costs;
      this.car = data.policy.car;
      this.changePackage();
      if(this.isSubscription){
        this.operatorsService.getAllPaymentsPolicy(this.object_id)
        .subscribe((data:any)=>{
          console.log(data)
          if(data.result){
            this.monthly_payment_id = data.data.due_membership.id;
            this.subtotal = data.data.due_membership.total;
            this.kilometer_purchase.initial_payment= this.subtotal;
            this.total = this.subtotal;
            this.loader.hide();
          }
        })
      }
      if(this.isDevice){
        this.subtotal = this.device_price;
        console.log(this.subtotal)
        this.total = this.subtotal;
        this.operatorsService.getPendingPaymentsPolicy(this.object_id)
        .subscribe((data:any)=>{
          console.log(data)
          this.pending_divice = data.data
          if(this.pending_divice){
            for(let pending_payment of this.pending_divice){
              console.log("ja")
              if(pending_payment.type == "Cobro Dispositivo"){
                swal("Existe una ficha de pago pendiente","", {
                  buttons: ["Continuar al pago", "Ver ficha de pago"],
                })
                .then((value) => {
                  console.log(value);
                  if(value){
                    this.router.navigate([`/panel/ticket/dispositivo/pendiente/${this.object_id}`])
                  }
                })
              } 
            }
          }
        });
      }    
      if(this.user.id){
        this.userService.getCards(this.user.id)
        .subscribe((data:any)=>{
          console.log(data)
          if(data.result){
            this.cards = data.cards;
            if(this.cards.length > 0) this.boolean_new_card = false;
          }
        })
      }
    });
  }

  paymentDivice(){
    this.operatorsService.getPendingPaymentsPolicy(this.object_id)
    .subscribe((data:any)=>{
      console.log(data)
      this.pending_divice = data.data
      if(this.pending_divice){
        for(let pending_payment of this.pending_divice){
          console.log("ja")
          if(pending_payment.type == "Cobro Dispositivo"){
            swal("Existe una ficha de pago pendiente","", {
              buttons: ["Continuar al pago", "Ver ficha de pago"],
            })
            .then((value) => {
              console.log(value);
              if(value){
                this.router.navigate([`/panel/ticket/dispositivo/pendiente/${this.object_id}`])
              }
            })
          } 
        }
      }
    })
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
        if(item.suburb == this.policy.suburb){
          this.policy.municipality = item.municipality;
          this.policy.federal_entity = item.state;
        }
      });
    }
    if(tipo=='shipping'){
      this.suburbs.shipping.forEach( item => {
        if(item.suburb == this.shipping.suburb){
          this.shipping.municipality = item.municipality;
          this.shipping.federal_entity = item.state;
        }
      });
    }
  }
  setCupon(){
    this.boolean_cupon=false;
    this.promotional_code = "";
    this.discount = 0.0;
    this.total = this.subtotal;
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
            if(data.promotion.kilometers!=this.kilometer_purchase.kilometers){
              valid=false;
            }
          }
          if(data.promotion.subscribable){
            this.boolean_subscription = true;
          }
          if(data.for_card){
            this.paymethod = "credit_card";
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
              this.discount+=(this.kilometer_purchase.cost*(data.promotion.discount/100));
          });
          this.total = this.subtotal - this.discount;
          this.promotional_code = this.cupon;
        }
        else {
          this.promotional_code = "";
          this.discount = 0.0;
          this.total = this.subtotal;
        }
        this.boolean_cupon = true;
      })
    }
  }
  setTotal(){
    this.total = this.subtotal - this.discount;
  }

  changeDevice(){
    let today = new Date();
    let payment = new Date(this.date_device);
    let days = (today.getTime()-payment.getTime())/(1000*60*60*24)
    let months = days/30;
    let total = this.device_price;
    this.subtotal = this.device_price;
    this.total = this.subtotal;
    this.months_price = 0;
    this.total = total;

    if(months<0){
      months = 0;
    }
    this.months_device = Math.floor(months);
    console.log(this.months_device)
    if(this.months_device>0) this.months_price = this.device_price*0.08;
    total += this.months_price;+
    console.log(this.months_price)
    if(this.months_device>1){
      for(let i=2; i<months; i++){
        total *= 1.08;
      }
      this.months_price = total-this.subtotal
      console.log(this.months_price)
    }
    
    this.total = total;
    console.log(this.total)
    
  }
  openpay(){
    let openpay = this.cartService.keysOpenpay();
    let angular_this = this;

    OpenPay.setId(openpay.id);
    OpenPay.setApiKey(openpay.apikey);
    OpenPay.setSandboxMode(openpay.sandbox);

    this.device_session_id = OpenPay.deviceData.setup();

    
    let sucess_callback = function (response){
        let card = {
          user_id: angular_this.user.id,
          token: response.data.id,
          device_session_id: angular_this.device_session_id 
        }
        console.log("card")
        console.log(card)
        angular_this.operatorsService.createCard(card)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.result){
            angular_this.cards.push(data.card)
            angular_this.card_id = data.card.id;
            angular_this.sendForm();
          }
          else{
            angular_this.loader.hide();
            swal("Hubo un problema",data.msg,"error");
          }
        });
    }
    let errorCallback = function (response){
      angular_this.loader.hide();
      console.log("RESPONSE ERROR");
      console.log(response);
      swal("No se pudo realizar el pago",response.data.description,"error")
    }
    if(this.card_id=="" && this.boolean_new_card){
      OpenPay.token.create({
          "card_number"    : angular_this.card.card_number,
          "holder_name"    : angular_this.card.holder_name,
          "expiration_year"  : angular_this.card.expiration_year,
          "expiration_month"  : angular_this.card.expiration_month,
          "cvv2"        : angular_this.card.cvv2
      },sucess_callback, errorCallback);
    }
    else{
      this.sendForm();
    }
  }
  setMSI(msi){
		this.policy.msi=msi;
	}
  onSubmit(){
    console.log(this.paymethod)
    this.loader.show();
    
    this.validateShipping();
    if(this.boolean_isCard){
      this.openpay();
    }
    else{
      this.sendForm();
    }
  }
  sendForm(){
    if(this.isCompra){
      this.sendFormCompra();
    }
    if(this.isRecarga){
      this.sendRecarga();
    }
    if(this.isSubscription){
      this.sendSubscription();
    }
    if(this.isDevice){
      console.log("pago de dispositivo")
      this.sendDevice();
    }
  }
  sendFormCompra(){
    let payment = {
      promotional_code: this.promotional_code,
      card_id: this.card_id,
      device_session_id: this.device_session_id,
      paymethod: this.paymethod,
      subscription: this.boolean_subscription,
      invoicing: this.boolean_invoicing,
      kilometer_purchase: this.kilometer_purchase,
      car: this.car,        
      shipping: this.shipping,
      billing: this.billing,
      policy: this.policy
    }
    console.log("Compra");
    console.log(payment);
    this.operatorsService.pay_quote(this.object_id,payment)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        localStorage.removeItem("cart_panel_"+this.object_id);
        //En caso de pagar con tarjeta de crédito
        if(this.boolean_isCard)
          this.router.navigate(['/panel/polizas']);
        else
          this.router.navigate([`/panel/ticket/compra/pendiente/${this.object_id}`])
          //this.router.navigate(['/panel/cotizaciones'])
      }
      else{
        this.loader.hide();
        swal("Hubo un problema al procesar pago",data.msg,"error")
      }
    });
  }
  sendRecarga(){
    let payment = {
      promotional_code: this.promotional_code,
      card_id: this.card_id,
      device_session_id: this.device_session_id,
      paymethod: this.paymethod,
      subscription: this.boolean_subscription,
      kilometer_purchase: this.kilometer_purchase 
    }
    console.log("Recarga")
    console.log(payment)
    this.operatorsService.recharge_policy(this.object_id,payment)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        this.loader.hide();
        this.payment_success = true;
        this.ficha_pago = {
          method: data.data.method,
          reference: data.data.reference,
          total: data.data.total,
          type: data.data.type,
          expires_at: data.data.expires_at,
          msg: data.msg,
          kilometer_purchase: this.kilometer_purchase 
        }
        console.log("pago", this.ficha_pago)
        /* this.router.navigate(['/panel/ticket/pago/recarga/'+this.object_id]) */
      }
      else{
        this.loader.hide();
        swal("Hubo un problema al procesar pago",data.msg,"error")
      }
    })

  }
  sendSubscription(){
    let payment = {
      promotional_code: this.promotional_code,
      monthly_payment_id: this.monthly_payment_id,
      card_id: this.card_id,
      device_session_id: this.device_session_id,
      paymethod: this.paymethod
    }
    console.log("Suscripcion")
    console.log(payment);
    this.operatorsService.membership_policy(this.object_id,payment)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        this.loader.hide();
        this.payment_success = true;
        this.ficha_pago = {
          method: data.data.method,
          reference: data.data.reference,
          total: data.data.total,
          type: data.data.type,
          expires_at: data.data.expires_at,
          msg: data.msg
        }
        console.log("pago", this.ficha_pago)
       /*  this.router.navigate(['/panel/poliza/editar/'+this.object_id]) */
      }
      else{
        this.loader.hide();
        swal("Hubo un problema al procesar pago",data.msg,"error")
      }
    })
  }
  sendDevice(){
    let payment = {
      card_id: this.card_id,
      device_session_id: this.device_session_id,
      paymethod: this.paymethod,
      amount: this.total
    }
    console.log(payment)
    this.operatorsService.paymentDevice(this.object_id, payment)
    .subscribe((data:any)=>{
      console.log(data)
      if(data.result){
        this.loader.hide();
        if(data.data.paid){
          swal(data.msg,"","success")
        }
        else {
          swal(data.msg,"","success")
        }
      }
      else{
        this.loader.hide();
        swal("Hubo un problema al procesar pago",data.msg,"error")
      }

    })

  }

  setLocalStorage(){
    let payment;
    if(this.isCompra){
      payment = {
        promotional_code: this.promotional_code,
        card_id: this.card_id,
        device_session_id: this.device_session_id,
        paymethod: this.paymethod,
        subscription: this.boolean_subscription,
        invoicing: this.boolean_invoicing,
        kilometer_purchase: this.kilometer_purchase,
        car: this.car,        
        shipping: this.shipping,
        billing: this.billing,
        policy: this.policy
      }
    }
    localStorage.setItem("cart_panel_"+this.object_id,JSON.stringify(payment));
    console.log(localStorage.getItem("cart_panel_"+this.object_id));
  }
  
}
