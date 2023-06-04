import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
    @Input() id:number = 0;
    @Input() title:string = 'Event title';
    @Input() description:string = 'Event description';
    @Input() dateInit:string = '00/00/0000';
    @Input() timeInit:string = '00:00:00';
    @Input() dateEnd:string = '99/99/9999';
    @Input() timeEnd:string = '99:99:99';
    @Input() direction?:string = 'direcction';
    @Input() isUrl?:boolean = false;
    @Input() isClickable:boolean = false;
    @Output('onClick') emitOnClick:EventEmitter<number> = new EventEmitter<number>();

    onClick() {
        if (this.isClickable) this.emitOnClick.emit(this.id);
    }
}
