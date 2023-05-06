import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title:string = 'Home Page';
  description:string[] = [
    'This is a work for a university activity, with no commercial purpose, it is licensed under the GPL-3 license.',
    'It consists of the development of a web page, with management functions for events created by users of the creator or administrator type.',
    'Assistant type users can attend these events and at the end of an event a certificate can be generated to validate their attendance, and they can also navigate between the events to sign up for them.',
    'Creator type users have the ability to create new events for users, they inherit assistant role capabilities.',
    'Finally, administrator type users have the ability to manage the permissions of other users and inherit the capabilities of creator and assistant type users.'
  ]
}
