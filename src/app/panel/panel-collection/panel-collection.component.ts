import { 
  Component, 
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef} from '@angular/core';

import { QuotationService } from '../../services/quotation.service'
import { NgxSpinnerService } from "ngx-spinner";
import { isPlatformBrowser } from "@angular/common";
import { HubspotService } from "../../services/hubspot.service";
import { OperatorsService } from "../../services/operators.service";
import { UsersService } from "../../services/users.service";
import { PaginationService } from "../../services/pagination.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";
import { LoginService } from "../../services/login.service";
import { LoaderService } from "../../services/loader.service";

declare var $: any;
import swal from "sweetalert";
import { IfStmt } from "@angular/compiler";

@Component({
  selector: 'app-panel-collection',
  templateUrl: './panel-collection.component.html',
  styleUrls: ['./panel-collection.component.scss']
})
export class PanelCollectionComponent implements OnInit {
  public policies: any = Array();
  policies_info: any = {}
  filters: any = "";
  policyCurrentPage: any;
  policyPrev: any;
  policyFast: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private quotationService: QuotationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private hubspotService: HubspotService,
    private operatorsService: OperatorsService,
    private spinner: NgxSpinnerService,
    private paginationService: PaginationService,
    private loginService: LoginService,
    private usersService: UsersService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.loader.show()
    this.getPoliciesCanceled()
    this.policyCurrentPage = parseInt(this.policies_info.current_page)
    console.log("this.policyCurrentPage: ", this.policyCurrentPage)
    console.log("this.policies_info.current_page: ", this.policies_info.current_page)
  }

  getPoliciesCanceled(){
    this.quotationService.getCaceled(1).subscribe((data: any) => {
      console.log('data: ',data)
      this.policies_info = data
      console.log('this.policies_info: ', this.policies_info)
      this.policies = data.policies
      this.loader.hide()
    })
  }

  searchPolicies() {
    this.policies_info.seller_id = "";
    this.policies_info.policy_states = "";
    this.policies_info.km_states = "";
    this.policies_info.membership_states = "";
    this.policies_info.seller_states = "";
    this.policies_info.device_states = "";
    this.policies_info.vin_states = "";
    this.policies_info.from_date = "";
    this.policies_info.to_date = "";
    this.policies_info.tracking_department_id = "";
    this.policies_info.call_topic_id = "";
    this.filters = "";
  }

  getPoliciesPrev(){

    this.policyCurrentPage = parseInt(this.policies_info.current_page) <= 1 ? parseInt(this.policies_info.current_page) : parseInt(this.policies_info.current_page)- 1
    console.log('this.policy_1: ', this.policyCurrentPage)
  }

  getPoliciesFast(){
    this.policyCurrentPage  = parseInt(this.policies_info.current_page)  + 1
    console.log('this.policy_2: ', this.policyCurrentPage)
  }

  actionGoToColection(policy){
    localStorage.setItem("policy_data_canceled",JSON.stringify(policy))
    window.location.pathname = '/panel/cobranza/enviar-link';
  }
}
