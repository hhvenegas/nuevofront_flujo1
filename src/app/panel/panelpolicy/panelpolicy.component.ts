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
  }

}
