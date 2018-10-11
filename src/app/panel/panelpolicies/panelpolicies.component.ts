import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panelpolicies',
  templateUrl: './panelpolicies.component.html',
  styleUrls: ['./panelpolicies.component.scss']
})
export class PanelpoliciesComponent implements OnInit {
  session:any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.VerifySession()
  }

  VerifySession(){
    this.session = JSON.parse(localStorage.getItem('user'))
    if(this.session == null || this.session == ""){
      this.router.navigate(["/login"])
    }
  }

}
