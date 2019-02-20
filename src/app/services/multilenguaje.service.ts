import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Lenguage } from '../constants/lenguage';
import { LENGUAGES } from '../constants/lenguages';
import { throwError, Observable, of } from 'rxjs';

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

  getLenguages(): Observable<Lenguage[]> {
		return of(LENGUAGES);
	}
}
