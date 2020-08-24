import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'; 
import { CartService } from '../../services/cart.service';
import { OperatorsService } from '../../services/operators.service';
import { LoaderService } from '../../services/loader.service';

import swal from 'sweetalert';
declare var OpenPay: any;

@Component({
  selector: 'app-cart4',
  templateUrl: './cart4.component.html',
  styleUrls: ['./cart4.component.scss']
})

export class Cart4Component implements OnInit {
  params: any;
  crack: any;
  name: any;
  firstSurName: any;
  lastSurName: any;
  email: any;
  userId: any;
  checkbox_terminos: boolean = false;
  total_cost: any = null;
  quotation:any;
  pago: string = "tarjeta";
  card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
  };
  card_id: any = "";
  device_session_id: any;
  cards: any;
  user: any;
  boolean_new_card: any;
  paymentId: any;



  constructor(private rutaActiva: ActivatedRoute, private cartService: CartService, private operatorsService: OperatorsService, private loader: LoaderService) { }

  ngOnInit() {
    this.params = this.rutaActiva
    this.crack = JSON.parse(atob(this.params.params.value.buf))
    this.name = this.crack.user.first_name
    this.firstSurName = this.crack.user.last_name
    this.lastSurName = this.crack.user.second_last_name
    this.email = this.crack.user.email
    this.userId = this.crack.user.id
    this.paymentId = this.crack.data.id
    console.log('this.params: ', this.params.params.value.buf)
    console.log('this.crack: ', this.crack)
  }


  onSubmit(){
    console.log('this.card: ', this.card)
    this.openpay()
    this.loader.show()
  }

  sendForm(){
    console.log('paso_100')
    const payload = {
      "card_id": this.card_id,
      "payment_id": this.paymentId,
      "secret_seference": this.device_session_id
    }
    this.operatorsService.sendPayCustom(payload).subscribe((data:any) => {
      this.loader.hide()
      swal(`${data.msg}!  

      ${data.data.msg}

      Monto: ${data.data.amount}.
      Número de autorización: ${data.data.authorization}.
      Número de referencia: ${data.data.secret_reference}.`);
    })
  }

  openpay(){
    let openpay = this.cartService.keysOpenpay();
    let angular_this = this;

    //OpenPay.setId(openpay.id);
    //OpenPay.setApiKey(openpay.apikey);
    //OpenPay.setSandboxMode(openpay.sandbox);

    OpenPay.setId('mdt4m9gkdvu9xzgjtjrk');
    OpenPay.setApiKey("pk_3670bc7e899241ad87ceffb49757979c");
    OpenPay.setSandboxMode(true);

    this.device_session_id = OpenPay.deviceData.setup();
    let sucess_callback = function (response){
        let card = {
          user_id: angular_this.userId,
          token: response.data.id,
          device_session_id: angular_this.device_session_id
        }
        console.log("card")
        console.log(card)
        angular_this.operatorsService.createCard(card)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.result){
            //angular_this.cards.push(data.card)
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
    if(this.card_id==""){
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

}
