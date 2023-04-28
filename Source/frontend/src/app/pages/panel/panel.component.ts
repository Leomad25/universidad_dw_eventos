import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

import { TokenService } from '../../services/api/auth/token.service';
import { UserService } from '../../services/api/panel/user.service';

import { UserInterface } from '../../models/user.model';
import { PanelMessageInterface } from '../../models/panelMessage.model'

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
  userData: UserInterface|undefined;
  profilePanelStatus:boolean = false;
  menuPanelStatus:boolean = false;
  errMessage:PanelMessageInterface = {
    isVisible: false,
    message: []
  }
  loadingScreenActive:boolean = false;

  constructor(
    private tokenService: TokenService,
    private userService:UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingScreenActive = true;
    if (this.tokenService.get() != null) {
      this.tokenService.isValid(this.tokenService.get()).subscribe(
        (data) => {
          console.log('[panel] Login Successful: ' + data.data?.isValid);
          this.loadUserData();
          this.loadingScreenActive = false;
        },
        (err) => {
          console.log('[panel] Login Error');
          this.clickOnLogOut();
        }
      );
    } else {
      console.log('[panel] TokenNotFound');
      this.router.navigate(['']);
    }
  }

  loadUserData() {
    this.loadingScreenActive = true;
    this.userService.getUserData(this.tokenService.get()).subscribe(
      (data) => { data = data.data;
        this.userData = {
          iduser: data.idusuario,
          nick: data.alias,
          fullname: data.nombre,
          document: data.documento,
          role: {
            idrole: data.idrole,
            tag: data.etiqueta,
            weight: data.peso,
            asignedBy: data.asigned_by
          },
          active: data.activo
        }
        this.loadingScreenActive = false;
      },
      (err) => {
        console.log('[panel] User load error');
        this.errMessage.isVisible = true;
        this.errMessage.message = ['The token insert is invalid'];
        this.loadingScreenActive = false;
      }
    )
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

  onCloseErrScreen() {
    if (this.errMessage.message[0] == 'The token insert is invalid') this.clickOnLogOut();
    this.errMessage.isVisible = false;
    this.errMessage.message = [];
  }
}
