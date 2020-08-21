import { 
  Component, 
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef} from '@angular/core';

import { QuotationService } from '../../../services/quotation.service'
import { NgxSpinnerService } from "ngx-spinner";
import { isPlatformBrowser } from "@angular/common";
import { HubspotService } from "../../../services/hubspot.service";
import { OperatorsService } from "../../../services/operators.service";
import { UsersService } from "../../../services/users.service";
import { PaginationService } from "../../../services/pagination.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";
import { Maker } from "../../../constants/maker";
import { Year } from "../../../constants/year";
import { Model } from "../../../constants/model";
import { Version } from "../../../constants/version";
import { Quotation } from "../../../constants/quotation";
import { Seller } from "../../../constants/seller";
import { LoginService } from "../../../services/login.service";
import { LoaderService } from "../../../services/loader.service";

declare var $: any;
import swal from "sweetalert";
import { IfStmt } from "@angular/compiler";

@Component({
  selector: 'app-send-collection',
  templateUrl: './send-collection.component.html',
  styleUrls: ['./send-collection.component.scss']
})

export class SendCollectionComponent implements OnInit {
  public policy: any = Array();
  description: string;
  amount: number;
  payload: any = Array();

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private quotationService: QuotationService,private loader: LoaderService) { }

  ngOnInit() {
    this.policy = JSON.parse(localStorage.getItem("policy_data_canceled"))
  }

  searchPolicies(){
    if(this.description != undefined && this.amount != undefined){
      
      this.payload = {
        "policy_id": this.policy.id,
        "user_id": this.policy.user.id,
        "amount": this.amount,
        "description": this.description
      }

      this.quotationService.sendLinkCanceled(this.payload).subscribe((data: any) => {
        if(data.msg == "new custom payment created"){
          swal("Se ha enviado link de pago.")
        } else {
          swal("Ocurrió un error, inetanta nuevamente.")
        }
        
      })
    }  else if (this.description == undefined && this.amount == undefined){
      swal("Datos incorrectos, no se pudo envíar link de pago.")
    }  else {
      swal("No se pudo envíar link de pago.")
    }
  }

}
