import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { CartService } from '../../services/cart.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Policy } from '../../constants/policy';
import { Aig } from '../../constants/aig';
import { Store } from '../../constants/store';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {
  checkbox_factura: boolean = false;
  checkbox_suscription: boolean = false;
  suscription: boolean = false;
  car_id: any;
  car: any;
  package: any;
  stores: Store[];
  error_store: string ="";
  store:any="";
  pago: string = "tarjeta";
  onlycard: boolean = false;
  card: any = {
		"card_number"		: "",
	    "holder_name"		: "",
	    "expiration_year"	: "",
	    "expiration_month"	: "",
	    "cvv2" 				: ""
  }
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private cartService: CartService, private hubspotService: HubspotService, private usersService: UsersService) { }

  ngOnInit() {
    this.car_id = this.route.snapshot.params['id_car'];
    console.log(this.car_id)
    this.getInfoCar()
    this.getStores();
  }

  getInfoCar(){
    this.usersService.getCarBasic(this.car_id)
    .subscribe(
    (data:any)=> {
      this.car = data;
      console.log(this.car)
      this.getPackage()
      //this.get_packages()
    });
  }

  getPackage(){
    this.package = JSON.parse(localStorage.getItem('package'))
    //console.log(this.package.cost_by_package)
  }

  changePayment(payment){
		this.pago = payment;
  }
  
  getStores(): void {
    this.cartService.getStores()
      .subscribe(stores => this.stores = stores)
  }

}
