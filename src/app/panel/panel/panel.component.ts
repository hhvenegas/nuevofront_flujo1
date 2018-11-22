import { Component, OnInit } from '@angular/core';
//import { userInfo } from 'os';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  session:any;

  constructor(private router: Router) { 
    
  }

  ngOnInit() {
  }

}
