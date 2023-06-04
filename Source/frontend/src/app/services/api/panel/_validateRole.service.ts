import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
    providedIn: 'root'
  })
export class ValidateRoleService {

    url:string = Configuration.url + 'panel/_validateRole.php';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    getRole(): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url, { headers: headers });
    }
}