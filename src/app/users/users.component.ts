import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService) { }

  ngOnInit() {
  }

  	// getCarBasic(){
  	// this.usersService.getCar().subscribe(
   //    (data: any) => {
   //      console.log(data);
   //      // this.car = data;
   //      // this.vin = data.vin
   //      // this.plates = data.plates
   //      // this.motor = data.motor_number
   //      // if(data.vin && data.plates && data.motor_number){
   //      //   this.has_complete_car_data = true
   //      // }else{
   //      //   this.has_complete_car_data = false
   //      // }
   //      // this.get_packages();
   //      // this.get_trips_group();
   //    },
   //    (error: any) => {
   //      console.log(error)
   //    }
   //  );
  	// }

}
