import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MultilenguajeService {
  activeLang:string;

  constructor(private translate: TranslateService) { }

  DefaultLenguage(lenguage){
    this.activeLang = lenguage
    this.translate.setDefaultLang(this.activeLang);
  }

  changeLenaguage(lenguage) {
		this.activeLang = lenguage;
		this.translate.use(this.activeLang);
	}
}
