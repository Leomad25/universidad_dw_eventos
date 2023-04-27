import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

import { TokenService } from '../../services/api/auth/token.service';

import { UserInterface } from '../../models/user.model'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  animations: [
    trigger('profilePanelAnimation', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('close', style({
        transform: 'translateX(100%)'
      })),
      transition('* => *', [animate(400)])
    ]),
    trigger('menuPanelAnimation', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('close', style({
        transform: 'translateX(calc(-100% - 8px))'
      })),
      transition('* => *', [animate(400)])
    ])
  ]
})
export class PanelComponent implements OnInit {
  userData: UserInterface = {
    nick: 'Nombre test'
  }
  profilePanelStatus:boolean = false;
  menuPanelStatus:boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenService.get() != null) {
      this.tokenService.isValid(this.tokenService.get()).subscribe(
        (data) => {
          console.log('[panel] Login Successful: ' + data.data?.isValid);
        },
        (err) => {
          console.log('[panel] Login Error');
          this.tokenService.remove();
          this.router.navigate(['']);
        }
      )
    } else {
      console.log('[panel] TokenNotFound');
      this.router.navigate(['']);
    }
  }

  clickOnLogOut() {
    this.tokenService.remove();
    this.router.navigate(['']);
  }

  alterPanelProfile() {
    this.profilePanelStatus = !this.profilePanelStatus;
    if (this.profilePanelStatus) this.menuPanelStatus = false;
  }

  alterPanelMenu() {
    this.menuPanelStatus = !this.menuPanelStatus;
    if (this.menuPanelStatus) this.profilePanelStatus = false;
  }
}
