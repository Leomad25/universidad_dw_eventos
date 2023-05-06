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

    getUserByNick(jwt: string|null, input: string): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        return this.http.get(this.url + '?nickname=' + input, { headers: headers });
    }

    getUsersFilterByNick(jwt: string|null, input: string): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        const body = { nickname: input }
        return this.http.post(this.url, body, { headers: headers });
    }

    changeStatus(jwt: string|null, iduser: number, newStatus: boolean) {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        const body = { iduser: iduser, status: newStatus }
        return this.http.put(this.url, body, { headers: headers });
    }
}
