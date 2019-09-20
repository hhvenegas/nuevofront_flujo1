import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { throttleTime } from 'rxjs/operators';
import { Car } from '../../constants/car';

@Component({
  selector: 'app-carupdate',
  templateUrl: './carupdate.component.html',
  styleUrls: ['./carupdate.component.scss']
})
export class CarupdateComponent implements OnInit {
  car_id:any;
  Form = new Car('','','');
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private usersService: UsersService) { }

  ngOnInit() {
    this.car_id = this.route.snapshot.params['id_car'];
    console.log(this.car_id)
  }

  onSubmit(){
    //console.log(this.Form)
    this.usersService.updateCarInfo(this.car_id,this.Form).subscribe(
      (data:any)=>{
        console.log(data)
        window.location.href = '/user/car/detalles/'+this.car_id
      },
      (error:any)=>{
        console.log(error)
      }
    )
  }

}
