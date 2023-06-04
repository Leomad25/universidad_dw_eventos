import { Injectable } from '@angular/core';
import { UserInterface } from '../models/user.model';
import { TokenService } from '../services/api/auth/token.service';
import { UserService } from '../services/api/panel/user.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserMethodsAux {

    constructor(
        private tokenService:TokenService,
        private userService:UserService
    ) {}

    async loadDataInfoAsync(): Promise<string | UserInterface> {
        var userData: UserInterface | string = "The token insert is invalid";
        let data = await lastValueFrom(this.userService.getUserData().pipe());
        if (data) { data = data.data;
            userData = {
                iduser: data.idusuario,
                nick: data.alias,
                fullname: data.nombre,
                document: data.documento,
                role: {
                    idrole: data.idrole,
                    tag: data.etiqueta,
                    weight: data.peso,
                    asignedBy: data.asigned_by,
                },
                active: data.activo,
            }
        }
        return userData;
    }
}