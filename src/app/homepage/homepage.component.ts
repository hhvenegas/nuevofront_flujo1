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

    get_version(year, maker, model) {
     this.http.get('http://52.91.226.205/api/v1/quotations/model_versions?year='+year+'&maker='+maker+'&model='+model+'').subscribe(data => {
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
      let form_data = {
        "email": this.email_select,
        "maker_name": this.maker_select,
        "maker_id": this.maker_select,
        "year": this.years_selected,
        "car_model_name": this.model_select,
        "car_model_id": this.model_select,
        "version_name": this.version_select.name,
        "version_id": this.version_select.id,
        "zipcode": this.zip_code_select,
        "birth_date": this.birth_date_select,
        "gender": this.gender_select,
        "telephone": this.cellphone_select
      }
      this.http.post('http://52.91.226.205/api/v1/quotations/create_quotation',form_data).subscribe(data => {
        console.log(data);

      },
      error => console.log(error)  // error path
     );
    }


  	ngOnInit() {

    }

}
