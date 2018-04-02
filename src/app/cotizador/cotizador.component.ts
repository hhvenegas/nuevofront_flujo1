import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jQuery:any;
declare var $ :any;
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms'

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent implements OnInit {
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
    ngOnInit() {}
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
    	this.http.get('http://52.91.226.205/api/v1/quotations/model_versions?year='+this.years_selected+'&maker='+this.maker_select+'&model='+this.model_select+'').subscribe(
    		data => {
       			this.versions = data;
       			console.log(data);
     		},
     		error => console.log(error)  // error path
    	);
    }
    get_years() {
      	this.http.get('http://52.91.226.205/api/v1/quotations/years').subscribe(
	      	data => {
	        	this.years = data;
	        	console.log(data);
	      	},
	      	error => console.log(error)  // error path
	    );
    }
    get_makers() {
     	this.http.get('http://52.91.226.205/api/v1/quotations/makers').subscribe(
	     	data => {
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
		            "version_name": angular_this.version_select,
		            "version_id": angular_this.version_select,
		            "zipcode": angular_this.zip_code_select,
		            "birth_date": angular_this.birth_date_select,
		            "gender": angular_this.gender_select,
		            "telephone": angular_this.cellphone_select
	          	}
	          	angular_this.http.post('http://52.91.226.205/api/v1/quotations/create_quotation',form_data).subscribe(
	          		data => {
	            		console.log(data);
	            		$('#idModalSuccess').modal('toggle'); //Modal de éxito de cotización //Le hace falta validar el codigo postal
	          		},
	          		error =>{ 
	            		console.log(error)  // error path
	            		$('#idModalError').modal('toggle'); //Modeal de error de cotización
	          		}
	         	);
	        }
       	});
    }


    changeGender(){
      var angular_this = this
      setTimeout(function(){  angular_this.gender_select = $("input[name='sexo']:checked").val(); }, 1000);
    }


}
