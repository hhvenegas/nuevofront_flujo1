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
  commentary: any = null;
  current_insurance: any;
	policy_object: any = {
    policy: Array(),
    car: Array(),
    shipping: Array(),
    billing: Array()
  }
  payments_pending_membership: any =  Array();
  payments_memberships: any = Array();
  payments_recharges: any = Array();
  subscriptions: any = Array();
  cards: any = Array();
  card_id: any = "";
  link: any = "";

  pending_payments: any = Array();

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private usersService: UsersService) { }

  ngOnInit() {
    this.link = this.operatorsService.getLink();
  		this.policy_id = this.route.snapshot.params['policy_id'];
  		this.operatorsService.getPolicy(this.policy_id)
      .subscribe((data:any)=>{
        if(data.result){
          console.log(data)
          this.policy = data.policy;
          this.usersService.getCards(this.policy.user.id)
          .subscribe((data:any)=>{
            if(data.result){
              this.cards = data.cards;
            }
          })
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
      });
      this.operatorsService.getAllPaymentsPolicy(this.policy_id)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.payments_pending_membership = data.data.due_membership;
          this.payments_memberships = data.data.memberships;
          this.payments_recharges = data.data.recharges;
        }
      });

      this.operatorsService.getPendingPaymentsPolicy(this.policy_id)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result){
          this.pending_payments = data.data
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

  setInsurances(insurance){
    this.current_insurance = insurance
  }

  assignOnHold(){
    if(this.commentary == null){
        swal("Debes completar los datos del comentario", "", "success");

    }else{
      console.log("se asigno el evento on hold: ", this.commentary)
      let request_data = {
        commentary: this.commentary,
        policy_insurance_id: this.current_insurance.policy_insurance.id
      }

      this.operatorsService.setOnHoldKilometers(this.policy_id, request_data)
      .subscribe((data:any)=>{
        console.log(data)
        if(data.result == true){
          swal("Los datos se han guardado correctamente", "", "success");
        }
        else{
         swal("No se pudo guardar la información", "", "error");
        }
        this.commentary = null
        $("#putonhold").modal("hide");
      })

    }
  }

  createSubscription(){
    let subscription = {
      user_id: this.policy.user.id,
	    policy_id: this.policy_id,
	    card_id: this.card_id
    }
    this.usersService.createSubscriptions(subscription)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        this.policy.subscription = data.subscription;
        $("#modalCreateSubscription").modal("hide");
        swal(data.msg,"","success")
      }
      else swal("Hubo un problema",data.msg,"error")
    })
  }
  cancelSubscription(){
    swal("¿Estás seguro que deseas cancelar la suscripción?","", {
      buttons: ["Cancelar", "Aceptar"],
    })
    .then((value) => {
      if(value){
        this.usersService.deleteSubscriptions(this.policy.subscription.id)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.result){
            this.policy.subscription = null;
            swal(data.msg,"","success")
          }
          else swal("Hubo un problema",data.msg,"error")
        })

      }
    });
  }
}
