import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
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
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private userService: UsersService) { }
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

				this.avatar = data.data.avatar;

				console.log(this.user)
			}
		})

		
	}
  
  onSubmit(){
  	console.log(this.user);
  	this.spinner.show();
  	this.userService.updateUserInfo(this.user_id,this.user)
  	.subscribe((data:any)=>{
  		console.log(data);
  		this.spinner.hide();
  		if(data.result){
  			swal("La información se ha guardado exitosamente","","success")
  		}
  		else swal("No se pudo guardar la información","","error")
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
	    console.log(this.img[0]);
	    ext = this.img[0].split("image/");
	    
	    this.user.user.avatar = {
	    	data: this.img[1],
        	ext: ext[1]
	    }

	  }
	  myReader.readAsDataURL(file);

	  //console.log(myReader);
	}

}
