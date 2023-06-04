import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    QueryList,
    Renderer2,
    ViewChild
} from '@angular/core';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements AfterViewInit {
    @Input('title') title: string = 'No Title';

    @ViewChild('asList') elementList: ElementRef | undefined;
    @ContentChildren('listItems') listItems?: QueryList<any>;

    isListEmpty: boolean = true;
    listCount: number = 0;
    pos: number = 0;

    constructor(
        private renderer2: Renderer2,
    ) {}

    ngAfterViewInit(): void {
        this.listItems?.changes.subscribe(() => {
            this.isListEmpty = this.listItems?.length === 0;
            this.listCount = this.listItems ? this.listItems.length : 0;
        });
    }

    swapperPanel(posToNavegate:number) {
        if (posToNavegate < 0) return;
        if (posToNavegate > (this.listCount - 1)) return;
        this.pos = posToNavegate;
        const aslist = this.elementList?.nativeElement;
        this.renderer2.setStyle(aslist, 'transform', 'translateX(calc(-440px * ' + this.pos + ')');
    }
}
