import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';
import Swiper from 'swiper';
declare var M:any;

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
	active = 1;
	constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			let elems = document.querySelectorAll('.tabs');
			let instance = M.Tabs.init(elems, {});
		}
	}

	cambiar(active){
		this.active = active;
	}

}
