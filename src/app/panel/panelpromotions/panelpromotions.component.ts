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
import { LoginService } from '../../services/login.service';


import swal from 'sweetalert';
declare var $:any;

@Component({
  selector: 'app-panelpromotions',
  templateUrl: './panelpromotions.component.html',
  styleUrls: ['./panelpromotions.component.scss']
})
export class PanelpromotionsComponent implements OnInit {
  promotions: any = Array();
  
  promotion:any = {
		name: "",
		description: "",
		discount: 100,
		limit: 1,
		accumulable: false,
		subscribable: false,
		referable: false,
		status: "active",
		user_type: "quotation",
		only_seller: false,
		need_kilometer_package: false,
		kilometers: null,
		for_card: false,
		card_type: null,
		card_brand: null,
		card_bank: Array(),
		apply_to: Array("MonthlyPayment","KilometerPurchase")
  }
  promotion_id: any = "";
  promotion_status: any = "";
  isUpdate: any = false;
  monthly_payment = true;
  package_km = true;
  package = "";
  card_type = "";
  card_brand = "";
  banks = false;
  //Promo code
  promo_codes: any = Array();
  promo_code:any = {
		promotion_id: "",
		began_at: "",
    expires_at: "",
    promotional_code: "",
    referenced_email: ""
  }
  promotions_applied: any = Array();


  pagination_promotions: any = Array();
  pagination_promocodes: any = Array();
  pagination_promotions_applied: any = Array();
  page_promotions: any = {
    current_page: 1,
    total: 1,
    status: "active" 
  }
  page_promocodes: any = {
    current_page: 1,
    total: 1,
    status: "active" 
  }
  page_promotions_applied: any = {
    current_page: 1,
    total: 1,
    status: "active" 
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService) { }

  ngOnInit() {
    this.getPromotions();
    this.getPromoCodes();
    this.getPromotionsApplied();
  }
  getPromotions(){
    this.operatorsService.getPromotions(this.page_promotions.current_page,this.page_promotions.status)
    .subscribe((data:any)=>{
      if(data.result){
        this.promotions = data.promotions;
        this.page_promotions.total = data.total_pages;
        this.pagination_promotions = this.paginationService.getPager(data.total_pages,this.page_promotions.current_page,10)
      }
    })
  }
  getPromoCodes(){
    this.operatorsService.getPromoCodes(this.page_promocodes.current_page)
    .subscribe((data:any)=>{
      if(data.result)
        this.promo_codes = data.promo_codes;
        this.pagination_promocodes = this.paginationService.getPager(data.total_pages,this.page_promocodes.current_page,10)
    })
  }
  getPromotionsApplied(){
    this.operatorsService.getPromotionApplied()
    .subscribe((data:any)=>{
      if(data.result)
        this.promotions_applied = data.promo_codes;
        this.pagination_promotions_applied = this.paginationService.getPager(data.total_pages,this.page_promotions_applied.current_page,10);
    })
  }
  setPromotion(promotion_id,status){
    this.isUpdate = true;
    this.promotion_id = promotion_id;
    this.operatorsService.getPromotion(promotion_id)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        this.promotion = {
          name: data.promotion.editable_info.name,
          description: data.promotion.editable_info.description,
          discount: data.promotion.discount,
          limit: data.promotion.limit,
          accumulable: data.promotion.editable_info.accumulable,
          subscribable: data.promotion.editable_info.subscribable,
          referable: data.promotion.referable,
          status: data.promotion.editable_info.status,
          user_type: data.promotion.user_type,
          only_seller: data.promotion.only_seller,
          need_kilometer_package: data.promotion.need_kilometer_package,
          kilometers: data.promotion.kilometers,
          for_card: data.promotion.for_card,
          card_type: data.promotion.card_type,
          card_brand: data.promotion.card_brand,
          card_bank: data.promotion.card_bank,
          apply_to: data.promotion.apply_to
        }
        console.log(this.promotion)
        this.promotion_status = this.promotion.status;
        this.setBanks();

      }
    })
  }
  setPagination(page,tipo){
    console.log(page);
    if(tipo=='promotions'){
      this.page_promotions.current_page = page;
      this.getPromotions();
    }
    if(tipo=="promocodes"){
      this.page_promocodes.current_page = page;
      this.getPromoCodes();
    }
    if(tipo=='promotions_applied'){
      this.page_promotions_applied.current_page = page;
      this.getPromotionsApplied();
    }

    
  }
  sendPromotion(){
    if(this.card_type!="") this.promotion.card_type = this.card_type;
    if(this.card_brand!="") this.promotion.card_brand = this.card_brand;
    console.log(this.promotion);
    if(!this.isUpdate){
      this.operatorsService.createPromotions(this.promotion)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          $("#modalPromotion").modal("hide");
          this.promotions.push(data.promotion);
          swal("La promoción se ha creado correctamente","","success");
        }
        else swal("Hubo un problema","No se pudo crear la promoción","error");
      })
    }
    else{
      let status = this.promotion_status;
      console.log(this.promotion_id);
      this.operatorsService.updatePromotion(this.promotion_id,this.promotion)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          if(status=='active' && data.promotion.editable_info.status=='active'){
            let i = 0;
            this.promotions.forEach(element => {
              if(element.id==this.promotion_id){
                this.promotions[i]=data.promotion;
                console.log(element);
              }
              i++;
            });
            $("#modalPromotionEditable").modal("hide");
            swal("La promoción se ha modificado correctamente","","success");
          }
          else this.promotions.splice(data.promotion,1);
          if(status!='active' && data.promotion.editable_info.status=='active'){
            swal("La promoción se ha activado correctamente","","success");
          }
          if(data.promotion.editable_info.status=='suspended'){
            swal("La promoción se ha suspendido correctamente","","success");
          }
          if(data.promotion.editable_info.status=='canceled'){
            swal("La promoción se ha cancelado correctamente","","success");
          }
        }
        else swal("Hubo un problema","No se pudo modificar la promoción","error");
      })

    }
  }
  setApplyTo(num){
    this.promotion.apply_to = Array();
    if(num==1){
      if(this.package_km)
        this.package_km = false;
      else this.package_km = true;
    }
    if(num==2){
      if(this.monthly_payment)
        this.monthly_payment = false;
      else this.monthly_payment = true;
    }
    if(this.package_km)
      this.promotion.apply_to.push("KilometerPurchase");
    if(this.monthly_payment)
      this.promotion.apply_to.push("MonthlyPayment");
  }

  setKm(){
    this.promotion.need_kilometer_package = false;
    if(this.package!=""){
      this.promotion.need_kilometer_package = true;
      this.promotion.kilometers = this.package;
    }
    else this.promotion.kilometers = null;
  }

  setBanks(){
    if(this.banks)
      this.banks = false;
    else this.banks = true;

    if(this.banks)
      this.promotion.card_bank.push("AMERICAN EXPRESS");

  }
  
  inicializePromotion(){
    this.isUpdate = false;
    this.promotion = {
      name: "",
      description: "",
      discount: 100,
      limit: 1,
      accumulable: false,
      subscribable: false,
      referable: false,
      status: "active",
      user_type: "quotation",
      only_seller: false,
      need_kilometer_package: false,
      kilometers: null,
      for_card: false,
      card_type: null,
      card_brand: null,
      card_bank: Array(),
      apply_to: Array("MonthlyPayment","KilometerPurchase")
    }
  }

  changePromotion(status,promotion){
    this.isUpdate = true;
    this.promotion_id = promotion.id;
    this.promotion_status = promotion.editable_info.status;
    this.promotion = {
      name: promotion.editable_info.name,
      description: promotion.editable_info.description,
      discount: promotion.discount,
      limit: promotion.limit,
      accumulable: promotion.editable_info.accumulable,
      subscribable: promotion.editable_info.subscribable,
      referable: promotion.referable,
      status: status,
      user_type: promotion.user_type,
      only_seller: promotion.only_seller,
      need_kilometer_package: promotion.need_kilometer_package,
      kilometers: promotion.kilometers,
      for_card: promotion.for_card,
      card_type: promotion.card_type,
      card_brand: promotion.card_brand,
      card_bank: promotion.card_bank,
      apply_to: promotion.apply_to
    }
    this.sendPromotion();

  }

  sendPromocode(){
    console.log(this.promo_code);
    this.operatorsService.createPromoCode(this.promo_code)
    .subscribe((data:any)=>{
      console.log(data)
      if(data.result){
        $("#modalPromoCode").modal("hide");
        this.promo_codes.push(data.promo_code)
        swal("El código de promoción se ha creado correctamente","","success");
      }
      else swal("Hubo un problema","No se pudo crear el código de promoción","error")
    })
  }
  
  

}
