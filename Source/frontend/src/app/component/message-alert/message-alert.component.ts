import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss']
})

export class MessageAlertComponent {
  @Input('isErrorMessage') isErrorMessage:boolean = false;
  @Input('isSuccessMessage') isSuccessMessage:boolean = false;
  @Input('isVisible') isVisible:boolean = false;
  @Input('message') message:string[] = [];

  @Output('onClose') eventOnClose:EventEmitter<void> = new EventEmitter();

  onCloseClick() {
    this.eventOnClose.emit();
  }
}
