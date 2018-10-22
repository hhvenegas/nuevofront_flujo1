import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Policy } from '../constants/policy';
declare var Chartkick:any;
import Leaflet from 'leaflet';
import swal from 'sweetalert';
declare var OpenPay:any;
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
 
  constructor(private usersService: UsersService, 
              private activedRoute: ActivatedRoute, 
              private router: Router) { }

  ngOnInit() {
    

  }

  

}
