import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-panelusers',
  templateUrl: './panelusers.component.html',
  styleUrls: ['./panelusers.component.scss']
})
export class PanelusersComponent implements OnInit {

	cars: any = Array();
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private usersService: UsersService) { }
	ngOnInit() {
		this.usersService.getCars()
			.subscribe(
				(data:any)=> {
					console.log(data)
					this.cars = data;
				}
			)
	}


}
