import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})


export class LoaderService {
  constructor() { }

  show(){
    document.getElementById("myNav").style.width = "100%";
  }

  hide(){
    document.getElementById("myNav").style.width = "0%";
  }
}
