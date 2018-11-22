import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swiper from 'swiper';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
	active = 1;
	constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
	ngOnInit() {
	}

	cambiar(active){
		this.active = active;
	}

}
