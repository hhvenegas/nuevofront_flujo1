import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Seller } from '../../constants/seller';
import { LoginService } from '../../services/login.service';
import { LoaderService } from '../../services/loader.service';

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  devices: any = Array();
  seller: any;
  pagination: any = {
    page: 1,
    term: "",
    pages: Array()
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService) { }

  ngOnInit() {
    this.searchDevice();
  }
  searchDevice(){
    this.loader.show();
    if(this.pagination.term==''){
      this.operatorsService.getDevices(this.pagination.page)
      .subscribe((data:any)=>{
        console.log(data);
        this.loader.hide();
        if(data.result){
          this.devices = data.devices;
          this.pagination.pages = this.paginationService.getPager(data.total_pages,this.pagination.page,10)
        }
      })
    }
    else{
      this.operatorsService.searchDevice(this.pagination.term)
      .subscribe((data:any)=>{
        console.log(data);
        this.loader.hide();
        if(data.result){
          this.devices=data.devices;  
        }
      })
    }
  }
  setPagination(page){
    if(page<1) page = 1;
    if(page>this.pagination.total_pages)
    page = this.pagination.total_pages;
    this.pagination.page = page;
    this.searchDevice();

  }

}
