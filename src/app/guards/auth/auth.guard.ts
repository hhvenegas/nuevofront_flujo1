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
					this.router.navigate(["/login"])
				}
			});
		}
		else this.router.navigate(["/login"])
		return true;
	}
}
