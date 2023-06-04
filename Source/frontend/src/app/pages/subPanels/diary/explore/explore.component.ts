import { Component } from '@angular/core';
import { EventInterface } from 'src/app/models/event.model';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {
    list:EventInterface[] = [];
}
