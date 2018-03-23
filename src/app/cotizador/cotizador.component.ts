import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent implements OnInit {
	title = 'Sxkm- Cotizaciones B';
	tipo ='A'; //Distinguir si es el caso A o B de las cotizaciones
	/** Valores para caso A **/
	idActive= 1;
	colExt = 10;
	col = 3; //Tamaño de las columnas

	planes = [
		  { id:1,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia'},
		  { id:2,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia'},
		  { id:3,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia'},
		  { id:4,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia' }
		  //{ //id:4,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia' },
		  //{ //id:5,km: '3,000', precio: '1480', vigencia: '1 mes de vigencia' }
		];


  	constructor() { }

  	ngOnInit() {
  		
  		/**Valores para caso B**/
  		if(this.tipo=='B'){
  			this.idActive=3;
  			this.col=2;
  			this.colExt=12;
  		}
  	}

  	cambiarActivo(number){
  		for(var i=1;i<=this.planes.length;i++){
  			if(i==number) this.activeCards(i);
  			else this.inactiveCards(i);
  		}
  	}

  	activeCards(number){
  		$("#idPaqueteHeader"+number).removeClass("inactive");
  		$("#idPaqueteBody"+number).removeClass("inactive");
  		$("#idPaqueteBodyPrice"+number).removeClass("span-price-paquetes");
  		$("#idPaqueteFooter"+number).removeClass("inactive");
  		$("#idPaqueteBoton"+number).removeClass("btn-gray");


  		$("#idPaqueteHeader"+number).addClass("active");
  		$("#idPaqueteBody"+number).addClass("active");
  		$("#idPaqueteBodyPrice"+number).addClass("span-price-paquetes-active");
  		$("#idPaqueteFooter"+number).addClass("active");
  		$("#idPaqueteFooter"+number).addClass("card-footer-active ");
  		$("#idPaqueteBoton"+number).addClass("btn-green");
  		$("#idPaquete"+number).addClass("active-card");
  	}
  	inactiveCards(number){
  		$("#idPaqueteHeader"+number).removeClass("active");
  		$("#idPaqueteBody"+number).removeClass("active");
  		$("#idPaqueteBodyPrice"+number).removeClass("span-price-paquetes-active");
  		$("#idPaqueteFooter"+number).removeClass("active");
  		$("#idPaqueteFooter"+number).removeClass("card-footer-active ");
  		$("#idPaqueteBoton"+number).removeClass("btn-green");
  		$("#idPaquete"+number).removeClass("active-card");


  		$("#idPaqueteHeader"+number).addClass("inactive");
  		$("#idPaqueteBody"+number).addClass("inactive");
  		$("#idPaqueteBodyPrice"+number).addClass("span-price-paquetes");
  		$("#idPaqueteFooter"+number).addClass("inactive");
  		$("#idPaqueteBoton"+number).addClass("btn-gray");
  	}

}
