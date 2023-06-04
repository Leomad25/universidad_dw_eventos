import { Component } from '@angular/core';
import { EventInterface } from 'src/app/models/event.model';

@Component({
    selector: 'app-my-interested',
    templateUrl: './my-interested.component.html',
    styleUrls: ['./my-interested.component.scss']
})
export class MyInterestedComponent {
    listMyEvents:EventInterface[] = [];
}
