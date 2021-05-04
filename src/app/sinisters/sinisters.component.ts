import { Component, OnInit } from '@angular/core';
import { OperatorsService } from '../services/operators.service';
import {DomSanitizer} from '@angular/platform-browser';
import { Router,ActivatedRoute } from '@angular/router';
import swal from "sweetalert";

@Component({
  selector: 'app-sinisters',
  templateUrl: './sinisters.component.html',
  styleUrls: ['./sinisters.component.scss']
})
export class SinistersComponent implements OnInit {
  sinisters:any = [];
  sinister_id: any;
  search: any;
  sinisters_url: any = "https://app.sxkm.mx/api/v3/get_all_potosi_sinisters.xlsx"

  sinister_number: any;
  constructor(private operatorsService: OperatorsService,  private route: ActivatedRoute, private _sanitizer: DomSanitizer) {

    this.sinister_id = this.route.snapshot.params['sinister_id'];
    if(this.sinister_id != 0){
      this.getSinistersById(this.sinister_id)
    }else{
      this.goForSinisters()
    }
   }

  ngOnInit() {
  }

  goToSeePolicy(id){
    window.location.pathname = "/panel/poliza/editar/"+id+'';
  }

  public photoURL(sinister) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(sinister.url_destination);
  }


  updateSinister(id, aasm_state, sinister_number, subject){
    this.operatorsService.updateSinister(id, aasm_state, sinister_number, subject)
    .subscribe((data:any)=>{
      if(data.result == true){
        swal(
          "El siniestro se actualizo exitosamente",
          "",
          "success"
        );
        setTimeout(function() {
        window.location.reload();
        }, 2000);

      }else{
        swal(
              "No se pudo actualizar ek siniestro",
              "ocurrio un error al actualizar el siniestro intenta de nuevo",
              "error"
            );

        setTimeout(function() {
        window.location.reload();
        }, 2000);

      }
      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }

  getSinistersById(id){
    this.operatorsService.getSinistersById(id)
    .subscribe((data:any)=>{

      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }

  getSinistersByPolicy(term){
    this.operatorsService.getSinistersByPolicy(term)
    .subscribe((data:any)=>{

      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }



  goForSinisters(){
    this.operatorsService.getSinistersAll()
    .subscribe((data:any)=>{

      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }

  getSinistersReport(){
    this.operatorsService.getSinistersReport()
    .subscribe((data:any)=>{

      this.sinisters = JSON.parse(data.data)
      console.log(this.sinisters);
    })
  }




}
