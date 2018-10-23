import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import Swiper from 'swiper';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	car: any = null;
	purchases: any = null;
	car_id: any;
	q: any = 1;
	p: any = 1;

  	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private usersService: UsersService) { }

	ngOnInit() {
		this.car_id = this.route.snapshot.params['id_car'];
		console.log("Car id: "+this.car_id)
	    this.usersService.getCarBasic(this.car_id)
	    	.subscribe(
				(data:any)=> {
					this.car = data;
					console.log(this.car)
				}
			)
		this.usersService.get_kms_purchase(this.car_id)
			.subscribe(
				(data:any) => {
					this.purchases = data;
				}
			)


	}
	cambiar(cambiar){

	}

  

}
