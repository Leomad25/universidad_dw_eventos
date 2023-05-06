import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { Router } from '@angular/router';
import { lastValueFrom, catchError } from 'rxjs';

import { TokenService } from '../../services/api/auth/token.service';

import { UserInterface } from '../../models/user.model';
import { PanelMessageInterface, PanelNavInterface, PanelsInterface } from '../../models/panelMessage.model'

import { UserMethodsAux } from '../../auxiliary/userMethods.aux';

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
    successMessage:PanelMessageInterface = {
        isVisible: false,
        message: []
    }
    loadingScreenActive:boolean = false;
    panelNavControl:PanelNavInterface = {
        administration: {isEnable: false, isOpen: false},
        eventManagement: {isEnable: false, isOpen: false},
        personalEvents: {isEnable: true, isOpen: false},
        diary: {isEnable: true, isOpen: false}
    };
    panelsMainControl: PanelsInterface = {
        home: true,
        admin: { userManager: false },
        eventManager: { createByMe: false, create: false },
        personal: { myInterested: false },
        diary: { explore: false }
    }
    idEventCreatedSelected?:number;
    errorMessageText = {
        youDontAccessToThisScreen: 'You don\'t access to this page'
    }

    constructor(
        private tokenService: TokenService,
        private router: Router,
        private userMethodsAux: UserMethodsAux
    ) {}

    async ngOnInit(): Promise<void> {
        this.loadingScreenActive = true;
        if (this.tokenService.get() != null) {
            try {
                await lastValueFrom(this.tokenService.isValid(this.tokenService.get()));
                console.log('[panel] Login success');
                this.loadUserDataAsync();
            } catch (err: any) {
                console.log('[panel] Login Error');
                let errData = err.error;
                this.errMessage.isVisible = true;
                this.errMessage.message = ['The token insert is invalid', errData.responsive?.message];
                this.loadingScreenActive = false;
            }
        } else {
            this.clickOnLogOut();
        }
    }

    async loadUserDataAsync() {
        this.loadingScreenActive = true;
        let userDataTemp = await this.userMethodsAux.loadDataInfoAsync(this.tokenService.get());
        if (userDataTemp instanceof String) {
            console.log('[panel] User load error');
            this.errMessage.isVisible = true;
            this.errMessage.message = ['The token insert is invalid'];
            this.loadingScreenActive = false;
        } else {
            this.userData = userDataTemp as UserInterface;
            if (this.userData.role.weight == 9) {
                console.log('[panel] Admin options enable');
                this.panelNavControl.administration.isEnable = true;
                this.panelNavControl.eventManagement.isEnable = true;
            } else if (this.userData.role.weight >= 5) {
                console.log('[panel] Management options enable');
                this.panelNavControl.eventManagement.isEnable = true;
            }
        }
        this.loadingScreenActive = false;
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

    closeAllPanelMenuItems(exception:string) {
        if (exception != 'administration') this.panelNavControl.administration.isOpen = false;
        if (exception != 'eventManagement') this.panelNavControl.eventManagement.isOpen = false;
        if (exception != 'personalEvents') this.panelNavControl.personalEvents.isOpen = false;
        if (exception != 'diary') this.panelNavControl.diary.isOpen = false;
    }

    onCloseErrScreen() {
        if (this.errMessage.message[0] == 'The token insert is invalid') this.clickOnLogOut();
        this.errMessage.isVisible = false;
        this.errMessage.message = [];
    }

    onCloseSuccessScreen() {
        this.successMessage.isVisible = false;
        this.successMessage.message = [];
    }

    private closeAllPanels() {
        this.panelsMainControl = {
            home: false,
            admin: { userManager: false },
            eventManager: { createByMe: false, create: false },
            personal: { myInterested: false },
            diary: { explore: false }
        }
    }

    clickOnHome() {
        this.loadingScreenActive = true;
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        this.panelsMainControl.home = true;
        this.loadingScreenActive = false
    }

    clickOnAdministrationUserManager() {
        this.loadingScreenActive = true;
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        if (this.userData && this.userData.role.weight == 9) {
            this.panelsMainControl.admin.userManager = true;
        } else {
            this.panelsMainControl.home = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = [
                this.errorMessageText.youDontAccessToThisScreen,
                'Need admin role'
            ];
        }
        this.loadingScreenActive = false
    }

    clickOnEventManagerCreateByMe(idEvent?: number) {
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        if (this.userData && this.userData.role.weight >= 5) {
            if (idEvent) this.idEventCreatedSelected = idEvent;
            this.panelsMainControl.eventManager.createByMe = true;
        } else {
            this.panelsMainControl.home = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = [
                this.errorMessageText.youDontAccessToThisScreen,
                'Need creator or admin role'
            ];
        }
    }

    clickOnEventManagerCreate() {
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        if (this.userData && this.userData.role.weight >= 5) {
            this.panelsMainControl.eventManager.create = true;
        } else {
            this.panelsMainControl.home = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = [
                this.errorMessageText.youDontAccessToThisScreen,
                'Need creator or admin role'
            ];
        }
    }

    clickOnPersonalMyInterested() {
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        if (this.userData && this.userData.role.weight >= 1) {
            this.panelsMainControl.personal.myInterested = true;
        } else {
            this.panelsMainControl.home = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = [
                this.errorMessageText.youDontAccessToThisScreen,
                'Need assistent role'
            ];
        }
    }

    clickOnDialyExplore() {
        if (this.menuPanelStatus) this.menuPanelStatus = false;
        this.closeAllPanels();
        if (this.userData && this.userData.role.weight >= 1) {
            this.panelsMainControl.diary.explore = true;
        } else {
            this.panelsMainControl.home = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = [
                this.errorMessageText.youDontAccessToThisScreen,
                'Need assistent role'
            ];
        }
    }

    showError(message:string[]) {
        this.errMessage.isVisible = true;
        this.errMessage.message = message;
    }

    showSuccess(message:string[]) {
        this.successMessage.isVisible = true;
        this.successMessage.message = message;
    }

    showLoadingScreen(status:boolean) {
        this.loadingScreenActive = status;
    }
}
