import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, lastValueFrom } from 'rxjs';

import { TokenService } from '../../../../services/api/auth/token.service';
import { UserService } from '../../../../services/api/panel/user.service';
import { RoleService } from '../../../../services/api/panel/role.service';
import { ValidateRoleService } from '../../../../services/api/panel/_validateRole.service'

import { UserInterface } from '../../../../models/user.model'

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.component.html',
    styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
    title:string = 'User Manager';
    form = new FormGroup({
        nickname: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    usersList:string[] = [];
    userIsValid:boolean = false;
    userInfo:UserInterface|undefined;

    rolesList:RoleItemInterface[] = [];

    formUpdateValid:boolean = false;
    formUpdateUser = new FormGroup({
        isUserActive: new FormControl<boolean>(false),
        selectedRole: new FormControl<number>(0)
    });

    @Input() iduser:number|undefined;
    @Output('onError') emitOnError:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onSuccess') emitOnSuccess:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onLoading') emitOnLoading:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onRedirectHome') emitOnRedirectHome:EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private roleService: RoleService,
        private validateRoleService: ValidateRoleService
    ) {}

    async ngOnInit(): Promise<void> {
        Promise.resolve().then(() => { this.emitOnLoading.emit(true); });
        await this.validateRoleRequired();
        await this.usernameValueChange();
        Promise.resolve().then(() => { this.emitOnLoading.emit(false); });
    }

    private async validateRoleRequired() {
        let data = await lastValueFrom(this.validateRoleService.getRole())
            .catch((err) => {
                const message = err.error?.responsive?.message;
                this.emitOnError.emit([message]);
                this.emitOnRedirectHome.emit();
            });
        if (data)
            if (data.data.admin) return;
        this.emitOnError.emit(['Err: Role Administrator required']);
        this.emitOnRedirectHome.emit();
    }

    private usernameValueChange() {
        this.form.controls['nickname'].valueChanges
            .pipe(debounceTime(500))
            .subscribe(async (value) => {
                this.usersList = [];
                if (value != null && value.length > 0) {
                    const data = await lastValueFrom(this.userService.getUsersFilterByNick(value))
                        .catch((err) => {
                            const errData = err.error?.responsive?.message;
                            this.emitOnError.emit([errData]);
                        });
                    if (data != null) {
                        if (!data.data?.error) {
                            for(let item of data.data) {
                                if (item.idusuario == this.iduser) continue;
                                this.usersList.push(item.alias);
                            }
                        }
                    }
                }
            })
    }

    private async loadRolesList() {
        let data = await lastValueFrom(this.roleService.getAllRoles())
            .catch((err) => {
                const errData = err.error?.responsive?.message;
                this.emitOnError.emit([errData]);
            });
        if (data) { data = data.data
            if (this.rolesList.length > 0) this.rolesList = [];
            for(let item of data) {
                if (item.peso == 9) continue;
                if (this.userInfo && item.idrole == this.userInfo.role.idrole) continue;
                this.rolesList.push({
                    id: item.idrole,
                    tag: item.etiqueta
                });
            }
        }
    }

    async validateUsername() {
        this.userIsValid = false;
        if (this.form.valid) {
            const input = this.form.controls['nickname'].value;
            if (input && this.usersList.includes(input)) {
                Promise.resolve().then(() => { this.emitOnLoading.emit(true); });
                let data = await lastValueFrom(this.userService.getUserByNick(input))
                    .catch((err) => {this.userInfo = undefined});
                if (data) {
                    this.userIsValid = true;
                    data = data.data;
                    this.userInfo = {
                        iduser: data.idusuario,
                        document: data.documento,
                        nick: data.alias,
                        fullname: data.nombre,
                        active: data.activo,
                        role: {
                            idrole: data.idrole,
                            tag: data.etiqueta,
                            weight: data.peso,
                            asignedBy: data.asigned_by
                        }
                    }
                    this.formUpdateUser.controls['isUserActive'].setValue(this.userInfo.active?true:false);
                    await this.loadRolesList();
                }
                Promise.resolve().then(() => { this.emitOnLoading.emit(false); });
            }
        }
    }

    userDataUpdate() {
        this.formUpdateValid = false;
        if (!this.userInfo) return;
        if (this.formUpdateUser.controls['isUserActive'].value != this.userInfo.active ||
            (this.formUpdateUser.controls['selectedRole'].value != 0 &&
            this.formUpdateUser.controls['selectedRole'].value != this.userInfo.role.idrole)
        ) {
            this.formUpdateValid = true;
        }
    }

    async sendformUser() {
        if (!this.formUpdateValid) return;
        Promise.resolve().then(() => { this.emitOnLoading.emit(true); });
        let fromWasUpdate:boolean = false;
        let errUserActive:boolean = false;
        let messageUserActive:string = '[User active]: No changue';
        let errRole:boolean = false;
        let messageRole:string = '[User role]: No changue';
        if (this.userInfo &&
            this.formUpdateUser.controls['isUserActive'].value != this.userInfo.active
        ) {
            const newStatus:boolean =
                this.formUpdateUser.controls['isUserActive'].value != null ?
                this.formUpdateUser.controls['isUserActive'].value:this.userInfo.active;
            let data = await lastValueFrom(this.userService.changeStatus(this.userInfo.iduser, newStatus))
                .catch ((err) => {
                    const errData = err.error?.responsive?.message;
                    messageUserActive = '[User active]: ' + errData;
                    errUserActive = true;
                });
            if (data) messageUserActive = '[User active]: Update success';
            fromWasUpdate = true;
        }
        if (this.formUpdateUser.controls['selectedRole'].value &&
            this.formUpdateUser.controls['selectedRole'].value > 0
        ) {
            const newRole:number =
                this.formUpdateUser.controls['selectedRole'].value != null ?
                this.formUpdateUser.controls['selectedRole'].value:this.userInfo!.role.idrole;
            let data = await lastValueFrom(this.roleService.changeRole(this.userInfo!.iduser, newRole))
                .catch ((err) => {
                    const errData = err.error?.responsive?.message;
                    messageRole = '[User role]: ' + errData;
                    errRole = true;
                });
            if (data) messageRole = '[User role]: Update success';
            fromWasUpdate = true;
        }
        // finally
        if (fromWasUpdate) {
            let messageForError:string[] = [];
            let messageForSuccess:string[] = [];
            if (errUserActive) { messageForError.push(messageUserActive); } else { messageForSuccess.push(messageUserActive); }
            if (errRole) { messageForError.push(messageRole); } else { messageForSuccess.push(messageRole); }
            if (messageForError.length > 0) Promise.resolve().then(() => { this.emitOnError.emit(messageForError); });
            if (messageForSuccess.length > 0) Promise.resolve().then(() => { this.emitOnSuccess.emit(messageForSuccess); });
            await this.validateUsername();
        }
        this.formUpdateValid = false;
        Promise.resolve().then(() => { this.emitOnLoading.emit(false); });
    }
}

interface RoleItemInterface {
    id:number,
    tag:string
}