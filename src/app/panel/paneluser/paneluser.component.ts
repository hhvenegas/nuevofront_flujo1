import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { CartService} from '../../services/cart.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Seller } from '../../constants/seller';

declare var $:any;
import swal from 'sweetalert';
declare var OpenPay: any;

@Component({
  selector: 'app-paneluser',
  templateUrl: './paneluser.component.html',
  styleUrls: ['./paneluser.component.scss']
})
export class PaneluserComponent implements OnInit {
	user_id: any = "";
	user: any = {
		user: {
        	avatar: null,
        	first_name: "",
	        last_name: "",
	        last_name_two: "",
	        email: "",
	        phone: "",
	        password: "",
	        password_confirmation: "",
	        nip: ""
	    },
	    personal: {
	        street: "",
	        ext_number: "",
	        int_number: "",
	        suburb: "",
	        locality: "",
	        municipality: "",
	        zip_code: "",
	        federal_entity: ""
	    }
	};
	avatar:any = Array();
	img:any;
	cards: any = Array();
	card_delete: any =Array();
	card_suscription: any = Array();
	subscription_id: any = "";
	policy_id: any = "";
	email_user: any = {
		user_id_old: this.user_id,
		user_id_new: "",
		user_email_new: "",
		password: "",
		users: Array()
	}
	card: any = {
		card_number: "",
		holder_name: "",
		expiration_year: "",
		expiration_month: "",
		cvv2: ""
	}
	subscriptions: any = Array();
	policies: any = Array();
	policies_subscriptions: any = Array();
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private userService: UsersService, private cartService: CartService) { }
	ngOnInit() {
		this.user_id = this.route.snapshot.params['user_id'];
		this.userService.getEditableInfo(this.user_id)
		.subscribe((data:any)=>{
			if(data.result){
				this.user= {
					user: {
			        	avatar: null,
			        	first_name: data.data.user.first_name,
				        last_name: data.data.user.last_name,
				        last_name_two: data.data.user.last_name_two,
				        email: data.data.user.email,
				        phone: data.data.user.phone,
				        password: null,
				        password_confirmation: null,
				        nip: null
				    },
				    personal: {
				        street: data.data.personal.street,
				        ext_number: data.data.personal.ext_number,
				        int_number: data.data.personal.int_number,
				        suburb: data.data.personal.suburb,
				        locality: data.data.personal.locality,
				        municipality: data.data.personal.municipality,
				        zip_code: data.data.personal.zip_code,
				        federal_entity: data.data.personal.federal_entity
				    }
				}

				this.avatar = data.data.user.avatar;

				console.log(data);
			}
		})
		this.getCards();
		this.getPolicies();
		this.userService.getSubscriptions(this.user_id)
		.subscribe((data:any)=>{
			if(data.result){
				this.subscriptions = data.subscriptions;
			}
		});

		
	}
	onSubmit(){
	  	console.log(this.user);
	  	this.spinner.show();
	  	this.userService.updateUserInfo(this.user_id,this.user)
	  	.subscribe((data:any)=>{
	  		console.log(data);
	  		this.spinner.hide();
	  		if(data.result){
	  			this.user.user.password = null;
	  			this.user.user.password_confirmation = null;
	  			this.user.user.nip = null;
	  			swal("La información se ha guardado exitosamente","","success");
	  		}
	  		else swal("No se pudo guardar la información","","error")
	  	})
	}
	getPolicies(){
		this.userService.getPoliciesByIdUser(this.user_id)
		.subscribe((data:any)=>{
			if(data.result){
				this.policies = data.data;
			}
		});
	}
	getCards(){
		this.userService.getCards(this.user_id)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.result){
				this.cards = data.cards;
			}
		});
	}
	
	changeEmail(){
		if(this.email_user.user_id_new==""){
			this.operatorsService.validateUser(this.email_user.user_email_new)
			.subscribe((data:any)=>{
			  console.log(data);
			  if(data.result){
				//document.getElementById("loading").style.display="none";
				this.email_user.users = data.data;
				swal("El correo  ya existe","Selecciona el correo de usuario existente","warning");
			  }
			  else {
				this.sendChangeEmail();
			  }
			})
		  }
		  else this.sendChangeEmail();
	}
	sendChangeEmail(){
		let user = {
			new_user_id: this.email_user.user_id_new,
			email: this.email_user.user_email_new,
			policy_id: null
		}
		if(this.email_user.user_id_new!=""){
			user.email = null;
		}
		console.log(this.email_user);
		console.log(user);
		this.operatorsService.changeUserEmail(this.user_id,user)
		.subscribe((data:any)=>{
			console.log(data);
			$("#modalChangeUser").modal("hide");
			//document.getElementById("loading").style.display="none";
			if(data.result){
				swal("Se ha cambiado correctamente el correo de la póliza","","success");
				this.router.navigate(['/panel/user/'+data.data.user.id]);
			}
			else swal("Hubo un problema","No se pudo cambiar el correo","error");
		})
	}

  	changePassword(){
	  	if(this.user.user.password!=this.user.user.password_confirmation){
	  		swal("No se pudo cambiar la contraseña","No coinciden las contraseñas, inténtalo de nuevo","error");
	  		this.user.user.password = null;
	  		this.user.user.password_confirmation = null;
	  	}
	  	else{
	  		$("#modalPassword").modal("hide");
	  		this.onSubmit();
	  	}
	}

  	changeNip(){
  		$("#modalNip").modal("hide");
  		this.onSubmit();
  	}

  	changeAvatar(files: FileList){
  		console.log(files);
  	}
  	changeListener($event) : void {
	  this.readThis($event.target);
	}

	readThis(inputValue: any): void {
	  var file:File = inputValue.files[0];
	  var myReader:FileReader = new FileReader();

	  myReader.onloadend = (e) => {
	    let img:any = myReader.result;
	    let ext:any ="";

	    this.img = img.split("base64,");
	    ext = this.img[0].split("image/");
	    
	    this.user.user.avatar = {
	    	data: this.img[1],
        	ext: ext[1].slice(0, -1)
	    }
	  }
	  myReader.readAsDataURL(file);

	  //console.log(myReader);
	}

	setCardDelete(card){
		this.card_delete = card;
	}
	deleteCard(){
		let i = 0;
		$("#modalDeleteCard").modal("hide");
		this.userService.deleteCard(this.card_delete.id)
		.subscribe((data:any)=>{
			if(data.result){
				this.cards.forEach(
					item =>{
						if(item.id==this.card_delete.id){
							if(this.cards.splice(i, 1))
								swal("La tarjeta se ha eliminado correctamente","","success")
						}
					}
				)
			}
			else swal("La tarjeta no se ha eliminado correctamente","","error")
		})
	}
	setCardSuscription(tipo,card){
		this.card_suscription = card;
		this.subscription_id = "";
		this.policy_id = "";
		this.policies_subscriptions = Array();
		this.userService.getPoliciesByIdUser(this.user_id)
		.subscribe((data:any)=>{
			if(data.result){
				this.policies = data.data;
				this.policies.forEach(item => {
					let boolean = false;
					this.subscriptions.forEach(element => {
						if(item==element.policy_id )
							boolean = true;
						if(tipo=='eliminar' && element.card.id!=this.card_suscription.id)
							boolean = true;
					});
					if(!boolean){
						this.policies_subscriptions.push(item);
					}
				});
			}
		});
		
		
		console.log(this.policies_subscriptions);
	}
	cancelSubscription(){
		console.log("ID: "+this.subscription_id)
		console.log(this.card_suscription);
		$("#modalCancelSuscription").modal("hide");
		this.userService.deleteSubscriptions(this.subscription_id)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.result){
				this.userService.getCards(this.user_id)
				.subscribe((data2:any)=>{
					if(data){
						swal("Se ha cancelado suscripción correctamente","","success");
					}
					if(data2.result){
						this.subscriptions = data2.subscriptions;
					}
				});
			}
			else{
				swal("Hubo un problema","No se pudo cancelar la suscripción","error");
			}
		})
	}
	createSubscription(){
		let subscription = {
			user_id: +this.user_id,
			policy_id: +this.policy_id,
			card_id: +this.card_suscription.id
		}
		console.log(subscription);
		$("#modalCreateSubscription").modal("hide");
		this.userService.createSubscriptions(subscription)
		.subscribe((data:any)=>{
			console.log(data);
			if(data.result){
				this.userService.getCards(this.user_id)
				.subscribe((data2:any)=>{
					if(data.result){
						if(data.subscription.active)
							swal("Se ha creado la suscripción correctamente","","success");
					}
					if(data2.result){
						this.subscriptions = data2.subscriptions;
					}
				});
			}
			else{
				swal("Hubo un problema","No se pudo crear la suscripción","error");
			}
		})
	}
	
	createCard(){
		$("#modalCreateCard").modal("hide");
		let card: any = {
			user_id: this.user_id,
			token: "",
			device_session_id: ""
		}
		let openpay:any;

		if(this.cartService.modeProd) openpay = this.cartService.openpay_prod;
		else openpay = this.cartService.openpay_sandbox;
		
		OpenPay.setId(openpay.id);
		OpenPay.setApiKey(openpay.apikey);
		OpenPay.setSandboxMode(openpay.sandbox);
	
		card.device_session_id = OpenPay.deviceData.setup();
	
	
		let angular_this = this;
		let sucess_callback = function (response){
			card.token = response.data.id,
				
			angular_this.operatorsService.createCard(card)
			  .subscribe((data:any)=>{
				console.log(data);
				if(data.result){
				  angular_this.cards.push(data.card)
				}
				swal("La tarjeta se ha agregado correctamente","","success")
			})
		}
		let errorCallback = function (response){
		  swal("Hubo un problema","No se pudo guardar la tarjeta","error")
		}
		OpenPay.token.create({
			"card_number"    : angular_this.card.card_number,
			"holder_name"    : angular_this.card.holder_name,
			"expiration_year"  : angular_this.card.expiration_year,
			"expiration_month"  : angular_this.card.expiration_month,
			"cvv2"        : angular_this.card.cvv2
		  },sucess_callback, errorCallback);
	}

}
