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

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-panelpolicies',
  templateUrl: './panelpolicies.component.html',
  styleUrls: ['./panelpolicies.component.scss']
})
export class PanelpoliciesComponent implements OnInit {
  policies_info: any = {
    page: 14,
    policy_states: Array(),
    km_states: Array(),
    membership_states: Array(),
    seller_states: Array(),
    device_states: Array(), 
    vin_states: Array()
  }
  policies: any = Array();
  pagination: any = Array();
  filters: any = Array();
  date_today: any = new Date();
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService) { }

  ngOnInit() {
    this.filters.push('');
    this.searchPolicies();
  }
  searchPolicies(){
    this.spinner.show();
    this.operatorsService.getPolicies(this.policies_info)
      .subscribe((data:any)=>{
        console.log(data);
        this.policies = data.policies;
        this.pagination = this.paginationService.getPager(data.pages,this.policies_info.page,10)
        this.spinner.hide();
      })
  }
  setPagination(page){
    this.policies_info.page = page;
    this.searchPolicies()
  }
  setFilters(){
    let policy_states = Array();
    let km_states = Array();
    let membership_states = Array();
    let seller_states = Array();
    let device_states  = Array(); 
    let vin_states = Array();
    this.filters.forEach(element => {
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
    });

    this.policies_info.policy_states = policy_states;
    this.policies_info.km_states = km_states;
    this.policies_info.membership_states = membership_states;
    this.policies_info.seller_states = seller_states;
    this.policies_info.device_states = device_states;
    this.policies_info.vin_states = vin_states;
    this.searchPolicies();
  }
}
