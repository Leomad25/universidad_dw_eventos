import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { EventService } from 'src/app/services/api/panel/event.service';
import { EventInterface } from 'src/app/models/event.model';

@Component({
    selector: 'app-event-card-edit',
    templateUrl: './event-card-edit.component.html',
    styleUrls: ['./event-card-edit.component.scss']
})
export class EventCardEditComponent implements OnInit {
    @Output('onError') emitOnError:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onSuccess') emitOnSuccess:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onUpdated') emitOnUpdate: EventEmitter<void> = new EventEmitter<void>();
    @Output('onClose') emitOnClose: EventEmitter<void> = new EventEmitter<void>();
    @Input('eventEdit') eventEdit: EventInterface = {
        idevent: 0,
        name: 'Explaple event',
        description: 'Example description',
        status: 0,
        manager: 0,
        dateInit: '0000-00-00',
        timeInit: '00:00:00',
        dateEnd: '9999-99-99',
        timeEnd: '99:99:99',
        isUrl: false,
        direction: 'Example direction'
    }

    loadingScreen:boolean = false;

    form:FormGroup = new FormGroup({});

    btnLoadEnable:boolean = true;

    constructor(
        private eventService: EventService,
        private formBulder: FormBuilder
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.formBulder.group({
            isUrl: [this.eventEdit.isUrl],
            direction: [this.eventEdit.direction, [Validators.required]],
            description: [this.eventEdit.description]
        });
    }

    onClose() {
        this.emitOnClose.emit()
    }

    onClickLoadVisualizer() {
        this.form.controls['isUrl'].setValue(true);
        this.form.controls['direction'].setValue('visualizer?idevent=' + this.eventEdit.idevent);
        this.form.controls['isUrl'].disable();
        this.form.controls['direction'].disable();
        this.btnLoadEnable = false;
    }

    onClickUnloadVisualizer() {
        this.form.controls['isUrl'].setValue(false);
        this.form.controls['direction'].setValue('');
        this.form.controls['isUrl'].enable();
        this.form.controls['direction'].enable();
        this.btnLoadEnable = true;
    }

    async onSubmit() {
        if (this.form.valid) {
            this.form.controls['isUrl'].value == true ? this.eventEdit.isUrl = true : this.eventEdit.isUrl = false;
            this.eventEdit.direction = this.form.controls['direction'].value;
            this.eventEdit.description = this.form.controls['description'].value;
            // send form
            let data = await lastValueFrom(this.eventService.updateEventById(this.eventEdit))
                .catch((err) => {
                    const message = err.error?.responsive?.message;
                    this.emitOnError.emit([message]);
                })
            if (data) {
                this.eventEdit.status = 2;
                data = await lastValueFrom(this.eventService.updateStatusEventById(this.eventEdit))
                    .catch((err) => {
                        const message = err.error?.responsive?.message;
                        this.emitOnError.emit([message]);
                    })
                if (data) {
                    this.emitOnSuccess.emit([this.eventEdit.name, "Was update successfuly"]);
                    this.emitOnUpdate.emit();
                    this.onClose();
                }
            }
        }
    }
}
