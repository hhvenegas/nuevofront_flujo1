import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Api} from "../api.constants";
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms';
import { Meta, Title } from "@angular/platform-browser";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
//import { HostListener } from '@angular/core'



declare var $:any;


@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent implements OnInit {
  //Bandera 
  bandera: any = 1; // homepage

  //Formulario
  all_makers:       any = Array();
  all_years:        any = Array();
  all_models:       any = Array();
  all_versions:     any = Array();
  all_days_birth:   any = Array();
  all_months_birth: any = Array();
  all_years_birth:  any = Array();
  input_check1:     any = false;
  input_check2:     any = false;
  input_check3:     any = false;

  //Cotizador desktop
  disable_makers:   any = false;
  disable_models:   any = true;
  disable_versions: any = true;
  //Cotizador mobile

  //Errores del formulario
  error_maker:       any = "";
  error_year:        any = "";
  error_model:       any = "";
  error_version:     any = "";
  error_zipcode:     any = "";
  error_day_birth:   any = "";
  error_month_birth: any = "";
  error_year_birth:  any = "";
  error_email:       any = "";
  error_cellphone:   any = "";
  error_checkbox1:   any = "";
  error_checkbox2:   any = "";
  error_checkbox3:   any = "";


  //Paso del cotizador
  paso: any = 1;


  //Datos para enviar a cotizador
  maker:        any = "";
  year:         any = "";
  model:        any = "";
  version:      any = "";
  sisa:         any = "";
  maker_name:   any = "";
  version_name: any = "";
  day_birth:    any = "";
  month_birth:  any = "";
  year_birth:   any = "";
  birth_date:   any = "";
  zipcode:      any = "";
  gender:       any = 2;
  email:        any = "";
  cellphone:    any = "";

  //respuesta de la cotizacion
  cotizacion:   any;
  tiempo:       any = 2; 
  constructor(private http: HttpClient,private router : Router, private frmbuilder:FormBuilder,private meta: Meta,private title: Title) { 
  }
  /**@HostListener('window:scroll') onScroll() {
    let beginY = document.documentElement.scrollTop;
    let d = document.getElementById("pantalla2");
    let topPos = d.offsetTop;
    //if(beginY>=topPos)
      //console.log("Pantalla 2");
  }**/

  ngOnInit() {
    var url_string = this.router.url ;
    //console.log(url_string);
    if(url_string==Api.COTIZADOR_V2){
      this.bandera=2;
    }
    this.get_makers();
    this.get_years();
    this.get_days_birth();
    this.get_months_birth();
    this.get_years_birth();
    
  }
  get_makers() {
    this.http.get(Api.DEVELOPMENT_DOMAIN+'quotations/makers/').subscribe(
      data => {
        this.all_makers = data;
        this.disable_makers = false;
        //console.log(this.all_makers);
      },
      error => {
        console.log(error)  // error path
      }
    );
  }
  get_years() {
    var date = new Date();
    var year = date.getFullYear()+1;
    for(var i = year; i>=(year-16);i--){
      this.all_years.push(i);
    }
    //console.log(this.all_years);
  }
  get_models() {
    this.clean_maker();
    this.clean_year();
    this.clean_models();
    this.clean_versions();
    if(this.maker!="" && this.year!=""){
      this.http.get(Api.DEVELOPMENT_DOMAIN+'quotations/models?year='+this.year+'&maker='+this.maker).subscribe(
          data => {
            this.all_models = data;
            if(data!=null || this.all_models!="") this.disable_models = false;
            this.set_maker();
            //console.log(this.all_models);
          },
          error => {
            console.log(error)  // error path
          }
      );
    }
  }
  get_versions(){
    this.clean_versions();
    this.http.get(Api.DEVELOPMENT_DOMAIN+'quotations/model_versions?year='+this.year+'&maker='+this.maker+'&model='+this.model+'').subscribe(
      data => {
        this.all_versions = data;
        if(this.all_versions=='') this.all_versions=null;
        if(this.all_versions!=null || this.all_versions!="") this.disable_versions = false;
      },
      error => {
        console.log(error)  // error path
      }
    );
  }
  get_days_birth(){
    for(var i = 1; i<=31;i++){
      if(i<10)
        this.all_days_birth.push("0"+i);
      else this.all_days_birth.push(i);
    }
    //console.log(this.all_days_birth);
  }
  get_months_birth(){
    for(var i = 1; i<=12;i++){
      if(i<10)
        this.all_months_birth.push("0"+i);
      else this.all_months_birth.push(i);
    }
    //console.log(this.all_months_birth);
  }
  get_years_birth() {
    var date = new Date();
    var year = date.getFullYear()-21;
    for(var i = year; i>=(year-70);i--){
      this.all_years_birth.push(i);
    }
    //console.log(this.all_years_birth);
  }
  get_sisa(){
    this.sisa = "";
    this.http.get(Api.DEVELOPMENT_DOMAIN+'quotations/version_id?year='+this.year+'&maker='+this.maker+'&model='+this.version).subscribe(
      data => {
        this.sisa = data;
        //console.log("SISA"+this.sisa);
      },
      error => {
        console.log(error)  // error path
      }
    );
  }

  set_maker(){
    this.maker_name = "";
    for (let maker of this.all_makers) {
      if(this.maker==maker.id)
        this.maker_name = maker.name;
    }
    //console.log("MARCA: "+this.maker_name);
  }
  set_version(){
    this.version_name = "";
    for (let version of this.all_versions) {
      if(this.version==version.id){
        this.version_name = version.name;
        this.get_sisa();
      }
    }
    //console.log("Version: "+this.version_name);
  }
  set_gender(gender){
    this.gender = gender
  }
  set_check(input){
    if(input==1){
      if(this.input_check1==false){
        this.input_check1=true;
        this.error_checkbox1 = "";
      }
      else this.input_check1=false;
    }
    if(input==2){
      if(this.input_check2==false){
        this.input_check2=true;
        this.error_checkbox2 = "";
      }
      else this.input_check2=false;
    }
    if(input==3){
      if(this.input_check3==false){
        this.input_check3=true;
        this.error_checkbox3 = "";
      }
      else this.input_check3=false;
    }
  }
  clean_maker(){
    this.error_maker = "";
  }
  clean_year(){
    this.error_year = "";
  }
  clean_models(){
    this.all_models = Array();
    this.model = "";
    this.disable_models = true;
    this.error_model="";
  }
  clean_versions(){
    this.all_versions = Array();
    this.version = "";
    this.error_version="";
    this.disable_versions = true;
  }

  continuar_desktop(paso, form){
    var siguiente = true;
    if(paso==2){
      if(this.maker==""){
        siguiente=false;
        this.error_maker="invalid border-danger";
      }
      else{
        this.error_maker="";
      }
      if(this.year==""){
        siguiente=false;
        this.error_year="invalid border-danger";
      }
      else{
        this.error_year="";
      }
      if(this.model==""){
        siguiente=false;
        this.error_model="invalid border-danger";
      }
      else{
        this.error_model="";
      }
      if(this.version==""){
        siguiente=false;
        this.error_version="invalid border-danger";
      }
      else{
        this.error_version="";
        this.set_version();
      }
    }
    if(paso==3){
      if(this.zipcode==""){
        siguiente=false;
        this.error_zipcode="invalid border-danger";
      }
      else this.error_zipcode = "";
      if(this.day_birth==""){
        siguiente=false;
        this.error_day_birth="invalid border-danger";
      }
      else this.error_day_birth = "";
      if(this.month_birth==""){
        siguiente=false;
        this.error_month_birth="invalid border-danger";
      }
      else this.error_month_birth = "";
      if(this.year_birth==""){
        siguiente=false;
        this.error_year_birth="invalid border-danger";
      }
      else this.error_year_birth = "";
      if(this.email==""){
        siguiente=false;
        this.error_email="invalid border-danger";
      }
      else{ 
        //validar si es correo 
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var serchfind = regexp.test(this.email);
        //console.log(serchfind);
        if(!serchfind){
          siguiente=false;
          this.error_email="invalid border-danger";
        }
        else this.error_email = "";
      }
      if(this.cellphone==""){
        siguiente=false;
        this.error_cellphone="invalid border-danger";
      }
      else{
        if(this.cellphone.length<10){
          siguiente=false;
          this.error_cellphone="invalid border-danger";
        }
        else this.error_cellphone = "";
      }
      if(this.input_check1==false){
        siguiente=false;
        this.error_checkbox1="invalid border-danger";
      }
      else this.error_checkbox1 = "";
      if(this.input_check2==false){
        siguiente=false;
        this.error_checkbox2="invalid border-danger";
      }
      else this.error_checkbox2 = "";
      if(this.input_check3==false){
        siguiente=false;
        this.error_checkbox3="invalid border-danger";
      }
      else this.error_checkbox3 = "";
    }
    if(siguiente){
      this.paso = paso;
      if(this.paso==3){
        $("#idModalCotizando").modal("show");
        setInterval(()=>{
            this.tiempo++;
            //console.log(this.tiempo);
        }, 1000);
        this.send_quotation();
      }
    }
  }
  continuar_mobile(paso,id){
    var siguiente = true;
    if(paso==2){
      this.maker = id;
      this.set_maker();
      this.get_models();
    }
    if(paso==3){
      this.year = id;
      this.get_models();
    }
    if(paso==4){
      this.model = id;
      this.get_versions();
    }
    if(paso==5){
      this.version = id;
      this.set_version();
    }
    if(paso==6){
      if(this.zipcode==""){
        siguiente=false;
        this.error_zipcode="invalid border-danger";
      }
      else this.error_zipcode = "";
      if(this.day_birth==""){
        siguiente=false;
        this.error_day_birth="invalid border-danger";
      }
      else this.error_day_birth = "";
      if(this.month_birth==""){
        siguiente=false;
        this.error_month_birth="invalid border-danger";
      }
      else this.error_month_birth = "";
      if(this.year_birth==""){
        siguiente=false;
        this.error_year_birth="invalid border-danger";
      }
      else this.error_year_birth = "";
      if(this.email==""){
        siguiente=false;
        this.error_email="invalid border-danger";
      }
      else{ 
        //validar si es correo 
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var serchfind = regexp.test(this.email);
        //console.log(serchfind);
        if(!serchfind){
          siguiente=false;
          this.error_email="invalid border-danger";
        }
        else this.error_email = "";
      }
      if(this.cellphone==""){
        siguiente=false;
        this.error_cellphone="invalid border-danger";
      }
      else{
        if(this.cellphone.length<10){
          siguiente=false;
          this.error_cellphone="invalid border-danger";
        }
        else this.error_cellphone = "";
      }
      if(this.input_check1==false){
        siguiente=false;
        this.error_checkbox1="invalid border-danger";
      }
      else this.error_checkbox1 = "";
      if(this.input_check2==false){
        siguiente=false;
        this.error_checkbox2="invalid border-danger";
      }
      else this.error_checkbox2 = "";
      if(this.input_check3==false){
        siguiente=false;
        this.error_checkbox3="invalid border-danger";
      }
      else this.error_checkbox3 = "";
    }
    console.log(id);
    if(siguiente){
      this.paso = paso;
      let bar = (paso*16.67)+"%";
      $("#progress-bar").css("width",bar);
      if(this.paso==6){
        this.send_quotation();
      }
    }
  }
  prev(form){
    if(form=='quotation_form2'){
      let paso = this.paso-1;
      let bar = (paso*16.67)+"%";
      $("#progress-bar").css("width",bar);
    }
    if(form=='quotation_form1' && this.paso == 2){
      this.input_check1 = false;
      this.input_check2 = false;
      this.input_check3 = false;
    }
    if(form=='quotation_form2' && this.paso > 4 ){
      this.input_check1 = false;
      this.input_check2 = false;
      this.input_check3 = false;
    }
    if(this.paso > 5 && form =='quotation_form2')
      this.paso = 5;
    else this.paso = this.paso-1;
  }
  send_quotation(){
    let form = {
      "maker"        : this.maker,
      "year"         : this.year,
      "model"        : this.model,
      "version"      : this.version,
      "sisa"         : this.sisa,
      "maker_name"   : this.maker_name,
      "version_name" : this.version_name,
      "birth_date"   : this.year_birth+"-"+this.month_birth+"-"+this.day_birth,
      "zipcode"      : this.zipcode,
      "gender"       : this.gender,
      "email"        : this.email,
      "cellphone"    : this.cellphone
    }
    console.log(form);
    this.http.post(Api.API_DOMAIN+'api/v1/web_services/create_quote',form).subscribe(
      data => {
        $("#idModalCotizando").modal("hide");
        this.cotizacion = data;
        this.router.navigate(["/costo-paquetes-kilometros/"+this.cotizacion.quote.id]);
      },
      error => {
        if(this.bandera==2)
          this.paso= 7;
        else{ 
          $("#idModalCotizando").modal("hide");
          $("#idModalError").modal("show");
        }
        console.log(error)  // error path
      }
    );
  }


}