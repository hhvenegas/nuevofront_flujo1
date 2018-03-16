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
	casoTitle = 'Carolina sólo usa su auto para ir a trabajar';
	casoText = 'Ella usa alrededor de 500 km al mes y \n paga $175 más $299 de la suscripción.';
  	constructor() { }

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
