import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuration } from '../service.settings';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/models/event.model';
import { TokenService } from '../auth/token.service';

@Injectable({
    providedIn: 'root'
  })
export class EventService {

    url:string = Configuration.url + 'panel/events.php';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    createEvent(
        name: string, description: string, manager: number, dateInit: string, dateEnd: string
        ): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body: CreateEventBodyInterface = {
            name,
            description,
            manager,
            dateInit,
            dateEnd
        }
        return this.http.post(this.url, body, { headers: headers });
    }

    getEventByManager(): Observable<any> {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url, { headers: headers });
    }

    getEventById(id: number) {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        return this.http.get(this.url + '?idevent=' + id, { headers: headers });
    }

    updateEventById(event: EventInterface) {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body = {
            idevent: event.idevent,
            description: event.description,
            isUrl: event.isUrl,
            direction: event.direction
        }
        return this.http.put(this.url, body, { headers: headers });
    }

    updateStatusEventById(event: EventInterface) {
        const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.tokenService.get()});
        const body = {
            idevent: event.idevent,
            status: event.status
        }
        return this.http.put(this.url, body, { headers: headers });
    }
}

interface CreateEventBodyInterface {
    name: string;
    description: string;
    manager: number;
    dateInit: string;
    dateEnd: string;
}