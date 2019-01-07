import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	session: any;
	constructor(private router: Router, private loginService: LoginService){}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if(localStorage.getItem("user")){
			this.loginService.validateSession()
			.subscribe((data:any)=>{
				if(!data.result){
					localStorage.removeItem("user");
					localStorage.removeItem("rol");
					localStorage.removeItem("seller_id");
					localStorage.removeItem("seller_company");
					localStorage.removeItem("quote_info");
					localStorage.removeItem("policies_info");
					window.location.pathname = 'login';
					//this.router.navigate(["/login"])
				}
			});
		}
		else this.router.navigate(["/login"])
		return true;
	}
}
