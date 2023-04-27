import { Component, Input } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('rotateAnimation', [
      state('init', style({
        rotate: '0deg'
      })),
      state('done', style({
        rotate: '179deg'
      })),
      transition('init => done', [animate(1000)])
    ])
  ]
})
export class LoadingComponent {
  @Input() isVisible:boolean = false;

  state:string = 'init';

  resetAnimation($event: any) {
    this.state = this.state === 'init' ? 'done' : 'init';
  }
}
