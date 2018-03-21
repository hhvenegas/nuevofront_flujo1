import { Component, OnInit } from '@angular/core';
declare var jquery:any;
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

}
