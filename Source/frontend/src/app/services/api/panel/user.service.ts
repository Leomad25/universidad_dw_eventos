import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    url:string = Configuration.url + 'panel/users.php';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    getUserData(): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url, { headers: headers });
    }

    getUserByNick(input: string): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url + '?nickname=' + input, { headers: headers });
    }

    getUsersFilterByNick(input: string): Observable<any>
    {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body = { nickname: input }
        return this.http.post(this.url, body, { headers: headers });
    }

    changeStatus(iduser: number, newStatus: boolean) {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body = { iduser: iduser, status: newStatus }
        return this.http.put(this.url, body, { headers: headers });
    }
}
