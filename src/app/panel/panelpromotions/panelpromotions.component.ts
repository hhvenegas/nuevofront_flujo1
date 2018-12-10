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
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService) { }

  ngOnInit() {
    this.operatorsService.getPromotions()
    .subscribe((data:any)=>{
      if(data.result){
        this.promotions = data.promotions
      }
    })
    this.operatorsService.getPromoCodes()
    .subscribe((data:any)=>{
      if(data.result)
        this.promo_codes = data.promo_codes;
    })
    this.operatorsService.getPromotionApplied()
    .subscribe((data:any)=>{
      if(data.result)
        this.promotions_applied = data.promo_codes;
    })
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
  updatePromotion(id){

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
  changePromotion(status){
    this.isUpdate = true;
    this.promotion.status = status;
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
