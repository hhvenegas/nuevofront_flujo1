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
  selector: 'app-panelusers',
  templateUrl: './panelusers.component.html',
  styleUrls: ['./panelusers.component.scss']
})
export class PanelusersComponent implements OnInit {

	cars: any = Array();
	car_id:any;
	number_motor:any;
	plates:any;
	vin:any;
	has_complete_car_data:boolean;
	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private usersService: UsersService,private spinner: NgxSpinnerService) { }
	ngOnInit() {
		this.spinner.show();
		this.getPersonalInfo()
		this.getcars()
		//this.getInfoCar(this.car_id)
	}

	getPersonalInfo(){
		this.usersService.getPersonalInfo().subscribe(
			(data:any)=> {
				console.log(data)
		})
	}

	getcars(){
		this.usersService.getCars().subscribe(
			(data:any)=> {
				console.log(data)
				this.cars = data;
				// this.number_motor = this.cars.motor_number
				// this.plates = this.cars.plates
				// this.vin = this.cars.vin
				this.spinner.hide();
			}
		)
	}
}
