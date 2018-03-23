import { Component, OnInit } from '@angular/core';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
	  title = 'Sxkm';
	  casoTitle='Carlos vive muy cerca de su trabajo';
    casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 300 km al mes y paga $100 MXN más $299 MXN de la suscripción.';
  	constructor() { }

  	ngOnInit() {
      $("#idCaso1Image1").hide();
      $("#idCaso1Image3").hide();
      $("#idCaso2Image1").hide();
      $("#idCaso2Image2").hide();
      $("#idCaso3Image2").hide();
      $("#idCaso3Image3").hide();
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
        this.casoTitle = 'Fernanda trabaja por su cuenta';
        this.casoText = 'Generalmente usa su auto los fines de semana, para salir de la Ciudad con su perro. Más o menos recorre 700 km al mes y paga $217 MXN más $299 MXN de la suscripción.';
      }
      if (number==2) {
        this.casoTitle='Carlos vive muy cerca de su trabajo';
        this.casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 300 km al mes y paga $100 MXN más $299 MXN de la suscripción.';
      }
      if (number==3) {
        this.casoTitle='En casa de Julio tienen tres coches';
        this.casoText='Cuando se trata de salir en plan familiar, la camioneta de su esposa es perfecta.\nRecorre muy pocos km al mes y ahora paga menos del 50% de lo que pagaba antes por su seguro.';
      }
    }
    casoHover(div,number){
      $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-color"+number+".jpg");
    }
    casoHoverOut(div,number){
      $("#idCaso"+div+"Image"+number).attr("src","/assets/img/sxkm-caso-blanco"+number+".jpg");
    }
    enviarCotizacion(){
      //$('#idModal').modal('toggle');
      $("#myform").validate({
        errorClass: "invalid border-danger",
        rules: {
          // simple rule, converted to {required:true}
          marca : "required",
          anio: "required",
          modelo: "required",
          version: "required",
          codigo_postal: {
            required: true,
            digits: true,
            minlength: 5
          },
          fecha_nacimiento: "required",
          celular: {
            required: true,
            //digits: true,
            minlength: 8
          },
          correo: {
            required: true,
            email: true
          },
          checkbox_cotizador1:{
            required: true
          },
          checkbox_cotizador2:{
            required: true
          },
          checkbox_cotizador3:{
            required: true
          },
        },
        messages: {
          marca:{ 
            required: "Debes seleccionar la marca de tu vehículo"
          },
          anio:{ 
            required: "Debes seleccionar el año de tu vehículo"
          },
          modelo:{ 
            required: "Debes seleccionar el modelo de tu vehículo"
          },
          version:{ 
            required: "Debes seleccionar la versión de tu vehículo"
          },
          codigo_postal:{ 
            required: "Debes ingresar tu código postal",
            digits : "Código Postal inválido",
            minlength: jQuery.validator.format("El código postal debe ser por lo menos de 5 dígitos")
          },
          fecha_nacimiento:{ 
            required: "Debes seleccionar tu fecha de necimiento"
          },
          celular:{ 
            required: "Debes ingresar tu número de teléfono",
            //digits : "Número inválido",
            minlength: jQuery.validator.format("El teléfono debe ser por lo menos de 8 dígitos")
          },
          correo: {
            required: "Debes ingresar un correo eléctrónico",
            email: "Correo inválido. Tu correo debe llevar un formato como ejemplo@correo.com"
          },
          checkbox_cotizador1:{
            required: "Debes confirmar que el auto no es legalizado, fronterizo o de salvamento y no tiene siniestros por reclamar."
          },
          checkbox_cotizador2:{
            required: "Debes confirmar que el auto no es utilizado para fines de carga, comercio o lucro."
          },
          checkbox_cotizador3:{
            required: "Debes confirmar que el auto no es Uber o similares."
          }
        }
      });
    }
}
