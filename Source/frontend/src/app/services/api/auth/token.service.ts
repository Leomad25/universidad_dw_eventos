import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    isValid(): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.get()})
        return this.http.get(this.url, { headers: headers });
    }
}