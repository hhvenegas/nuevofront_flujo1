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
import { LoginService } from '../../services/login.service';
import { LoaderService } from '../../services/loader.service';

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-panelpolicies',
  templateUrl: './panelpolicies.component.html',
  styleUrls: ['./panelpolicies.component.scss']
})
export class PanelpoliciesComponent implements OnInit {
  seller:any;
  policies_info: any = {
    page: 1,
    total: 0,
    seller_id: "",
    policy_states: Array(),
    km_states: Array(),
    membership_states: Array(),
    seller_states: Array(),
    device_states: Array("unassigned"), 
    vin_states: Array(),
    search: "",
  }
  policies: any = Array();
  tracking:any ={
    id: 0,
    type: 1,
    future_call:false ,
    date: "",
    time:""
  }
  tracking_options: any = {
    departments: Array(),
    department: Array(),
    tracking_call_results: Array(),
    tracking_call_types: Array()
  }
  tracking_customer: any = {
    customer_tracking: {
      customer_id: 0,
      policy_id: 0,
      department: "",
      close_reason: "",
      coment: ""
    },
    tracking_call: {
      reason: "",
      assigned_user_id: 0,
      scheduled_call_date: "",
      result: "",
      note: "",
      call_type: ""
    }
  }
  sellers: any=Array();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService) { }
  
  ngOnInit() {
    //Push.create('Hello World!')
    this.seller = this.loginService.getSession();
    this.operatorsService.getSellers()
    .subscribe((data:any)=>{
      if(data.result)
      this.sellers= data.sellers;
    })
    if(this.seller.rol<3) this.policies_info.seller_id=this.seller.id;
    this.getPolicies();
    this.operatorsService.getTrackingOptions()
    .subscribe((data:any)=>{
      if(data.result){
        this.tracking_options.departments = data.data.departments 
        this.tracking_options = {
          departments: data.data.departments,
          department: data.data.departments[0],
          tracking_call_results: data.data.tracking_call_results ,
          tracking_call_types: data.data.tracking_call_types
        }
      }

    })
  }

  getPolicies(){
    this.loader.show();
    this.operatorsService.getPolicies(this.policies_info)
    .subscribe((data:any)=>{
      console.log(data)
      this.policies=data.policies;
      this.loader.hide();
    });
  }
  searchPolicies(){}
  setCustomerTracking(type,policy,tracking_id=null){
    this.tracking.type = type;
    this.tracking.id=tracking_id;
    this.tracking_customer.customer_tracking.customer_id = policy.user.id;
    this.tracking_customer.customer_tracking.policy_id = policy.id;
    
  }
  changeDepartment(event: any){
    //console.log(event);
    let index = event.target.options.selectedIndex;
    this.tracking_options.department= this.tracking_options.departments[index];

  }
  changeRadio(){
    this.tracking.future_call = !this.tracking.future_call;
    this.tracking.data="";
    this.tracking.time="",
    this.tracking_customer.customer_tracking.close_reason="";
  }

  createTrackingCustomer(){
    this.tracking_customer.tracking_call.scheduled_call_date = this.tracking.date+" "+this.tracking.time;
    console.log(this.tracking_customer);
    if(this.tracking.type==1 && !this.tracking.future_call){
      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          swal(data.msg,"","success");
          this.getPolicies();
        }
      })
    }
    if(this.tracking.type==1 && this.tracking.future_call){
      let new_call = { 
        tracking_call: {
          topic: this.tracking_customer.tracking_call.topic,
          call_type: this.tracking_customer.tracking_call.call_type,
          assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
          scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
          result: "",
          note: ""
        }
      }
      this.tracking_customer.tracking_call.scheduled_call_date = "";
      this.tracking_customer.tracking_call.assigned_user_id = this.seller.id;

      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.operatorsService.createTrackingCall(data.customer_tracking.id,new_call)
          .subscribe((data2:any)=>{
            console.log(data2);
            if(data2.result){
              $("#modalSeguimiento").modal("hide");
              this.getPolicies();
              swal("Llamada registrada correctamente","","success")
              
            }
            else swal(data2.msg,"","error");
          })
        }
      })
    }
    if(this.tracking.type==2){
      console.log("2");
      let call_made:any;
      if(!this.tracking.future_call){
        call_made = { 
          tracking_call: {
            result: this.tracking_customer.tracking_call.result,
            note: this.tracking_customer.tracking_call.note
          },
          close_tracking: true,
          customer_tracking: {
            close_reason: this.tracking_customer.customer_tracking.close_reason,
            comment: this.tracking_customer.customer_tracking.coment
          }
        }
      }
      else{
        call_made = { 
          tracking_call: {
            result: this.tracking_customer.tracking_call.result,
            note: this.tracking_customer.tracking_call.note
          }
        }
      }

     console.log(call_made)
     this.operatorsService.createTrackingCallMade(this.tracking.id,call_made)
     .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          if(this.tracking.future_call){
            let new_call = { 
              tracking_call: {
              topic: this.tracking_customer.tracking_call.topic,
              call_type: this.tracking_customer.tracking_call.call_type,
              assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
              scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
              result: "",
              note: ""
              }
            }
            this.operatorsService.createTrackingCall(this.tracking.id,new_call)
            .subscribe((data:any)=>{
              console.log(data);
              if(data.result){
                $("#modalSeguimiento").modal("hide");
                swal("Llamada registrada correctamente","","success")
              }
              else swal(data.msg,"","error");
            })
          }
          else {
            $("#modalSeguimiento").modal("hide");
            this.getPolicies();
            swal("Seguimiento cerrado correctamente","","success")
          }
        }
      }) 
    }
  }
}
