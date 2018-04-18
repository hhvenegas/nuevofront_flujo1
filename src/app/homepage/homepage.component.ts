import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare var jQuery:any;
declare var $ :any;
import {FormBuilder,FormGroup,FormControl,Validators,NgForm} from '@angular/forms';



@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  title = 'Sxkm';
  tipo_flujo=2;//Si es caso A tipo_flujo es 1 si es caso B tipo_flujo es 2
  casoTitle='Carlos vive muy cerca de su trabajo';
  casoText='A veces usa su auto y otras se va caminando o en bici. \n Recorre en promedio 300 km al mes y paga $100 MXN más $299 MXN de la suscripción.';
  url_cotizar_btn = "#cotizada-tu-seguro";


  constructor(private http: HttpClient, private frmbuilder:FormBuilder) {
    var url_string = window.location.href ;
    var url = location.href.split( '/' );
    console.log("La url es: "+url_string);
    if(url[3]=='v2'){
      this.url_cotizar_btn = "v2#cotizada-tu-seguro";
      
    }
  }

    

    ngOnInit() {

      $("#idCaso1Image1").hide();
      $("#idCaso1Image3").hide();
      $("#idCaso2Image1").hide();
      $("#idCaso2Image2").hide();
      $("#idCaso3Image2").hide();
      $("#idCaso3Image3").hide();
      $("#sexo1 :checkbox").attr('checked', true);

      $("#carouselBeneficios").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if(direction=='right')
            $("#carouselBeneficios").carousel('prev');
          else 
            $("#carouselBeneficios").carousel('next');
          console.log("You swiped " + direction );  
        },
      });
      $("#carouselCasos").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if(direction=='right')
            $("#carouselCasos").carousel('prev');
          else 
            $("#carouselCasos").carousel('next');
          console.log("You swiped " + direction );  
        },
      });
      $("#carouselCobertura").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if(direction=='right')
            $("#carouselCobertura").carousel('prev');
          else 
            $("#carouselCobertura").carousel('next');
          console.log("You swiped " + direction );  
        },
      });

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
    ejecutarClick(id,id_ant){
      $("#"+id).trigger("click");
      $("#"+id+"2").trigger("click");
      $("#"+id_ant).removeClass('active');
      $("#"+id).addClass('active');
      $("#"+id_ant+"2").removeClass('active');
      $("#"+id+"2").addClass('active');
    }
    
}
