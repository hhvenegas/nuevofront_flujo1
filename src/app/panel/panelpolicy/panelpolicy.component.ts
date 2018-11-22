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
  selector: 'app-panelpolicy',
  templateUrl: './panelpolicy.component.html',
  styleUrls: ['./panelpolicy.component.scss']
})
export class PanelpolicyComponent implements OnInit {
	policy_id: any = "";
  policy: any = Array();
	policy_object: any = {
    policy: Array(),
    car: Array(),
    shipping: Array(),
    billing: Array()
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService) { }

  ngOnInit() {
  		this.policy_id = this.route.snapshot.params['policy_id'];
  		this.operatorsService.getPolicy(this.policy_id)
      .subscribe((data:any)=>{
        if(data.result){
          this.policy = data.policy
        }
      })
      this.operatorsService.getEditableInfoPolicy(this.policy_id)
  		.subscribe((data:any)=>{
  			if(data.result){
  				this.policy_object = {
            policy: data.data.policy,
            car: data.data.car,
            shipping: data.data.shipping,
            billing: data.data.billing
          }
  			}
  		})
  }

  	onSubmit(){
  		this.operatorsService.updateEditablePolicy(this.policy_id,this.policy_object)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result){
          swal("Los datos se han guardado correctamente", "", "success");
        }
        else{
         swal("No se pudo guardar la información", "", "error"); 
        }
      })
  	}
}
