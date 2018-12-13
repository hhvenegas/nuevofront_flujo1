import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
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

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-panelsellers',
  templateUrl: './panelsellers.component.html',
  styleUrls: ['./panelsellers.component.scss']
})
export class PanelsellersComponent implements OnInit {
  sellers: any;
  roles: any;
  seller: any =  {
    avatar: null,
    first_name: "",
    last_name: "",
    last_name_two: "",
    email: "",
    hubspot_id: "",
    phone: "",
    role: 2,
    sxkm_seller: true,
    aig_seller: false,
    active: true
  };
  tipo_seller: any = 'sxkm_seller';
  seller_id: any = "";
  isUpdate: any = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService) { }

  ngOnInit() {
    this.operatorsService.getSellers()
    .subscribe((data:any)=>{
      this.sellers = data.sellers;
      
    });
    this.operatorsService.getRoles()
    .subscribe((data:any)=>{
      this.roles = data.roles;
    })
  }
  createSeller(){
    this.seller =  {
      avatar: null,
      first_name: "",
      last_name: "",
      last_name_two: "",
      email: "",
      hubspot_id: "",
      phone: "",
      role: 2,
      sxkm_seller: true,
      aig_seller: false,
      active: true
    };
    this.isUpdate = false;
  }

  updateSeller(seller_id){
    this.seller_id = seller_id;
    this.isUpdate = true;
    this.operatorsService.getSeller(this.seller_id)
    .subscribe((data:any)=>{
      if(data.result){
        this.seller =  {
          avatar: null,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          last_name_two: data.data.last_name_two,
          email: data.data.email,
          hubspot_id: data.data.hubspot_id,
          phone: data.data.phone,
          role: data.data.role,
          sxkm_seller: data.data.sxkm_seller,
          aig_seller: data.data.aig_seller,
          active: data.data.active
        };
        if(this.seller.sxkm_seller){
          this.tipo_seller= "sxkm_seller";
        }
        else{
          this.tipo_seller= "aig_seller";
        }
      }
    });
    
  }
  deleteSeller(seller_id){
    this.seller_id = seller_id;
    this.isUpdate = true;
    this.operatorsService.getSeller(this.seller_id)
    .subscribe((data:any)=>{
      if(data.result){
        this.seller =  {
          avatar: null,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          last_name_two: data.data.last_name_two,
          email: data.data.email,
          hubspot_id: data.data.hubspot_id,
          phone: data.data.phone,
          role: data.data.role,
          sxkm_seller: data.data.sxkm_seller,
          aig_seller: data.data.aig_seller,
          active: false
        };
        this.operatorsService.updateSeller(this.seller_id,this.seller)
        .subscribe((data:any)=>{
          console.log(data);
          if(data.result){
            swal("El vendedor se ha eliminado correctamente","","success");
          }
          else swal("Hubo un problema","No se pudo eliminar al vendedor","error");
        })
      }
      else swal("Hubo un problema","No se pudo eliminar al vendedor","error");
    });
    
  }

  setSeller(){
    if(this.tipo_seller=='sxkm_seller'){
      this.seller.sxkm_seller = true;
      this.seller.aig_seller  = false;
    }
    else{
      this.seller.sxkm_seller = false;
      this.seller.aig_seller  = true;
    }
  }

  
  onSubmit(){
    console.log(this.seller);
    if(!this.isUpdate){
      this.operatorsService.validateUser(this.seller.email)
      .subscribe((data2:any)=>{
        if(!data2.result){
          this.operatorsService.createSeller(this.seller)
          .subscribe((data:any)=>{
            console.log(data);
            $("#modalSeller").modal("hide");
            if(data.result){
              this.sellers.push(data.seller);
              swal("Se ha creado un nuevo usuario","","success");
            }
            else { 
              $("#modalSeller").modal("hide");
              swal("Hubo un error","No se pudo crear el usuario","error");
            }
          })
        }
        else swal("Hubo un problema","El usuario ya existe","error");
      })
      
    }
    else{
      this.operatorsService.updateSeller(this.seller_id,this.seller)
      .subscribe((data:any)=>{
        console.log(data);
        $("#modalSeller").modal("hide");
        if(data.result){
          swal("El vendedor se ha actualizado correctamente","","success");
        }
        else swal("Hubo un problema","No se dudo guardar la información","error");
      })
    }
    
    
  }

}
