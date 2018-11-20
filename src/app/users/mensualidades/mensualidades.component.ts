import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mensualidades',
  templateUrl: './mensualidades.component.html',
  styleUrls: ['./mensualidades.component.scss']
})

export class MensualidadesComponent implements OnInit {
  car:any;
  car_id:any;
  monthly_payment:any[];
  monthly_payment_date:any;
  policy_id:any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router,private spinner: NgxSpinnerService, private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
      this.getCarBasic();
    });
  }

  getCarBasic(){
    this.spinner.show();
    this.usersService.getCarBasic(this.car_id).subscribe(
      (data: any)=>{
        console.log(data)
        this.car = data
        this.policy_id = this.car.policy.aig_id
        this.monthly_payment = [];
        if(this.car){
          for(let monthlypayment of this.car.policy.get_monthly_payments){
            this.monthly_payment.push(monthlypayment)
          }
        }
        this.spinner.hide();
      }
    )
  }

  monthly_pay(monthly_payment){
    this.monthly_payment_date = monthly_payment;
    localStorage.setItem('date_monthlypayment', (this.monthly_payment_date))
    window.location.href = '/user/pago/membresia/'+this.car_id
  }

}
