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
  filters: any ="device_states,unassigned";
  policies_info: any = {
    page: 1,
    pages:1,
		pagination: Array(),
    total: 0,
    seller_id: "",
    policy_states: "",
    km_states: "",
    membership_states: "",
    seller_states: "",
    device_states: "unassigned",
    vin_states: "",
    search: "",
    from_date: "",
    to_date:""
  }
  policies: any = Array();
  tracking:any ={
    id: 0,
    type: 1,
    future_call:false ,
    date: "",
    time:"",
    customer_tracking:Array()
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
    
    this.initPolicies();
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
  initPolicies(){
    if(localStorage.getItem("policies_info")){
			let policies_info= JSON.parse(localStorage.getItem("policies_info"));
			console.log("localstorage");
			console.log(policies_info);

			this.policies_info = {
        page: policies_info.page,
        pages:policies_info.pages,
        pagination: Array(),
        total: policies_info.total,
        seller_id: policies_info.seller_id,
        policy_states: policies_info.policy_states,
        km_states: policies_info.km_states,
        membership_states: policies_info.membership_states,
        seller_states: policies_info.seller_states,
        device_states: policies_info.device_states,
        vin_states: policies_info.vin_states,
        search: policies_info.search,
        from_date: policies_info.from_date,
        to_date:policies_info.to_date
      }
			if(this.policies_info.policy_states!='')	
				this.filters = "policy_states,"+this.policies_info.policy_states;
			if(this.policies_info.km_states!='')	
        this.filters = "km_states,"+this.policies_info.km_states;
      if(this.policies_info.membership_states!="")
        this.filters= "membership_states,"+policies_info.membership_states;
      if(this.policies_info.seller_states!="")
        this.filters= "seller_states,"+policies_info.seller_states;
      if(this.policies_info.device_states!="")
        this.filters ="device_states,"+policies_info.device_states;
      if(this.policies_info.vin_states!="")
        this.filters="vin_states,"+policies_info.vin_states;
    }
    this.getPolicies();
  }

  getPolicies(){
    this.policies_info.pagination = Array();
    this.policies_info.pages =1;
    this.policies_info.total= 0;

    this.loader.show();
    if(!this.policies_info.to_date)
		  this.policies_info.to_date = this.policies_info.from_date;
		if(this.policies_info.to_date<this.policies_info.from_date)
      this.policies_info.to_date = this.policies_info.from_date;
    localStorage.setItem("policies_info",JSON.stringify(this.policies_info));
    this.operatorsService.getPolicies(this.policies_info)
    .subscribe((data:any)=>{
      console.log(data)
      this.policies=data.policies;
      this.policies_info.total = data.total_rows;
      this.policies_info.pages = data.pages;
      this.policies_info.pagination = this.paginationService.getPager(this.policies_info.pages,this.policies_info.page,10);
      this.loader.hide();
      console.log(this.policies_info)
    });
  }
  searchPolicies(){
    this.policies_info.seller_id= "";
    this.policies_info.policy_states= Array();
    this.policies_info.km_states= Array();
    this.policies_info.membership_states= Array();
    this.policies_info.seller_states= Array();
    this.policies_info.device_states= Array();
    this.policies_info.vin_states= Array();
    this.policies_info.from_date="";
    this.policies_info.to_date=""; 
    this.filters="";
    this.getPolicies();
  }
  setFilters(){
    let policy_states = Array();
    let km_states = Array();
    let membership_states = Array();
    let seller_states = Array();
    let device_states  = Array(); 
    let vin_states = Array();
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
    this.getPolicies();
  }
  setCustomerTracking(type,policy,tracking_id=null){
    this.tracking.type = type;
    this.tracking.id=tracking_id;
    this.tracking_customer.customer_tracking.customer_id = policy.user.id;
    this.tracking_customer.customer_tracking.policy_id = policy.id;
    this.tracking.customer_tracking=Array();
    if(this.tracking.id){
      this.operatorsService.getCustomerTracking(this.tracking.id)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result) this.tracking.customer_tracking=data.customer_traking;
      })
    }
    
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
