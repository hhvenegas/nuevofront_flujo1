import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { NotificationsService } from '../../services/notifications.service';
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
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  seller: any;
  quote_info: any = {
		total: 1,
		page: 1,
		pages:1,
		pagination: Array(),
		seller_id: "",
		quote_state: "pending",
		payment_state: "",
		seller_state: "",
		term: "",
		from_date: "",
    to_date: "",
    tracking_department_id: "",
    call_topic_id: ""
	}
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
    device_states: "",
    vin_states: "",
    search: "",
    from_date: "",
    to_date:"",
    tracking_department_id: "",
    call_topic_id: ""
  }
  sumary: any;
  date:any="";
  date_month:any="";

  url:any=""

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService, private notificationsServices: NotificationsService) { }

  ngOnInit() {
    this.url = "http://dev2.sxkm.mx/api/v3/reports/sales.xlsx?from_date=2018-02-20&to_date=2019-01-30"
    console.log(this.url)
    this.loader.show();
    let d = new Date();
    let month:string = "";
    if((d.getMonth()+1)<10){
      month = "0"+(d.getMonth()+1);
    }
    else month = (d.getMonth()+1)+"";

    if(d.getDate()<10) this.date   = d.getFullYear()+"-"+month+"-0"+d.getDate();
    else this.date   = d.getFullYear()+"-"+month+"-"+d.getDate();
    this.date_month   = d.getFullYear()+"-"+month+"-01";

    this.seller = this.loginService.getSession();
    //this.notificationsServices.notifications();
    this.operatorsService.getSumary(this.date)
    .subscribe((data:any)=>{
      console.log(data);
      this.sumary = data.data;
      this.loader.hide();
    })
  }

  goQuotes(action){
    if(this.seller.id==2) this.quote_info.seller_id = this.seller.id;
    this.quote_info.to_date   = this.date;
    if(action=='day')  this.quote_info.from_date = this.quote_info.to_date;
    if(action=='month') this.quote_info.from_date = this.date_month;

    localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
    console.log(this.quote_info)
    this.router.navigate([`/panel/cotizaciones/`]);
  }

  goPolicies(action,seller){
    if(action=='day'){
      this.policies_info.to_date   = this.date;
      this.policies_info.from_date = this.policies_info.to_date;
    }
    if(action=='month'){
      this.policies_info.to_date   = this.date;
      this.policies_info.from_date = this.date_month;
    }
    if(action=='with_out_km') this.policies_info.km_states ="no_km_left";
    if(action=='with_out_paid_membership') this.policies_info.membership_states = "unpaid";
    if(action=='with_out_vin') this.policies_info.vin_states="false";
    if(action=='with_out_device') this.policies_info.device_states="unassigned";
    if(action=='device_disconnected') this.policies_info.device_states ="disconnected"
    if(action=='device_never_connected') this.policies_info.device_states ="never_connected"
    
    if(seller) this.policies_info.seller_id = this.seller.id;
    localStorage.setItem("policies_info",JSON.stringify(this.policies_info));
    this.router.navigate([`/panel/polizas/`]);
  }
  goTracking(area,topic){
    if(area!=4){
      this.policies_info.tracking_department_id= area;
      this.policies_info.call_topic_id = topic;
      //this.policies_info.seller_id = this.seller.id;
      localStorage.setItem("policies_info",JSON.stringify(this.policies_info));
      this.router.navigate([`/panel/polizas/`]);
    }
    else{
      this.quote_info.tracking_department_id = area;
      this.quote_info.call_topic_id = topic;
      //this.quote_info.seller_id = this.seller.id;
      localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
      this.router.navigate([`/panel/cotizaciones/`]);
    }
  }

}
