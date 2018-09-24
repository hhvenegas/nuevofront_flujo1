import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotes1',
  templateUrl: './quotes1.component.html',
  styleUrls: ['./quotes1.component.scss']
})
export class Quotes1Component implements OnInit {
	package_id = 1000;
	constructor() { }
	ngOnInit() {}
	mouseHover(id){
		this.package_id = id;
	}

}
