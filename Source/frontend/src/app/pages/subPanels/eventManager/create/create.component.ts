import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { RoleService } from '../../../../services/api/panel/event.service';
import { TokenService } from '../../../../services/api/auth/token.service'

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
    @Input() iduser:number|undefined;
    @Output('onError') emitOnError:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onSuccess') emitOnSuccess:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onLoading') emitOnLoading:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onRedirect') emitOnRedirect:EventEmitter<number> = new EventEmitter<number>();
    form:FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        initDate: new FormControl(new Date(), [Validators.required]),
        initHours: new FormControl('0', [Validators.required]),
        initMinutes: new FormControl('0', [Validators.required]),
        initCycle: new FormControl('AM', [Validators.required]),
        endDate: new FormControl(new Date(), [Validators.required]),
        endHours: new FormControl('0', [Validators.required]),
        endMinutes: new FormControl('0', [Validators.required]),
        endCycle: new FormControl('AM', [Validators.required])
    });

    constructor(
        private roleService: RoleService,
        private tokenService: TokenService
    ) {}

    ngOnInit(): void {
        
    }

    async onSubmit() {
        if (this.form.valid && this.iduser) {
            Promise.resolve().then(() => {this.emitOnLoading.emit(true);});
            const dateInit:string =
                formatDate(this.form.controls['initDate'].value, 'yyyy/MM/dd', 'en') + ' ' +
                (this.form.controls['initCycle'].value == 'AM' ?
                    (this.form.controls['initHours'].value >= 10 ?
                        this.form.controls['initHours'].value :
                        '0' + this.form.controls['initHours'].value) :
                    parseInt(this.form.controls['initHours'].value, 10) + 12) + ':' +
                (this.form.controls['initMinutes'].value >= 10 ?
                    this.form.controls['initMinutes'].value :
                    '0' + this.form.controls['initMinutes'].value) + ':00';

            const dateEnd:string =
                formatDate(this.form.controls['endDate'].value, 'yyyy/MM/dd', 'en') + ' ' +
                (this.form.controls['endCycle'].value == 'AM' ?
                    (this.form.controls['endHours'].value >= 10 ?
                        this.form.controls['endHours'].value :
                        '0' + this.form.controls['endHours'].value) :
                        parseInt(this.form.controls['endHours'].value, 10) + 12) + ':' +
                (this.form.controls['endMinutes'].value >= 10 ?
                    this.form.controls['endMinutes'].value :
                    '0' + this.form.controls['endMinutes'].value) + ':00';

            const data = await lastValueFrom(this.roleService.createEvent(
                this.tokenService.get(),
                this.form.controls['name'].value,
                this.form.controls['description'].value,
                this.iduser,
                dateInit,
                dateEnd))
                .catch((err) => {
                    let errorMessage = undefined
                    if (err.error.responsive.message)
                        errorMessage = err.error.responsive.message;
                    if (errorMessage) this.emitOnError.emit([errorMessage]);
                });
            if (data) {
                this.emitOnSuccess.emit(['Event create succressfull', 'Event id: ' + data.data[0]?.idevento]);
                this.emitOnRedirect.emit(data.data[0]?.idevento);
            }
            Promise.resolve().then(() => {this.emitOnLoading.emit(false);});
        }
    }
}