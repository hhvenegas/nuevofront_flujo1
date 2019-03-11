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

@Component({
  selector: 'app-panelticket',
  templateUrl: './panelticket.component.html',
  styleUrls: ['./panelticket.component.scss']
})
export class PanelticketComponent implements OnInit {
  object_id: any = "";
  object: any = Array();
  action: any = "";
  tipo: any = "";
  isPending: any = false;
  isPaid: any = false;
  tickets: any = Array();
  isCompra: any = false;
  isRecarga: any = false;
  isSubscription: any = false;
  isDevice: any = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService) { }

  ngOnInit() {
    this.object_id = this.route.snapshot.params['id'];
    this.action = this.route.snapshot.params['action'];
    this.tipo = this.route.snapshot.params['type'];
    if(this.tipo=='pendiente'){
      this.isPending = true;
    }
    if(this.tipo=='pago'){
      this.isPaid = true;
    }
    if(this.action=='compra'){
      this.isCompra = true;
    }
    if(this.action=='recarga'){
      this.isRecarga = true;
    }
    if(this.action=='suscripcion'){
      this.isSubscription = true;
    }
    if(this.action == 'disposivo'){
      this.isDevice = true;
    }

    if(this.isCompra){
      this.getPaymentCompra();
    }
    else this.getPaymentPolicies();
  }
  getPaymentCompra(){
    if(this.isPending){
      this.operatorsService.getPendingPaymentsQuotes(this.object_id)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result){
          this.tickets = data.data;
        }
      });
    }
  }
  getPaymentPolicies(){
    if(this.isPending){
      this.operatorsService.getPendingPaymentsPolicy(this.object_id)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result){
          this.tickets = data.data;
        }
      });
    }
  }

}
