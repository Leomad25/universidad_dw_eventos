import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
    providedIn: 'root'
  })
export class RoleService {

    url:string = Configuration.url + 'panel/roles.php';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    getAllRoles(): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url, { headers: headers });
    }

    changeRole(iduser: number, newRole: number): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body = {
            iduser: iduser,
            idrole: newRole
        }
        return this.http.put(Configuration.url + 'panel/usersRoles.php', body, { headers: headers });
    }
}