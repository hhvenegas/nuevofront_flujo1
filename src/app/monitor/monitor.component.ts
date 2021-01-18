import { Component, OnInit } from '@angular/core';
import { OperatorsService } from '../services/operators.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {
  sinisters:any = [];


  constructor(private operatorsService: OperatorsService, private _sanitizer: DomSanitizer) {
    this.goForSinisters()
  }


  ngOnInit() {
  }

  public photoURL(sinister) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(sinister.url_destination);
  }

  goForSinisters(){
    this.operatorsService.getSinistersLive()
    .subscribe((data:any)=>{

      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }

  details_sinister(sinister_id){
    window.location.pathname = "/siniestros/detalles/"+sinister_id+'';
  }

}
