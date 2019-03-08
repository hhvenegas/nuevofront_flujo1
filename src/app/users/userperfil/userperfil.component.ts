import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { throttleTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-userperfil',
  templateUrl: './userperfil.component.html',
  styleUrls: ['./userperfil.component.scss']
})
export class UserperfilComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private usersService: UsersService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

}
