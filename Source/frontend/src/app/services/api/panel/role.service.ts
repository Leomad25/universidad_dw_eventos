import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class RoleService {

    url:string = Configuration.url + 'panel/roles.php';

    constructor(
        private http: HttpClient
    ) {}

    getAllRoles(jwt: string | null): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        return this.http.get(this.url, { headers: headers });
    }

    changeRole(jwt: string | null, iduser: number, newRole: number): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        const body = {
            iduser: iduser,
            idrole: newRole
        }
        return this.http.put(Configuration.url + 'panel/usersRoles.php', body, { headers: headers });
    }
}