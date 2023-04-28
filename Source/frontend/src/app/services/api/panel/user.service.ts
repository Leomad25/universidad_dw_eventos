import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = Configuration.url + 'panel/users.php';

  constructor(
    private http: HttpClient
  ) {}

  getUserData(jwt: string|null): Observable<any>
  {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get(this.url, { headers: headers });
  }
}
