import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  constructor() { }
  validateCellphone(cellphone){
    let result = true;
    if(cellphone=="1234567890")
    result=false;
    if(cellphone=="9876543210")
    result=false;
    if(cellphone=="0000000000")
    result=false;
    if(cellphone=="1111111111")
    result=false;
    if(cellphone=="2222222222")
    result=false;
    if(cellphone=="3333333333")
    result=false;
    if(cellphone=="4444444444")
    result=false;
    if(cellphone=="5555555555")
    result=false;
    if(cellphone=="6666666666")
    result=false;
    if(cellphone=="7777777777")
    result=false;
    if(cellphone=="8888888888")
    result=false;
    if(cellphone=="9999999999")
    result=false;
    if(cellphone=="1010101010")
    result=false;
    if(cellphone=="1212121212")
    result=false;
    if(cellphone=="1313131313")
    result=false;
    if(cellphone=="1414141414")
    result=false;
    if(cellphone=="1515151515")
    result=false;
    if(cellphone=="1616161616")
    result=false;
    if(cellphone=="1717171717")
    result=false;
    if(cellphone=="1818181818")
    result=false;
    if(cellphone=="1919191919")
    result=false;
    if(cellphone=="2020202020")
    result=false;
    if(cellphone=="2121212121")
    result=false;
    if(cellphone=="2323232323")
    result=false;
    if(cellphone=="2424242424")
    result=false;
    if(cellphone=="2525252525")
    result=false;
    if(cellphone=="2626262626")
    result=false;
    if(cellphone=="2727272727")
    result=false;
    if(cellphone=="2828282828")
    result=false;
    if(cellphone=="2929292929")
    result=false;
    if(cellphone=="3030303030")
    result=false;
    if(cellphone=="313131313131")
    result=false;
    if(cellphone=="3232323232")
    result=false;
    if(cellphone=="3434343434")
    result=false;
    if(cellphone=="3535353535")
    result=false;

    
    

    console.log("La respuesta es: "+result);
    
    
  }
}
