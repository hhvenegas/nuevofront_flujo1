import { Year } from './year';


var date = new Date();
var year = date.getFullYear()+1;
var years = Array();

for(var i = year; i>=(year-16);i--){
      years.push(i);
}
export const YEARS: Year[] = years;