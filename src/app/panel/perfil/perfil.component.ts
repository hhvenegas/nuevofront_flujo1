import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { CartService} from '../../services/cart.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { LoginService } from '../../services/login.service';
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
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  seller: any = Array();
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
	        /* locality: "", */
	        municipality: "",
	        zip_code: "",
	        federal_entity: ""
	    }
	};
	avatar:any = Array();
	img:any;
	email_user: any = {
		user_id_old:"",
		user_id_new: "",
		user_email_new: "",
		password: "",
		users: Array()
	}
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private userService: UsersService, private cartService: CartService, private loginService: LoginService) { }
	ngOnInit() {
    this.seller = this.loginService.getSession();
    console.log("SELLERRRRR")
    console.log(this.seller)
    this.email_user.user_id_old = this.seller.id;

		this.userService.getEditableInfo(this.seller.id)
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
				        /* locality: data.data.personal.locality, */
				        municipality: data.data.personal.municipality,
				        zip_code: data.data.personal.zip_code,
				        federal_entity: data.data.personal.federal_entity
				    }
				}

				this.avatar = data.data.user.avatar;

				console.log(data);
			}
		})
	
		

		
	}
	onSubmit(){
			console.log("vendedor", this.seller);
			console.log(this.user)
	  	this.spinner.show();
	  	this.userService.updateUserInfo(this.seller.id,this.user)
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
		this.operatorsService.changeUserEmail(this.seller.id,user)
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

	
	


}
