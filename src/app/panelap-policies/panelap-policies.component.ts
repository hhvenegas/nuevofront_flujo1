import { Component, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { OperatorsService } from "../services/operators.service";
declare var $: any;

@Component({
  selector: 'app-panelap-policies',
  templateUrl: './panelap-policies.component.html',
  styleUrls: ['./panelap-policies.component.scss']
})
export class PanelapPoliciesComponent implements OnInit {
  current_policy_details: any = false;
  rows = [

  ];
  rows2 = [

  ];
  total_policies: any;
  columns = [{ prop: 'Poliza' }, { prop: 'Asegurado' }, { prop: 'Estatus' }, { prop: 'Tipo' }, { prop: 'Vigencia' }, {  name: 'Acciones' }];
  policies: any;
  constructor(private operatorsService: OperatorsService) {


  }

  ngOnInit() {
    this.getPolicies()
  }

  getPolicies() {
    console.log("get_policies")
    this.operatorsService.getPoliciesAp()
     .subscribe((data:any)=>{
       console.log(data)
       this.policies=data.data;
       for (let policy of this.policies) {
          console.log(policy);
          let object_to_save ={
            "poliza":  policy.carrier_policy_id != undefined ? policy.carrier_policy_id : "No tiene id",
            "asegurado": policy.insured_person != {} ? policy.insured_person.name  +" "+ policy.insured_person.first_name +" "+ policy.insured_person.last_name : "",
            "estatus": policy.status_policy,
            "tipo": policy.policy_type.name,
            "vigencia": policy.expires_at,
            "correo": policy.insured_person != {} ? policy.insured_person.email : "",
            "acciones": policy
          }
          this.rows.push(object_to_save)
          this.rows2.push(object_to_save)

      }

      this.rows = [...this.rows];
      this.rows2 = [...this.rows2];
      this.total_policies = this.rows.length
     });
  }

  updateFilter(event) {
    let val = "";
    if( event.target.value == undefined){
       val = "";
    }else{
       val = event.target.value.toLowerCase();
    }



    // filter our data
    const temp = this.rows2.filter(function (d) {
      return d['poliza'].toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;

  }

  go_to_policies_generate(){
    window.location.pathname = "/panel/ap_policies/0/1";
  }

  go_to_pay_month(id){
    window.location.pathname = "panel_ap/pay_membership/"+id+"";
  }


  go_to_policies_generate_already_quote(id){
    window.location.pathname = "/panel/ap_policies/"+id+"/100";
  }

  show_modal(policy){
    this.current_policy_details = policy
    console.log("current_policy_details", this.current_policy_details)
    setTimeout(function(){ $("#modalDetails").modal("show"); }, 100);

  }

}
