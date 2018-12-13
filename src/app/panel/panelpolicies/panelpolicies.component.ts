import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
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
import { LoginService } from '../../services/login.service';

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-panelpolicies',
  templateUrl: './panelpolicies.component.html',
  styleUrls: ['./panelpolicies.component.scss']
})
export class PanelpoliciesComponent implements OnInit {
  policies_info: any = {
    page: 1,
    seller_id: "",
    policy_states: Array(),
    km_states: Array(),
    membership_states: Array(),
    seller_states: Array(),
    device_states: Array(), 
    vin_states: Array(),
    search: "",
  }
  policies: any = Array();
  pagination: any = Array();
  filters: any = Array();
  date_today: any = new Date();
  sellers: Seller[];
  devices:any=Array();
  policy_assign_seller: any = {
    policy_id: "",
    seller_id: ""
  }
  policy_device: any = {
    policy_id: "",
    device_id: "",
    imei: ""
  }
  policy_delete: any = {
    policy_id: "",
    sxkm_id: "",
    password: "",
    reason: ""
  }
  policy_user:any = {
    policy_id: "",
    sxkm_id: "",
    user_id_old: "",
    email_old: "",
    user_id_new: "",
    email_new: "",
    users: Array(),
    password: ""
  }
  seller: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService) { }

  ngOnInit() {
    this.seller = this.loginService.getSession();
    console.log(this.seller)
    this.filters.push('');
    this.searchPolicies();
    //Se traen los vendedores
		this.operatorsService.getSellers()
    .subscribe((data:any)=>{
      console.log(data)
      if(data.result)
        this.sellers = data.sellers;
      console.log(this.sellers);
    });
    
  }
  searchPolicies(){
    this.spinner.show();
    this.policies = Array();
    if(this.seller.rol==2 && this.policies_info.search==''){
      this.policies_info.seller_id = this.seller.id
    } else this.policies_info.seller_id = "";
    console.log(this.policies_info)

    this.operatorsService.getPolicies(this.policies_info)
      .subscribe((data:any)=>{
        console.log(data);
        this.policies = data.policies;
        
        this.policies.forEach(element => {
					element.pending_payments = null;
					this.operatorsService.getPendingPaymentsPolicy(element.id)
					.subscribe((data2:any)=>{
						if(data2.result && data2.data.length>0){
							element.pending_payments = data2.data;
						}
					})
				});
        this.pagination = this.paginationService.getPager(data.pages,this.policies_info.page,10)
        this.spinner.hide();
        //document.getElementById("loading").style.display="none";
      })
  }
  setPagination(page){
    this.policies_info.page = page;
    this.searchPolicies();
  }
  setFilters(){
    let policy_states = Array();
    let km_states = Array();
    let membership_states = Array();
    let seller_states = Array();
    let device_states  = Array(); 
    let vin_states = Array();
    /**this.filters.forEach(element => {
      let filter = element.split(',');
      if(filter[0]=='policy_states')
        policy_states.push(filter[1]);
      if(filter[0]=='km_states')
        km_states.push(filter[1]);
      if(filter[0]=='membership_states')
        membership_states.push(filter[1]);
      if(filter[0]=='seller_states')
        seller_states.push(filter[1]);
      if(filter[0]=='device_states')
        device_states.push(filter[1]);
      if(filter[0]=='vin_states')
        vin_states.push(filter[1]);
    });**/

      let filter = this.filters.split(',');
      if(filter[0]=='policy_states')
        policy_states.push(filter[1]);
      if(filter[0]=='km_states')
        km_states.push(filter[1]);
      if(filter[0]=='membership_states')
        membership_states.push(filter[1]);
      if(filter[0]=='seller_states')
        seller_states.push(filter[1]);
      if(filter[0]=='device_states')
        device_states.push(filter[1]);
      if(filter[0]=='vin_states')
        vin_states.push(filter[1]);

    this.policies_info.policy_states = policy_states;
    this.policies_info.km_states = km_states;
    this.policies_info.membership_states = membership_states;
    this.policies_info.seller_states = seller_states;
    this.policies_info.device_states = device_states;
    this.policies_info.vin_states = vin_states;
    this.searchPolicies();
  }

  setPolicyAssignSeller(policy_id, seller_id){
    if(seller_id==null) seller_id= "";
    this.policy_assign_seller = {
      policy_id:policy_id,
      seller_id:seller_id
    }

  }
  changeSeller(){
    let full_name="";
		let seller_id=this.policy_assign_seller.seller_id;
    console.log(this.policy_assign_seller);
    this.operatorsService.updateSellerPolicy(this.policy_assign_seller.policy_id,this.policy_assign_seller.seller_id)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.sellers.forEach(
            item => {
              if(item.id==this.policy_assign_seller.seller_id){
                full_name = item.full_name;
                seller_id = item.id;
              } 
            }
          );
          console.log("Nombre: "+full_name);
          this.policies.forEach(
            item => {
              if(item.id==this.policy_assign_seller.policy_id){
                if(item.seller){
                  item.seller.id = seller_id;
                  item.seller.full_name = full_name;
                } 
                else{
                  item.seller = {
                    id: seller_id,
                    full_name: full_name
                  }
                }
                
                swal("Se ha cambiado al vendedor correctamente", "", "success");
              } 
            }
          );
        }
        else swal("No se pudo asignar al vendedor ", "", "error");
      })
  }

  setDevice(policy_id, device_id,imei){
    this.devices = Array();
    this.policy_device = {
      policy_id: policy_id,
      device_id: device_id,
      imei: imei
    }
    
  }
  changeDevice(){
    this.operatorsService.searchDevice(this.policy_device.imei)
      .subscribe((data:any)=>{
        console.log(data);
        let bool = false;
        data.devices.forEach(element => {
          if(element.imei==this.policy_device.imei){
            bool = true;
            if(element.status=='in_stock'){
              this.policy_device.device_id = element.id;
              this.operatorsService.updateDevicePolicy(this.policy_device)
              .subscribe((data:any)=>{
                if(data.result){
                  this.policies.forEach(
                    item => {
                      if(item.id==this.policy_device.policy_id){
                        item.device.id = this.policy_device.device_id;
                        item.device.imei = this.policy_device.imei;
                        item.device.assigned = true;
                        swal("El dispositivo se asigno correctamente ", "", "success");
                      } 
                    }
                  );
                }
                else swal("No se pudo asignar el dispositivo ", "El dispositivo se encuentra asignado", "error");
              })
              
            }
            else swal("No se pudo asignar el dispositivo ", "El dispositivo se encuentra asignado", "error");
          }
        });
        if(!bool) swal("No se pudo asignar el dispositivo ", "", "error");
    })
  }

  setPolicyDelete(policy_id,sxkm_id){
    this.policy_delete = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      password: "",
      reason: ""
    }
  }
  deletePolicyModal(){
    this.spinner.show();
    this.operatorsService.validatePassword(this.seller.id,this.policy_delete.password)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){    
        this.operatorsService.cancelPolicy(this.policy_delete.policy_id)
          .subscribe((data:any)=>{
            console.log(data)
            $("#modalCancelPolicy").modal("hide");
            this.spinner.hide();
            if(data.result){
              this.policies.forEach(element => {
                if(element.id==this.policy_delete.policy_id)
                element.status = 'canceled';
              });
              swal("Se ha cancelado la póliza correctamente", "", "success");
            }
            else swal("Hubo un problema", "No se pudo cancelar la póliza "+this.policy_delete.policy_id, "error");
          })    
      }
      else{
        this.spinner.hide();
        $("#modalCancelPolicy").modal("hide");
        swal("No se pudo cancelar la póliza","La contraseña es incorrecto","error");
      }
    })
  }

  setPolicyChangePolicyUser(policy_id, sxkm_id,user_id_old,email_old){
    this.policy_user = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      user_id_old: user_id_old,
      email_old: email_old,
      user_id_new: "",
      email_new: "",
      users: Array()
    }
  }
  updateChangePolicyUser(){
    //this.spinner.show();//
    document.getElementById("loading").style.display="show";
    this.operatorsService.validatePassword(this.seller.id,this.policy_delete.password)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        if(this.policy_user.user_id_new==""){
          this.operatorsService.validateUser(this.policy_user.email_new)
          .subscribe((data:any)=>{
            console.log(data);
            if(data.result){
              document.getElementById("loading").style.display="none";
              this.policy_user.users = data.data;
              swal("El correo  ya existe","Selecciona el correo de usuario existente","warning");
            }
            else {
              this.changeUserPolicy();
            }
          })
        }
        else this.changeUserPolicy();
      }
      else{
        swal("No se pudo cambiar el correo","La contraseña ingresada no es correcta inténtalo de nuevo","error");
      }
    });
    
  }

  changeUserPolicy(){
    
    let user = {
      new_user_id: +this.policy_user.user_id_new,
	    email: this.policy_user.email_new,
	    policy_id: this.policy_user.policy_id
    }
    if(this.policy_user.user_id_new!="") user.email="";
    console.log(this.policy_user)
    console.log(user);
     
    this.operatorsService.changeUserEmail(this.policy_user.user_id_old,user)
    .subscribe((data:any)=>{
      console.log(data);
      $("#modalChangeUser").modal("hide");
      document.getElementById("loading").style.display="none";
      if(data.result){
        this.policies.forEach(
          item => {
            if(item.id==this.policy_user.policy_id){
              item.user = data.data.user;
            }
          }
        );
        swal("Se ha cambiado correctamente el correo de la póliza","","success");
      }
      else swal("Hubo un problema","No se pudo cambiar el correo","error");
    })
    
  }
}
