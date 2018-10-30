import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Car } from '../constants/car';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  Form = new Car('','','')
  car_id:any;
  constructor(@Inject(PLATFORM_ID)private platformId: Object, private route: ActivatedRoute, private router: Router, private usersService: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
    }); 
  }

  update_car_info(){
    console.log(this.Form);
    this.usersService.updateCarInfo(this.car_id, this.Form).subscribe(
      (data:any)=> {
        console.log(data);
        this.router.navigate(['/user/detalles/'+this.car_id])
        window.location.reload();
    });
  }

}
