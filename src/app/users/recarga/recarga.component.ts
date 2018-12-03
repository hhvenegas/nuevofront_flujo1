import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
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
import swal from 'sweetalert'
import { UsersService } from '../../services/users.service';
declare var OpenPay:any;

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.scss']
})
export class RecargaComponent implements OnInit {
  checkbox_factura: boolean = false;
  checkbox_suscription: boolean = false;
  checkbox_terminos: boolean = false;
  suscription: boolean = false;
  suburbs3: any = Array();
  car_id: any;
  car: any;
  package: any;
  stores: Store[];
  error_store: string ="";
  store:any="";
  store_selected: any;
  pago: string = "tarjeta";
  total_cost: any = null;
  cost_by_package: any;
  onlycard: boolean = false;
  card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
  }
  payment_method: any = "";
  monthly_payment_date:any;
  deviceIdHiddenFieldName:any="";
  token_openpay:     any = "";
  action:any = "";
  cost_by_suscription: number = 299;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private cartService: CartService, private hubspotService: HubspotService, private usersService: UsersService) { }

  ngOnInit() {
    this.car_id = this.route.snapshot.params['id_car'];
    this.action = this.route.snapshot.params['action'];
    this.monthly_payment_date = localStorage.getItem('date_monthlypayment')
    console.log(this.car_id)
    this.getInfoCar()
    this.getStores();
  }

  getInfoCar(){
    this.usersService.getCarBasic(this.car_id)
    .subscribe(
    (data:any)=> {
      this.car = data;
      console.log(this.car)
      this.getPackage()
      //this.get_packages()
    });
  }

  getPackage(){
    this.package = JSON.parse(localStorage.getItem('package'))
    this.cost_by_package = this.package.cost_by_package
    //console.log(this.package.cost_by_package)
  }

  changePayment(payment){
      this.store_selected = "";
      this.pago = payment;
      this.error_store = "";
  }
  
  getStores(): void {
    this.cartService.getStores()
      .subscribe(stores => this.stores = stores)
  }

  setStore(store_url){
    this.store_selected = store_url;
	  //this.store_selected = url;
    if(this.store == 'Oxxo'){
      this.payment_method = "oxxo_pay";
    }
    if(this.store != 'Oxxo'){
      this.payment_method = "openpay";
    }
  }

  changeSuscription(){
		if(this.checkbox_suscription) this.checkbox_suscription = false;
		else this.checkbox_suscription = true;
  }

  changeTerminos(){
		if(this.checkbox_terminos) this.checkbox_terminos = false;
		else this.checkbox_terminos = true;
  }

  errorCallback(response) {
    console.log("ERRORRRR");
  }

  
  onSubmit(){
    console.log(this.action)
    let active = true; 
    this.deviceIdHiddenFieldName = ""; 
    this.cost_by_package;
    this.token_openpay = "";

    if(this.pago=='tarjeta' && this.action == "recarga-kilometros"){
      this.payment_method = "card";
      this.openpay_card()
    }

    if(this.pago=='tarjeta' && this.action == "membresia" && this.checkbox_suscription == false){
      this.payment_method = "card";
     this.openpay_card_monthly()
    }

    if(this.pago=='tarjeta' && this.action == "membresia" && this.checkbox_suscription == true){
      this.payment_method = "card";
      this.openpay_card_recurrent()
    }
	
		if(this.pago=='efectivo'){
			if(this.store_selected==''){
				active = false;
				this.error_store = "Selecciona una tienda";
				$('body,html').stop(true,true).animate({
		            scrollTop: 0
            },1000);
			}
      else this.error_store = '';
    }
    
    if(active && this.pago!='tarjeta' && this.action == "recarga-kilometros"){
      this.sendForm();
    }

    if(active && this.pago!='tarjeta' && this.action == "membresia"){
      this.pay_monthly()
    }

    console.log(this.checkbox_suscription)

  }

  openpay_card(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.paymentCard();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card.holder_name,
      "expiration_year":this.card.expiration_year,
      "expiration_month": this.card.expiration_month,
      "cvv2":this.card.cvv2
    },sucess_callbak, this.errorCallback);

  }

  openpay_card_recurrent(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.openpay_card_pay_method_monthly_current();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card.holder_name,
      "expiration_year":this.card.expiration_year,
      "expiration_month": this.card.expiration_month,
      "cvv2":this.card.cvv2
    },sucess_callbak, this.errorCallback);

  }

  openpay_card_monthly(){
    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey('pk_3670bc7e899241ad87ceffb49757979c');
    OpenPay.setSandboxMode(true);
    //OpenPay.setId('mtpac6zng162oah2h67h');
    //OpenPay.setApiKey('pk_42af74150db6413692eb47624a1e903a');
    //OpenPay.setSandboxMode(false);
    this.deviceIdHiddenFieldName = OpenPay.deviceData.setup();
    let angular_this = this;
    var sucess_callbak = function (response){
      angular_this.token_openpay = response.data.id;
      angular_this.openpay_card_pay_method_monthly();
    }
    OpenPay.token.create({
      "card_number":this.card,
      "holder_name":this.card.holder_name,
      "expiration_year":this.card.expiration_year,
      "expiration_month": this.card.expiration_month,
      "cvv2":this.card.cvv2
    },sucess_callbak, this.errorCallback);
  }

  paymentCard(){
    console.log(this.card)
    if(this.action == "recarga-kilometros"){
      let json =  { "kilometer_purchase" : { "token_id": this.token_openpay,  "kilometers" : this.package.package}}
      this.usersService.pay_with_openpay_card(this.car_id, json).subscribe(
        (data:any)=>{
          console.log(data)
          this.router.navigate(["/user/ficha-recarga/"+this.car_id], { queryParams: { vigencia: this.package.vigency, forma_de_pago: 'tarjeta', total: this.package.cost_by_package, km: this.package.package } } );
        }
      )
    }
  }

  openpay_card_pay_method_monthly(){
    let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id, "deviceIdHiddenFieldName": this.deviceIdHiddenFieldName, "token_id": this.token_openpay}
    this.usersService.openpay_card_pay_method_monthly(json).subscribe(
      data => {
      console.log(data)
      this.router.navigate(["/user/ficha-pago/"+this.car_id], { queryParams: {  forma_de_pago: 'tarjeta', total: this.cost_by_suscription }} );
      }
    )
  }

  openpay_card_pay_method_monthly_current(){
    let json =  {"token_id": this.token_openpay, "deviceIdHiddenFieldName": this.deviceIdHiddenFieldName,  "monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id }
      this.usersService.openpay_card_pay_method_monthly_current(json).subscribe(
        (data: any) => {
          console.log(data)
          swal('Tu subscripción a los pagos recurrentes fue exitosa','Felicidades tu subscripción fue exitosa, tus cargos de mensualidad se realizaran automaticamente de forma mensual','success')
        },
        (error: any) => {
          swal('Tu subscripción a los pagos recurrentes fue rechazada','La operación de subscripción con esta tarjeta fue rechazado','error')
        }
      )
  }

  pay_monthly(){
    console.log(this.store_selected)
    //Pago de membresia
    if(this.pago == 'efectivo' && this.store_selected == "oxxo"){
      this.payment_method = 'oxxo_pay'
      let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}      
      this.usersService.pay_with_oxxo_monthly(json).subscribe(
        data => {
        console.log(data)
        this.router.navigate(["/user/ficha-pago/"+this.car_id], { queryParams: { referencia: data["monthly_payment"]["oxxo_barcode"], forma_de_pago: this.store_selected , total: this.cost_by_suscription} } );
        }
      )
    }

    if(this.pago == 'efectivo' && this.store_selected != "oxxo"){
      this.payment_method = "openpay"
      let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}
      this.usersService.pay_with_openpay_store_monthly(json).subscribe(
        data => {
        console.log(data)
        this.router.navigate(["/user/ficha-pago/"+this.car_id], { queryParams: { referencia: data["banorte_reference"], forma_de_pago: this.store_selected , total: this.cost_by_suscription} } );
        }
      )
    }  

    if(this.pago=='spei'){
      this.payment_method = "spei_pay";
      let json =  {"monthly_payment_id": this.car.policy.get_monthly_payments[this.car.policy.get_monthly_payments.length - 1].id}
      this.usersService.pay_with_spei_monthly(json).subscribe(
        data => {
          console.log(data)
          $("#idModalFichaPago").modal("hide");
          this.router.navigate(["/user/ficha-pago/"], { queryParams: { referencia: data["monthly_payment"]["spei_clabe"], forma_de_pago: "spei" , total: 299} } );
        }
      )
    }  

    console.log(this.payment_method)
  }

  sendForm(){
    if(this.pago == 'efectivo' && this.store_selected == "oxxo"){
      this.payment_method = 'oxxo_pay'
      let json =  {"kilometer_purchase" : {"kilometers" : this.package.package, "increment_for_kilometers_purchased" : "", "cost":this.package.cost_by_package, "total": this.package.cost }, "pay_with_oxxo":"", "paymethod": this.payment_method ,"Aceptar":"on", "group1":"on",  "car_id": this.car_id}
      this.usersService.pay_with_oxxo(this.car_id, json).subscribe(
        (data:any)=>{
          console.log(data)
          this.router.navigate(["/user/ficha-recarga/"+this.car_id], { queryParams: { referencia: data["oxxo_barcode"], forma_de_pago: "oxxo" , total: this.package.cost_by_package, km: this.package.package } } );
        }
      )
    }

    if(this.pago == 'efectivo' && this.store_selected != "oxxo"){
      this.payment_method = "openpay"
      let json =  {"kilometer_purchase" : {"paymethod": this.payment_method , "kilometers" : this.package.package, "increment_for_kilometers_purchased" : "", "cost": this.package.cost_by_package, "total": this.package.cost_by_package},  "car_id": this.car_id}
      this.usersService.pay_with_openpay_store(this.car_id, json).subscribe(
        (data:any)=>{
          console.log(data)
          this.router.navigate(["/user/ficha-recarga/"+this.car_id], { queryParams: { referencia: data["banorte_reference"], forma_de_pago: this.store_selected, total: this.package.cost_by_package, km: this.package.package } } )
        }
      )
    }

    if(this.pago=='spei'){
      this.payment_method = "spei_pay";
      let json =  {"kilometer_purchase" : {"paymethod": this.payment_method , "kilometers" : this.package.package, "increment_for_kilometers_purchased" : "", "cost": this.package.cost_by_package, "total": this.package.cost_by_package}, "pay_with_spei":"", "car_id": this.car_id}
      this.usersService.pay_with_spei(this.car_id, json).subscribe(
        (data:any)=>{
          console.log(data)
          this.router.navigate(["/user/ficha-recarga/"+this.car_id], { queryParams: { referencia: data["spei_clabe"], forma_de_pago: "spei" , total: this.cost_by_package, km: this.package.package } } );
        }
      )
    }
    console.log(this.payment_method)
  }
}