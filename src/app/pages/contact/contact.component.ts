import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/utils/app-constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  readonly AppConstants = AppConstants

  constructor() { }

  ngOnInit() {
  }

}
