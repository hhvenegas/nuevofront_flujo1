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

  	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private usersService: UsersService) { }

	ngOnInit() {
		this.route.snapshot.params['id'];
	    this.usersService.getCarBasic(6)
	    	.subscribe(
				(data:any)=> {
					this.car = data;
					console.log(this.car)
				}
			)
		this.usersService.get_kms_purchase(6)
			.subscribe(
				(data:any) => {
					this.purchases = data;
				}
			)

		let swiper = new Swiper('.swiper-container', {
		    slidesPerView: 1,
		    spaceBetween: 30,
		    loop: true,
		    pagination: {
		    	el: '.swiper-pagination',
		        clickable: true,
		    },
		    navigation: {
		    	nextEl: '.swiper-button-next',
		        prevEl: '.swiper-button-prev',
		    },
		});

	}
	cambiar(cambiar){

	}

  

}
