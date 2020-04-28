import { Component, OnInit } from '@angular/core';
import { OperatorsService } from '../services/operators.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-pay-membership',
  templateUrl: './pay-membership.component.html',
  styleUrls: ['./pay-membership.component.scss']
})
export class PayMembershipComponent implements OnInit {
  policy_id: any;
  policy: any;
  success: any;
  complete_purchase: any = false;
  purchase_result: any;
  cards: any;
  card_id: any = null;
  ip: any;
  constructor(private operatorsService: OperatorsService, private route: ActivatedRoute, private loader: LoaderService,  private router: Router) {
    this.policy_id = this.route.snapshot.params['policy_id'];
    this.operatorsService.getIp().subscribe((response) => {
      console.log(response['ip'])
      this.ip = response['ip']
    })
    this.operatorsService.getPoliciesApId(this.policy_id).subscribe((data:any)=>{
      if(data.code == 200){
        console.log(data)
         this.policy = data.data;
         this.operatorsService.getCardsSrpago(this.policy.user_id).subscribe((response_data:any)=>{
           if(response_data.code == 200){
             console.log(response_data)
              this.cards = response_data.data;
           }
         })
      }
    })
  }

  ngOnInit() {
  }

  pay_membership(){
    if(this.card_id == null){
      swal("Selecciona una tarjeta","Debes seleccionar una forma de pago para continuar","error");
    }else{
      this.loader.show();

      let data_to_send ={ "user":
                      { "id": parseInt(this.policy.user_id),
                               "name": this.policy.insured_person.name,
                               "surname": this.policy.insured_person.first_name,
                               "email":this.policy.insured_person.email
                      },
                        "payment":
                             { "policy_id": this.policy_id,
                               "gateway_id": 10,
                               "charge_type": "person",
                               "amount":this.policy.policy_type.total_amount,
                               "company":5,
                               "card_id":this.card_id,
                               "ip_address":  this.ip
                             }
                    }
      this.operatorsService.paySrPago(data_to_send).subscribe((data:any)=>{
        this.complete_purchase = true;
        console.log("",data)
        this.purchase_result = data.data
        if(data.code == 200){

          this.success = true;
          this.loader.hide();
        }else{
          this.success = false;
          this.loader.hide();
        }
      })

    }
  }

}
