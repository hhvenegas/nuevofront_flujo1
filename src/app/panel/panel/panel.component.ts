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
		seller_state: "assigned",
		term: "",
		from_date: "",
		to_date: ""
	}
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService) { }

  ngOnInit() {
    this.seller = this.loginService.getSession();

  }

  goQuotes(action){
    let d = new Date();
    let month:string = "";
    if((d.getMonth()+1)<10){
      month = "0"+(d.getMonth()+1);
    }
    else month = (d.getMonth()+1)+"";

    this.quote_info.seller_id = this.seller.id;
    this.quote_info.to_date   = d.getFullYear()+"-"+month+"-"+d.getDate();
    if(action=='day')  this.quote_info.from_date = this.quote_info.to_date;
    if(action=='month') this.quote_info.from_date = d.getFullYear()+"-"+month+"-01";

    localStorage.setItem("quote_info",JSON.stringify(this.quote_info));
    this.router.navigate([`/panel/cotizaciones/`]);
  }

}
