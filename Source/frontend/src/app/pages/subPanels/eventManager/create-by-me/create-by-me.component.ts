import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-create-by-me',
    templateUrl: './create-by-me.component.html',
    styleUrls: ['./create-by-me.component.scss']
})
export class CreateByMeComponent {
    @Input() idEventSelected?:number;
    @Output('onError') emitOnError:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onSuccess') emitOnSuccess:EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output('onLoading') emitOnLoading:EventEmitter<boolean> = new EventEmitter<boolean>();
}
