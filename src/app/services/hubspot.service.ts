import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Hubspot } from '../constants/hubspot';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HubspotService {
	private url = "https://qa2.sxkm.mx/v2/api/v1/web_services/";

	private vid = "";
	private access_token = "";

	constructor(private http: HttpClient) { }
	setVid(vid){
		this.vid = vid;
	}
	getVid(){
		return this.vid;
	}

	

}
