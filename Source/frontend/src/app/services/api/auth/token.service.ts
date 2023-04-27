import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Configuration } from '../service.settings';

@Injectable({
  providedIn: 'root'
})

export class TokenService {

    url:string = Configuration.url + 'auth/token.php';
  
    constructor(
        private http: HttpClient
    ) { }
  
    get():string|null
    {
      return localStorage.getItem('token');
    }

    save(jwt: string)
    {
        localStorage.setItem('token', jwt);
    }

    remove()
    {
        localStorage.removeItem('token');
    }

    isValid(jwt: string|null): Observable<any>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + jwt
        })
        return this.http.get(this.url, { headers: headers });
    }
  }