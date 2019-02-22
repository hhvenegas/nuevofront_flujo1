import { Injectable } from '@angular/core';
import swal from 'sweetalert';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }
  notifications(){
    if(localStorage.getItem("notifications")){
      swal("Tienes una llamada a las am","","success");
    }
  }
}
