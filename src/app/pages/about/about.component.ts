import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/utils/app-constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  readonly AppConstants = AppConstants

  constructor() { }

  ngOnInit() {
  }

}
