import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jquery:any;
declare var $ :any;
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms'


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
	title = 'Sxkm';
  years : any ;
  makers : any ;
  models: any;
  model_first :string="";
  versions: any;
  years_selected: any;
  maker_select: any;
  model_select: any;
  version_select: any;
  zip_code_select: any;
  birth_date_select: any;
  gender_select: any;
  email_select: any;
  cellphone_select: any;
  quotationForm:FormGroup;
  casoTitle = 'Carolina sólo usa su auto para ir a trabajar';
  casoText = 'Ella usa alrededor de 500 km al mes y \n paga $175 más $299 de la suscripción.';

  	constructor(private http: HttpClient, private frmbuilder:FormBuilder) {
      this.get_makers();
      this.get_years();
     }

     get_models() {
       if(this.years_selected  && this.maker_select ){
         this.http.get('http://52.91.226.205/api/v1/quotations/models?year='+this.years_selected+'&maker='+this.maker_select+'').subscribe(data => {
           this.models = data;
           console.log(data)
         },
         error => console.log(error)  // error path
       );
       }
    }

    get_version() {
     this.http.get('http://52.91.226.205/api/v1/quotations/model_versions?year='+this.years_selected+'&maker='+this.maker_select+'&model='+this.model_select+'').subscribe(data => {
       this.versions = data;
       console.log(data)
     },
     error => console.log(error)  // error path
    );
    }

    get_years() {
      this.http.get('http://52.91.226.205/api/v1/quotations/years').subscribe(data => {
        this.years = data;
        console.log(data);
      },
      error => console.log(error)  // error path
      );
    }

    get_makers() {
     this.http.get('http://52.91.226.205/api/v1/quotations/makers').subscribe(data => {
        this.makers = data;
       console.log(this.makers);

     },
     error => console.log(error)  // error path
    );
    }



    send_quotation(){
        var angular_this = this
        $("#quotation_form").validate({
        submitHandler: function(form) {
          let form_data = {
            "email": angular_this.email_select,
            "maker_name": angular_this.maker_select,
            "maker_id": angular_this.maker_select,
            "year": angular_this.years_selected,
            "car_model_name": angular_this.model_select,
            "car_model_id": angular_this.model_select,
            "version_name": angular_this.version_select.name,
            "version_id": angular_this.version_select.id,
            "zipcode": angular_this.zip_code_select,
            "birth_date": angular_this.birth_date_select,
            "gender": angular_this.gender_select,
            "telephone": angular_this.cellphone_select
          }
          angular_this.http.post('http://52.91.226.205/api/v1/quotations/create_quotation',form_data).subscribe(data => {
            console.log(data);

          },
          error => console.log(error)  // error path
         );
        }
       });
    }





  	ngOnInit() {
      $("#idCaso1Image2").hide();
      $("#idCaso1Image3").hide();
      $("#idCaso2Image1").hide();
      $("#idCaso2Image3").hide();
      $("#idCaso3Image1").hide();
      $("#idCaso3Image2").hide();
    }

  	casoChange(div,number){
      var active = $("#idCaso1ImageActive").val();
      $("#idCaso"+div+"Image"+number).hide();
      for (var i = 1; i <= 3; i++) {
        $("#idCaso1Image"+i).hide();
      }
      $("#idCaso1Image"+number).show();
      $("#idCaso"+div+"Image"+active).show();
      $("#idCaso1ImageActive").val(number);


      if (number == 1) {
        this.casoTitle = 'Carolina sólo usa su auto para ir a trabajar';
        this.casoText = 'Ella usa alrededor de 500 km al mes y \n paga $175 más $299 de la suscripción.';
      }
      if (number==2) {
        this.casoTitle='Pedro sólo usa su auto para ir a trabajar';
        this.casoText='El usa alrededor de 500 km al mes y \n paga $175 más $299 de la suscripción.';
      }
      if (number==3) {
        this.casoTitle='Juan sólo usa su auto para ir a trabajar';
        this.casoText='El usa alrededor de 500 km al mes y \n paga $175 más $299 de la suscripción.';
      }

    }
    casoHover(div,number){
      //$("#idCasoImage"+number).attr("src","/assets/img/sxkm-caso-color"+number+".jpg");
      $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-color.jpg");
    }
    casoHoverOut(div,number){
      $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-blanco"+number+".jpg");
    }

}
