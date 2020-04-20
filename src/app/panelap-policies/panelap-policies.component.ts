import { Component, OnInit } from '@angular/core';
import { OperatorsService } from "../services/operators.service";

@Component({
  selector: 'app-panelap-policies',
  templateUrl: './panelap-policies.component.html',
  styleUrls: ['./panelap-policies.component.scss']
})
export class PanelapPoliciesComponent implements OnInit {

  constructor(private operatorsService: OperatorsService) { }

  ngOnInit() {
  }

  getPolicies() {
    console.log("get_policies")
    // this.operatorsService.getPolicies(this.policies_info)
    // .subscribe((data:any)=>{
    //   console.log(data)
    //   this.policies=data.policies;
    //   this.excel = this.link+data.export_url;
    //   console.log(this.excel)
    //   this.policies_info.total = data.total_rows;
    //   this.policies_info.pages = data.pages;
    //   this.policies_info.pagination = this.paginationService.getPager(this.policies_info.pages,this.policies_info.page,10);
    //   this.loader.hide();
    //   console.log(this.policies_info)
    // });
  }

}
