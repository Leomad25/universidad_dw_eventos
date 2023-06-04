import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { EventService } from '../../../../services/api/panel/event.service';
import { TokenService } from '../../../../services/api/auth/token.service'
import { ValidateRoleService } from 'src/app/services/api/panel/_validateRole.service';

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
    @Output('onRedirectHome') emitOnRedirectHome:EventEmitter<void> = new EventEmitter<void>();
    
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
        private eventService: EventService,
        private tokenService: TokenService,
        private validateRoleService: ValidateRoleService
    ) {}

    async ngOnInit(): Promise<void> {
        Promise.resolve().then(() => {this.emitOnLoading.emit(true);});
        await this.validateRoleRequired();
        Promise.resolve().then(() => {this.emitOnLoading.emit(false);});
    }

    private async validateRoleRequired() {
        let data = await lastValueFrom(this.validateRoleService.getRole())
            .catch((err) => {
                const message = err.error?.responsive?.message;
                this.emitOnError.emit([message]);
                this.emitOnRedirectHome.emit();
            });
        if (data)
            if (data.data.eventManager) return;
        this.emitOnError.emit(['Err: Role event manager required']);
        this.emitOnRedirectHome.emit();
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

            const data = await lastValueFrom(this.eventService.createEvent(
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