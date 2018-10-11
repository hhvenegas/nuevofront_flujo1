import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panelpolicy',
  templateUrl: './panelpolicy.component.html',
  styleUrls: ['./panelpolicy.component.scss']
})
export class PanelpolicyComponent implements OnInit {
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
