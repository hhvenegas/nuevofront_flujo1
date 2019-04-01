import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-perfiluser',
  templateUrl: './perfiluser.component.html',
  styleUrls: ['./perfiluser.component.scss']
})
export class PerfiluserComponent implements OnInit {
  user: any = {
		user: {
        	avatar: null,
        	first_name: "",
	        last_name: "",
	        last_name_two: "",
	        email: "",
          phone: "",
          password: "",
	        new_password: "",
	        password_confirmation: "",
          nip: "",
          new_nip:"",
          nip_confirmation:""
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
  user_id: any;
  constructor(private userService: UsersService,private spinner: NgxSpinnerService){
  }

  ngOnInit() {
    this.getInfoUser()
  }
  
  getInfoUser(){
    this.userService.getPersonalInfo().subscribe(
      (data:any)=> {
        console.log(data)
        this.user_id = data.address.user_id
        this.getEditableInfo()
    })
  }

  getEditableInfo(){
    this.userService.getEditableInfo(this.user_id).subscribe(
      (data:any)=>{
      console.log("EDITABLE", data)
      if(data.result){
        this.user_id = data.data.user.id
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

  changePassword(){
    //this.confirmNewPassword()
    if(this.user.user.new_password == this.user.user.password_confirmation){
      let data = {
        "current_password": this.user.user.password,
        "new_password": this.user.user.new_password
      }
      this.userService.updatePassword(data).subscribe(
        (data:any)=>{
          console.log(data)
          swal("La información se ha guardado exitosamente","","success");
        },
        (error:any)=>{
          console.log(error)
          swal("No se pudo guardar la información","","error")
        }  
      )
    }else{
      swal("No se pudo cambiar la contraseña","No coinciden las contraseñas, inténtalo de nuevo","error");
    }
    $("#modalPassword").modal("hide");
  }

  changeNip(){
    //this.confirmNewPassword()
    if(this.user.user.new_nip == this.user.user.nip_confirmation){
      let data = {
        "current_nip": this.user.user.nip,
        "new_nip": this.user.user.new_nip
      }
      this.userService.updateNip(data).subscribe(
        (data:any)=>{
          console.log(data)
          swal("La información se ha guardado exitosamente","","success");
        },
        (error:any)=>{
          console.log(error)
          swal("No se pudo guardar la información","","error")
        }  
      )
    }else{
      swal("No se pudo cambiar el nip","No coinciden el nuevo nip, inténtalo de nuevo","error");
    }
    $("#modalNip").modal("hide");
  }


}
