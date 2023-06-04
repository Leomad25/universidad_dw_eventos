import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { count, lastValueFrom } from 'rxjs';

import { TokenService } from '../../../../services/api/auth/token.service';
import { EventService } from '../../../../services/api/panel/event.service';
import { EventInterface } from '../../../../models/event.model'
import { ValidateRoleService } from 'src/app/services/api/panel/_validateRole.service';

@Component({
    selector: 'app-create-by-me',
    templateUrl: './create-by-me.component.html',
    styleUrls: ['./create-by-me.component.scss']
})
export class CreateByMeComponent implements OnInit {
    @Input() idEventSelected?:number;
    @Output('onError') emitOnError:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onSuccess') emitOnSuccess:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onLoading') emitOnLoading:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onRedirectHome') emitOnRedirectHome:EventEmitter<void> = new EventEmitter<void>();

    listSlope:EventInterface[] = [];
    listIncomplete:EventInterface[] = [];
    listDone:EventInterface[] = [];
    listInprogress:EventInterface[] = [];
    listCancel:EventInterface[] = [];

    posSlope:number = 0;
    pos:number = 0;
    posDone:number = 0;

    eventEditScreen = false;
    eventSelected: EventInterface = {
        idevent: 0,
        name: 'Explaple event',
        description: 'Example description',
        status: 0,
        manager: 0,
        dateInit: '0000-00-00', timeInit: '00:00:00',
        dateEnd: '9999-99-99', timeEnd: '99:99:99',
        isUrl: false,
        direction: 'Example direction'
    };

    // DOM Elements
    @ViewChild('asListSlope') elementListSlope: ElementRef | undefined;
    @ViewChild('asList') elementList: ElementRef | undefined;
    @ViewChild('asListDone') elementListDone: ElementRef | undefined;

    constructor(
        private eventService: EventService,
        private validateRoleService: ValidateRoleService,
        private renderer2: Renderer2
    ) {}

    async ngOnInit(): Promise<void> {
        Promise.resolve().then(() => {this.emitOnLoading.emit(true);});
        await this.validateRoleRequired();
        await this.listedEvent();
        if (this.idEventSelected) this.openEventEdit(this.idEventSelected);
        Promise.resolve().then(() => {this.emitOnLoading.emit(false);});
    }

    onEmitOnError(message: string[]) {
        this.emitOnError.emit(message);
    }

    onEmitOnSuccess(message: string[]) {
        this.emitOnSuccess.emit(message);
    }

    async onReloadList() {
        Promise.resolve().then(() => {this.emitOnLoading.emit(true);});
        await this.listedEvent();
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

    async listedEvent() {
        let data = await lastValueFrom(this.eventService.getEventByManager())
            .catch((err) => {
                const message = err.error?.responsive?.message;
                this.emitOnError.emit([message]);
            })
        if (data) {data = data.data;
            if (!data) return;
            this.listSlope = [];
            this.listIncomplete = [];
            this.listDone = [];
            this.listInprogress = [];
            this.listCancel = [];
            for(let subData of data) {
                const item:EventInterface = {
                    idevent: subData.idevento,
                    name: subData.nombre,
                    description: subData.descripcion,
                    manager: subData.encargado,
                    dateInit: subData.fecha_inicio,
                    dateEnd: subData.fecha_fin,
                    timeInit: subData.tiempo_inicio,
                    timeEnd: subData.tiempo_fin,
                    status: subData.estado,
                    isUrl: subData.es_url,
                    direction: subData.lugar ? subData.lugar : ""
                }
                switch (item.status) {
                    case 1: this.listIncomplete.push(item); break;
                    case 2: this.listSlope.push(item); break;
                    case 3: this.listInprogress.push(item); break;
                    case 4: this.listDone.push(item); break;
                    default: this.listCancel.push(item);
                }
            }
        }
    }

    async openEventEdit(idEvent:number) {
        let data:any = await lastValueFrom(this.eventService.getEventById(idEvent))
            .catch((err) => {
                const message = err.error?.responsive?.message;
                this.emitOnError.emit([message]);
            });
        if (data) { data = data.data[0];
            this.eventSelected = {
                idevent: data.idevento,
                name: data.nombre,
                description: data.descripcion,
                dateInit: data.fecha_inicio,
                timeInit: data.tiempo_inicio,
                dateEnd: data.fecha_fin,
                timeEnd: data.tiempo_fin,
                manager: data.encargado,
                status: data.estado,
                isUrl: data.es_url,
                direction: data.lugar
            }
            this.eventEditScreen = true;
        }
    }

    closeEventEdit() {
        this.eventEditScreen = false;
    }
}
