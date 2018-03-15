import { Component } from '@angular/core';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

	public irCotizador(){
		$('#cotizada-tu-seguro').animate({
			scrollTop: '0px'
		}, 300);
  }
}
