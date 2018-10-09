import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
	private url = ''
	constructor(private http: HttpClient) { }

	/** POST: add a new hero to the server */
	sendLogin (login: Login): Observable<Login> {
	    return this.http.post<Login>(this.url+"", login, httpOptions).pipe(
	      tap((login: Login) => this.log('post')),
	      catchError(this.handleError<Login>('add quotation'))
	    );
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
		    console.error(error); // log to console instead
		 
		    // TODO: better job of transforming error for user consumption
		    this.log(`${operation} failed: ${error.message}`);
		 
		    // Let the app keep running by returning an empty result.
		    return of(result as T);
		};
	}
	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	    console.log(message)
	}
}
