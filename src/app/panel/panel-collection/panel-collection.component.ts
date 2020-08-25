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

  excel: any;

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
    this.getPoliciesCanceled(1,'aig')
    this.policyCurrentPage = parseInt(this.policies_info.current_page)
  }

  getPoliciesCanceled(page,search){
    this.loader.show()
    this.quotationService.getCaceled(page,search).subscribe((data: any) => {
      
      this.policies_info = data
      this.policies = data.policies
      this.loader.hide()
    })
  }

  getPoliciesPrev(){

    this.policyCurrentPage = parseInt(this.policies_info.current_page) <= 1 ? parseInt(this.policies_info.current_page) : parseInt(this.policies_info.current_page)- 1
    
    this.getPoliciesCanceled(this.policyCurrentPage,this.policies_info.search)
  }

  getPoliciesFast(){
    this.policyCurrentPage  = parseInt(this.policies_info.current_page)  + 1
    
    this.getPoliciesCanceled(this.policyCurrentPage,this.policies_info.search)
  }

  actionGoToColection(policy){
    localStorage.setItem("policy_data_canceled",JSON.stringify(policy))
    window.location.pathname = '/panel/cobranza/enviar-link';
  }

  searchPolicies() {
    this.getPoliciesCanceled(1,this.policies_info.search)
  }

}
