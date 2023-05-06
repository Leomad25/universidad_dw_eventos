import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class RoleService {

    url:string = Configuration.url + 'panel/events.php';

    constructor(
        private http: HttpClient
    ) {}

    createEvent(
        jwt: string | null, name: string, description: string, manager: number, dateInit: string, dateEnd: string
        ): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
        const body: CreateEventBodyInterface = {
            name,
            description,
            manager,
            dateInit,
            dateEnd
        }
        return this.http.post(this.url, body, { headers: headers });
    }
}

interface CreateEventBodyInterface {
    name: string;
    description: string;
    manager: number;
    dateInit: string;
    dateEnd: string;
}