import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { NotificationsService } from '../../services/notifications.service';
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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { states, days, months, years, yearsCard, maritals, genders, municipality } from './checkout-items';
declare var SrPago:any;

declare var $:any;
import swal from 'sweetalert';
@Component({
  selector: 'app-appolicies',
  templateUrl: './appolicies.component.html',
  styleUrls: ['./appolicies.component.scss']
})
export class AppoliciesComponent implements OnInit {
  policy_id: any;
  policy: any;
  checked: any = false;
  success: boolean = false
  sorts: any;
  policy_type: any;
  public checkoutForm   :  FormGroup;
  public orderDetails   :  any[] = [];
  public amount         :  number;
  public aditionalsCapture : boolean;
  public beneficiaryCapture : boolean;
  public Obligatoriedad : boolean;
  public Individual : boolean;
  public Familiar : boolean;
  public days : any [];
  public months : any [];
  public years : any [];
  public yearsCard : any [];
  public genders : any [];
  public maritals : any [];
  public tokenInput : any;
  complete_purchase : boolean = false;
  checkOutItems: any = null;
  policy_type_res: any = null;
  purchase_result: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private fb: FormBuilder, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService, private notificationsServices: NotificationsService) {
    this.sorts = [{prop: "poliza",dir: "desc"},{prop: "correo",dir: "asc"}]
    this.policy_id = this.route.snapshot.params['policy_id'];
    this.policy_type_res = this.route.snapshot.params['policy_type'];
    if(this.policy_id != 0){
      let endpoint_to_find;
      if(this.policy_type_res == 1){
        endpoint_to_find = this.operatorsService.getPolicy(this.policy_id).subscribe((data:any)=>{
          if(data.result){
            console.log(data)
            this.policy = data.policy;
            this.checkoutForm.controls['name'].setValue(this.policy.first_name);
            this.checkoutForm.controls['firstname'].setValue(this.policy.last_name);
            this.checkoutForm.controls['lastname'].setValue(this.policy.second_last_name);
            this.checkoutForm.controls['nameCard'].setValue(this.policy.first_name);
            this.checkoutForm.controls['firstnameCard'].setValue(this.policy.last_name);
            this.checkoutForm.controls['lastnameCard'].setValue(this.policy.second_last_name);

            this.checkoutForm.controls['phone'].setValue(this.policy.phone);
            this.checkoutForm.controls['email'].setValue(this.policy.email);

            this.checkoutForm.controls['day'].setValue(this.policy.birth_date.split('-')[2])
            this.checkoutForm.controls['month'].setValue(this.policy.birth_date.split('-')[1])
            this.checkoutForm.controls['year'].setValue(this.policy.birth_date.split('-')[0])
            //this.checkoutForm.controls['gender'].setValue('F')


          }
        })
      }else{
        endpoint_to_find =  this.operatorsService.getQuote(this.policy_id).subscribe((data:any)=>{
          if(data.result){
            console.log(data)
            this.policy = data.quote;
            this.checkoutForm.controls['name'].setValue(this.policy.user.first_name);
            this.checkoutForm.controls['firstname'].setValue(this.policy.user.last_name);
            this.checkoutForm.controls['lastname'].setValue(this.policy.user.second_last_name);
            this.checkoutForm.controls['nameCard'].setValue(this.policy.user.first_name);
            this.checkoutForm.controls['firstnameCard'].setValue(this.policy.user.last_name);
            this.checkoutForm.controls['lastnameCard'].setValue(this.policy.user.second_last_name);

            this.checkoutForm.controls['phone'].setValue(this.policy.user.phone);
            this.checkoutForm.controls['email'].setValue(this.policy.user.email);

            this.checkoutForm.controls['day'].setValue(this.policy.user.birth_date.split('-')[2])
            this.checkoutForm.controls['month'].setValue(this.policy.user.birth_date.split('-')[1])
            this.checkoutForm.controls['year'].setValue(this.policy.user.birth_date.split('-')[0])
            //this.checkoutForm.controls['gender'].setValue('F')


          }
        })
      }
    }else{
      this.policy = null;
    }

    this.checkoutForm = this.fb.group({
    //Titular data insured
      name:['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      //postalcode: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      //address: ['', [Validators.required, Validators.pattern('[A-Za-z0-9 ][A-Za-z0-9 ]+[A-Za-z0-9]$')]],
      //number: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      //suburb:['', [Validators.required, Validators.pattern('[A-Za-z0-9 ][A-Za-z0-9 ]+[A-Za-z0-9]$')]],
      //municipality:['', [Validators.required, Validators.pattern('[A-Za-z0-9 ][A-Za-z0-9 ]+[A-Za-z0-9]$')]],
      //state: ['', Validators.required],
      //rfc: ['', [Validators.required, Validators.pattern('[A-Za-z0-9][A-Za-z0-9]+[A-Za-z0-9]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      //marital: ['', Validators.required],
      gender: ['', Validators.required],
      //ocupacity:['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      email: ['', [Validators.required, Validators.email]],

    //Spouse aditionals data insured
      nameSpouse:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameSpouse: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameSpouse: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      daySpouse: ['',],
      monthSpouse: ['',],
      yearSpouse: ['',],
      genderSpouse: ['',],
      ocupacitySpouse:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],

    //Son one aditionals data insured
      nameSonOne:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameSonOne: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameSonOne: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      daySonOne: ['',],
      monthSonOne: ['',],
      yearSonOne: ['',],
      genderSonOne: ['',],
      ocupacitySonOne:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],

    //Son two aditionals data insured
      nameSonTwo:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameSonTwo: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameSonTwo: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      daySonTwo: ['',],
      monthSonTwo: ['',],
      yearSonTwo: ['',],
      genderSonTwo: ['',],
      ocupacitySonTwo:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],

    //Son three aditionals data insured
      nameSonThree:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameSonThree: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameSonThree: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      daySonThree: ['',],
      monthSonThree: ['',],
      yearSonThree: ['',],
      genderSonThree: ['', ],
      ocupacitySonThree:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],

    //Son Four aditionals data insured
      nameSonFour:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameSonFour: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameSonFour: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      daySonFour: ['',],
      monthSonFour: ['',],
      yearSonFour: ['',],
      genderSonFour: ['',],
      ocupacitySonFour:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],

    //Designation beneficiary one
      nameBeneficiaryOne:['', [this.beneficiaryCapture == true? Validators.required : Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameBeneficiaryOne: ['', [this.beneficiaryCapture == true? Validators.required : Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameBeneficiaryOne: ['', [this.beneficiaryCapture == true? Validators.required : Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      percentageBeneficiaryOne: ['', [this.beneficiaryCapture == true? Validators.required : Validators.pattern('[0-9]+')]],
      relationshipBeneficiaryOne:['', ],

    //Designation beneficiary two
      nameBeneficiaryTwo:['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameBeneficiaryTwo: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameBeneficiaryTwo: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      percentageBeneficiaryTwo: ['', [Validators.pattern('[0-9]+')]],
      relationshipBeneficiaryTwo:['',],

    //Credit card
      nameCard:['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      firstnameCard: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastnameCard: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      cardNumber: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      monthCard: ['', Validators.required],
      yearCard: ['', Validators.required],
      cvcCard: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    })


  }

  ngOnInit() {
    SrPago.setLiveMode(false);
    SrPago.setPublishableKey("pk_dev_5e8f53c56baacfVbVL");


    //Activa o desactiva la vista de captura de segurados adicionales y beneficiarios
    this.aditionalsCapture = false;

    //Son los select de día, mes y año
    this.days = days;
    this.months = months;
    this.years = years;
    this.yearsCard = yearsCard;

    console.log(this.days)
    console.log(days)

    //Son select de estado civil y género
    this.maritals = maritals;
    this.genders = genders;


  }


  // stripe payment gateway
  stripeCheckout() {
    this.loader.show();
    console.log("terminos", this.checked)
    this.onCLickSrPago()

    //Recibir el tipo de póliza


    //var dayInsured = this.checkoutForm.value && this.checkoutForm.value.day
    //var monthInsured = this.checkoutForm.value && this.checkoutForm.value.month
    //var yearInsured = this.checkoutForm.value && this.checkoutForm.value.year

    var day = this.checkoutForm.value && this.checkoutForm.value.day
    var month = this.checkoutForm.value && this.checkoutForm.value.month
    var year = this.checkoutForm.value && this.checkoutForm.value.year
    //var state = this.checkoutForm.value && this.checkoutForm.value.state
    var yearCard = this.checkoutForm.value && this.checkoutForm.value.yearCard
    //var marital = this.checkoutForm.value && this.checkoutForm.value.marital

    var daySpouse = this.checkoutForm.value && this.checkoutForm.value.daySpouse
    var monthSpouse = this.checkoutForm.value && this.checkoutForm.value.monthSpouse
    var yearSpouse = this.checkoutForm.value && this.checkoutForm.value.yearSpouse

    var daySonOne = this.checkoutForm.value && this.checkoutForm.value.daySonOne
    var monthSonOne = this.checkoutForm.value && this.checkoutForm.value.monthSonOne
    var yearSonOne = this.checkoutForm.value && this.checkoutForm.value.yearSonOne

    var daySonTwo = this.checkoutForm.value && this.checkoutForm.value.daySonTwo
    var monthSonTwo = this.checkoutForm.value && this.checkoutForm.value.monthSonTwo
    var yearSonTwo = this.checkoutForm.value && this.checkoutForm.value.yearSonTwo

    var daySonThree = this.checkoutForm.value && this.checkoutForm.value.daySonThree
    var monthSonThree = this.checkoutForm.value && this.checkoutForm.value.monthSonThree
    var yearSonThree = this.checkoutForm.value && this.checkoutForm.value.yearSonThree

    var daySonFour = this.checkoutForm.value && this.checkoutForm.value.daySonFour
    var monthSonFour = this.checkoutForm.value && this.checkoutForm.value.monthSonFour
    var yearSonFour = this.checkoutForm.value && this.checkoutForm.value.yearSonFour

    function functionMyFindDay(data){
      return data.value === day
    }
    function functionMyFindMonth(data){
      return data.value === month
    }
    function functionMyFindYear(data){
      return data.value === year
    }

    //function functionMyFindState(data){
    //  return data.value === state
    //}

    function functionMyFindYeardcard(data){
      return data.value === yearCard
    }

    //function functionMyFindMarital(data){
    //  return data.value === marital
    //}

    function functionMyFindDaySpouse(data){
      return data.value === daySpouse
    }
    function functionMyFindMonthSpouse(data){
      return data.value === monthSpouse
    }
    function functionMyFindYearSpouse(data){
      return data.value === yearSpouse
    }

    function functionMyFindDaySonOne(data){
      return data.value === daySonOne
    }
    function functionMyFindMonthSonOne(data){
      return data.value === monthSonOne
    }
    function functionMyFindYearSonOne(data){
      return data.value === yearSonOne
    }

    function functionMyFindDaySonTwo(data){
      return data.value === daySonTwo
    }
    function functionMyFindMonthSonTwo(data){
      return data.value === monthSonTwo
    }
    function functionMyFindYearSonTwo(data){
      return data.value === yearSonTwo
    }

    function functionMyFindDaySonThree(data){
      return data.value === daySonThree
    }
    function functionMyFindMonthSonThree(data){
      return data.value === monthSonThree
    }
    function functionMyFindYearSonThree(data){
      return data.value === yearSonThree
    }

    function functionMyFindDaySonFour(data){
      return data.value === daySonFour
    }
    function functionMyFindMonthSonFour(data){
      return data.value === monthSonFour
    }
    function functionMyFindYearSonFour(data){
      return data.value === yearSonFour
    }

    var dayInsured = this.days.find(functionMyFindDay)
    var monthInsured = this.months.find(functionMyFindMonth)
    var yearInsured = this.years.find(functionMyFindYear)
    //var stateInsured = this.states.find(functionMyFindState)

    var yearCardInsured = this.yearsCard.find(functionMyFindYeardcard)
    //var maritalInsured = this.maritals.find(functionMyFindMarital)

    var dayFindSpouse = this.days.find(functionMyFindDaySpouse)
    var monthFindSpouse = this.months.find(functionMyFindMonthSpouse)
    var yearFindSpouse = this.years.find(functionMyFindYearSpouse)

    var dayFindSonOne = this.days.find(functionMyFindDaySonOne)
    var monthFindSonOne = this.months.find(functionMyFindMonthSonOne)
    var yearFindSonOne = this.years.find(functionMyFindYearSonOne)

    var dayFindSonTwo = this.days.find(functionMyFindDaySonTwo)
    var monthFindSonTwo = this.months.find(functionMyFindMonthSonTwo)
    var yearFindSonTwo = this.years.find(functionMyFindYearSonTwo)

    var dayFindSonThree = this.days.find(functionMyFindDaySonThree)
    var monthFindSonThree = this.months.find(functionMyFindMonthSonThree)
    var yearFindSonThree = this.years.find(functionMyFindYearSonThree)

    var dayFindSonFour = this.days.find(functionMyFindDaySonFour)
    var monthFindSonFour = this.months.find(functionMyFindMonthSonFour)
    var yearFindSonFour = this.years.find(functionMyFindYearSonFour)

    var birthInsured = (`${dayInsured.label}-${monthInsured.label}-${yearInsured.label}`)
    var birthSpouse = (`${dayFindSpouse.label}-${monthFindSpouse.label}-${yearFindSpouse.label}`)
    var birthSonOne = (`${dayFindSonOne.label}-${monthFindSonOne.label}-${yearFindSonOne.label}`)
    var birthSonTwo = (`${dayFindSonTwo.label}-${monthFindSonTwo.label}-${yearFindSonTwo.label}`)
    var birthSonThree = (`${dayFindSonThree.label}-${monthFindSonThree.label}-${yearFindSonThree.label}`)
    var birthSonFour = (`${dayFindSonFour.label}-${monthFindSonFour.label}-${yearFindSonFour.label}`)

    //var addressInsured = (`${this.checkoutForm.value && this.checkoutForm.value.address} #${this.checkoutForm.value && this.checkoutForm.value.number}`)


    var newTocken = localStorage.getItem('tokEnd')

    console.log('newToken', newTocken)
//Nuevo payload
    var accept_terms = this.checked
    var payload = {
      policy: {
        "requires_billing": "false",
        "company_id": 5,
        "seller_id": localStorage.getItem('id'),
        "payment_recurring": accept_terms,
        "total_amount": this.amount,
        "rate_coverage":
        [
          {
              "id": 1,
              "description": "MUERTE ACCIDENTAL (BÁSICA)",
              "deductible": "",
              "insurance_value": "",
              "rate_value": ""
          },
          {
              "id": 2,
              "description": "MUERTE ACCIDENTAL (ROBO CAJERO ELECTRÓNICO)",
              "deductible": "",
              "insurance_value": "",
              "rate_value": ""
          }
        ],
        "beneficiary": [
            {
              "name": this.checkoutForm.value && this.checkoutForm.value.nameBeneficiaryOne,
              "first_name": this.checkoutForm.value && this.checkoutForm.value.firstnameBeneficiaryOne,
              "last_name": this.checkoutForm.value && this.checkoutForm.value.lastnameBeneficiaryOne,
              "gender": "",
              "birth_date": "",
              "email": "",
              "phone": "",
              "address": "",
              "address_2":"",
              "city": {
                "label": "",
                "value": ""
              },
              "state": {
                "label": "",
                "value": ""
              },
              "zip_code":"",
              "country": "",
              "id_country": "",
              "id_card": "",
              "card_exp_date": "",
              "card_type": "",
              "marital_status":"",
              "employment":"",
              "percentage": this.checkoutForm.value && this.checkoutForm.value.percentageBeneficiaryOne,
              "relationship": this.checkoutForm.value && this.checkoutForm.value.relationshipBeneficiaryOne,
            },
            {
              "name": this.checkoutForm.value && this.checkoutForm.value.nameBeneficiaryTwo,
              "first_name": this.checkoutForm.value && this.checkoutForm.value.firstnameBeneficiaryTwo,
              "last_name": this.checkoutForm.value && this.checkoutForm.value.lastnameBeneficiaryTwo,
              "gender": "",
              "birth_date": "",
              "email": "",
              "phone": "",
              "address": "",
              "address_2":"",
              "city": {
                "label": "",
                "value": ""
              },
              "state": {
                "label": "",
                "value": ""
              },
              "zip_code":"",
              "country": "",
              "id_country": "",
              "id_card": "",
              "card_exp_date": "",
              "card_type": "",
              "marital_status":"",
              "employment":"",
              "percentage": this.checkoutForm.value && this.checkoutForm.value.percentageBeneficiaryTwo,
              "relationship": this.checkoutForm.value && this.checkoutForm.value.relationshipBeneficiaryTwo,
            }
        ],
        "policy_payer":
        {
              "name": "",
              "first_name": "",
              "last_name": "",
              "gender": "",
              "birth_date": "",
              "email": "",
              "phone": "",
              "address": "",
              "address_2":"",
              "city": {
                    "label": "",
                    "value": ""
              },
              "state": {
                    "label": "",
                    "value": ""
              },
              "zip_code":"",
              "country": "",
              "id_country": "",
              "id_card": "",
              "card_exp_date": "",
              "card_type": "",
              "marital_status":"",
              "employment":"",
              "percentage":"",
              "relationship":""
            },
        "insured_person":
        {
          "name": this.checkoutForm.value && this.checkoutForm.value.name,
          "first_name": this.checkoutForm.value && this.checkoutForm.value.firstname,
          "last_name": this.checkoutForm.value && this.checkoutForm.value.lastname,
          "gender": this.checkoutForm.value && this.checkoutForm.value.gender,
          "birth_date": birthInsured,
          "email": this.checkoutForm.value && this.checkoutForm.value.email,
          "phone": this.checkoutForm.value && this.checkoutForm.value.phone,
          "address": "",
          "address_2":"",
          "city": {
            "label": "",
            "value": ""
          },
          "state": {
            "label": "",
            "value": ""
          },
          "zip_code":"",
          "country": "MEX",
          "id_country": 1,
          "id_card": "",
          "card_exp_date": "",
          "card_type": "",
          "marital_status":"",
          "employment":"",
          "percentage":"",
          "relationship":""
        },
        "policy_type": this.policy_type,
        "policy_data": {}
      },
      "insurance_objects":
      [
          {
             "insurance_object_data":{
                "name": this.checkoutForm.value && this.checkoutForm.value.name,
                "first_name": this.checkoutForm.value && this.checkoutForm.value.firstname,
                "last_name": this.checkoutForm.value && this.checkoutForm.value.lastname,
                "gender": this.checkoutForm.value && this.checkoutForm.value.gender,
                "birth_date": birthInsured,
                "email": this.checkoutForm.value && this.checkoutForm.value.email,
                "phone": this.checkoutForm.value && this.checkoutForm.value.phone,
                "address":"",
                "address_2":"",
                "city":{
                   "label":"",
                   "value":""
                },
                "state":{
                   "label":"",
                   "value":""
                },
                "zip_code":"",
                "country":"MEX",
                "id_country":1,
                "id_card":"",
                "card_exp_date":"",
                "card_type":"",
                "marital_status":"",
                "employment":"",
                "percentage":"",
                "relationship":""
             }
          },
        {
             "insurance_object_data":{
                "name": this.checkoutForm.value && this.checkoutForm.value.nameSpouse,
                "first_name": this.checkoutForm.value && this.checkoutForm.value.firstnameSpouse,
                "last_name": this.checkoutForm.value && this.checkoutForm.value.lastnameSpouse,
                "gender": this.checkoutForm.value && this.checkoutForm.value.genderSpouse,
                "birth_date": birthSpouse,
                "email":"",
                "phone":"",
                "address":"",
                "address_2":"",
                "city":{
                   "label":"",
                   "value":""
                },
                "state":{
                   "label":"",
                   "value":""
                },
                "zip_code":"",
                "country":"MEX",
                "id_country":1,
                "id_card":"",
                "card_exp_date":"",
                "card_type":"",
                "marital_status":"",
                "employment":"Contador",
                "percentage":"",
                "relationship":""
             }
          }
       ],
       "pay_data":{
        "token": newTocken,
        "amount": this.amount
      }
    }

    console.log('checkoutForm',this.checkoutForm)
    console.log('payload',payload)

    this.operatorsService.sendPolicyToPay(payload).subscribe((response) => {
      console.log(response)
      this.purchase_result = response['data']
      if(response['code'] == 200){
        this.complete_purchase = true;
        this.success = true;
        this.loader.hide();
      }else{
        this.complete_purchase = true;
        this.success = false;
        this.loader.hide();
      }

    })



  }


  assign_product(name, price, policy_type){
    this.checkOutItems = {"name":name, "price": price, "policy_type": policy_type}
    this.policy_type = policy_type
    this.amount = price
    if(policy_type == 3){
      this.beneficiaryCapture = true;
    }

  }

  onCLickSrPago(){

    var onSuccessHandler = (result) => {

      this.tokenInput = result.token
      localStorage.setItem('tokEnd', this.tokenInput);
      result.token
    }

    //Crea error
    var onFailHandler = (error) => {
      console.log('onFailHandler',error)
    }

    //Crea nombre completo de tarjeta
    var holderName = (`${this.checkoutForm.value && this.checkoutForm.value.nameCard} ${this.checkoutForm.value && this.checkoutForm.value.firstnameCard} ${this.checkoutForm.value && this.checkoutForm.value.lastnameCard}`);

    //Crea año de tarjeta
    var yearCard = this.checkoutForm.value && this.checkoutForm.value.yearCard;

    function functionMyFindYeardcard(data){
      return data.value === yearCard
    };

    var yearCardInsured = this.yearsCard.find(functionMyFindYeardcard);

    //Crea tarjeta con datos de tarjeta
    var card = {
      number: this.checkoutForm.value && this.checkoutForm.value.cardNumber,
      holder_name: holderName,
      cvv: this.checkoutForm.value && this.checkoutForm.value.cvcCard,
      exp_month: this.checkoutForm.value && this.checkoutForm.value.monthCard,
      exp_year: yearCardInsured.label,
    }

    console.log('card',card)
    SrPago.token.create(card,onSuccessHandler,onFailHandler);

  }

}
