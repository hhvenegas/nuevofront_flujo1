import { Injectable } from '@angular/core';
import swal from 'sweetalert';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notification: any = [
    {
      policy_id: 5000,
      time: "2019-02-22T13:02:45.860Z"
    }
  ]
  constructor() { }
  notifications(){
    
    console.log("Notificaciones")
    setInterval(()=>{
      console.log("HOLA")
      this.notification.forEach(element => {
        let h = new Date(element.time)
        let hora = new Date();
        console.log(h)
        if(element.time== new Date().toDateString)
          swal("Tienes una llamada a las "+element.policy_id,"","success");
      });
    }, 5000);
  }
  
}
