import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { LoginRequest, RegisterRequest } from 'src/app/models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url:string = Configuration.url + 'auth/login.php';

  constructor(
    private http: HttpClient
  ) {}

  sendLogin(data: LoginRequest):Observable<any> {
    return this.http.post<any>(this.url, data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url:string = Configuration.url + 'auth/register.php';

  constructor(
    private http: HttpClient
  ) {}

  sendRegister(data: RegisterRequest):Observable<any> {
    return this.http.post<any>(this.url, data);
  }
}