import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AppService {

  constructor() {
    
  }

}
