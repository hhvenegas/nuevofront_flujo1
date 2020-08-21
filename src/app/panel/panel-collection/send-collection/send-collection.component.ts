import { 
  Component, 
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef} from '@angular/core';

import { QuotationService } from '../../../services/quotation.service'
import { NgxSpinnerService } from "ngx-spinner";
import { isPlatformBrowser } from "@angular/common";
import { HubspotService } from "../../../services/hubspot.service";
import { OperatorsService } from "../../../services/operators.service";
import { UsersService } from "../../../services/users.service";
import { PaginationService } from "../../../services/pagination.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";
import { Maker } from "../../../constants/maker";
import { Year } from "../../../constants/year";
import { Model } from "../../../constants/model";
import { Version } from "../../../constants/version";
import { Quotation } from "../../../constants/quotation";
import { Seller } from "../../../constants/seller";
import { LoginService } from "../../../services/login.service";
import { LoaderService } from "../../../services/loader.service";

declare var $: any;
import swal from "sweetalert";
import { IfStmt } from "@angular/compiler";

@Component({
  selector: 'app-send-collection',
  templateUrl: './send-collection.component.html',
  styleUrls: ['./send-collection.component.scss']
})

export class SendCollectionComponent implements OnInit {
  public policy: any = Array();
  description: string;
  amount: number;
  payload: any = Array();

  buf: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private quotationService: QuotationService,private loader: LoaderService) { }

  ngOnInit() {
    this.policy = JSON.parse(localStorage.getItem("policy_data_canceled"))
    console.log('this.buf: ',this.buf)
  }

  searchPolicies(){
    if(this.description != undefined && this.amount != undefined){
      console.log('policy: ',this.policy)

      this.payload = {
        "policy_id": this.policy.id,
        "user_id": this.policy.user.id,
        "amount": this.amount,
        "description": this.description
      }

      this.quotationService.sendLinkCanceled(this.payload).subscribe((data: any) => {
        console.log('data: ',data)

        
        if(data.msg == "new custom payment created"){
          this.formatBase64(data, this.policy.user, this.policy.id)
        } else {
          swal("Ocurrió un error, inetanta nuevamente.")
        }
      })
    }  else if (this.description == undefined && this.amount == undefined){
      swal("Datos incorrectos, no se pudo generar link de pago.")
    }  else {
      swal("No se pudo generar link de pago.")
    }
  }


  formatBase64(data, user, policy){

      data[
        "user"
      ]=user

      data[
        "policy"
      ]=policy

      const json_to_send = data

      this.buf = btoa(JSON.stringify(json_to_send))
      console.log("datos a formatear", this.buf)
      console.log("string decodificada", atob(this.buf) )
      if(atob(this.buf) == JSON.stringify(json_to_send) )  {
        console.log("si son iguales")
        var angular_this = this
        setTimeout(function () {
            angular_this.copyToClipboard('#text_to_copy')
        }, 900);
      }else{
        console.log("no son iguales")
        swal("Hubo un problema","Los datos de entrada y los datos de salida parecen no coincidir, por favor verifica los datos de entrada y vuelve a intentar generar el link de pago","error")
      }
  }

  copyToClipboard(elemento) {
    console.log(elemento)
    var $temp = $("<input>")
    $("body").append($temp);
    $temp.val($(elemento).text()).select();
    document.execCommand("copy");
    $temp.remove();

    swal("La ruta se a copiado a tu portapapeles, solo presiona 'Ctrl + v' para compartir.")
  }

}
