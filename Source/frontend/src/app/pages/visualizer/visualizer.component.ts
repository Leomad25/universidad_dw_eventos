import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserMethodsAux } from 'src/app/auxiliary/userMethods.aux';
import { EventInterface } from 'src/app/models/event.model';
import { PanelMessageInterface } from 'src/app/models/panelMessage.model';
import { UserInterface } from 'src/app/models/user.model';
import { TokenService } from 'src/app/services/api/auth/token.service';
import { EventService } from 'src/app/services/api/panel/event.service';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss'],
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
        trigger('chatPanelAnimation', [
            state('open', style({
                transform: 'translateX(0%)'
            })),
            state('close', style({
                transform: 'translateX(100%)'
            })),
            transition('* => *', [animate(400)])
        ]),
        trigger('screeControlPanelAnimation', [
            state('open', style({
                transform: 'translateX(0%)'
            })),
            state('close', style({
                transform: 'translateX(-100%)'
            })),
            transition('* => *', [animate(400)])
        ])
    ]
})
export class VisualizerComponent {
    userData: UserInterface|undefined;
    eventData: EventInterface|undefined;
    profilePanelStatus:boolean = false;
    errMessage:PanelMessageInterface = {
        isVisible: false,
        message: []
    }
    successMessage:PanelMessageInterface = {
        isVisible: false,
        message: []
    }
    optionsOnError:MessageErrorOptions = {
        backToPanel: false,
        logout: false
    }
    loadingScreenActive:boolean = false;

    //panelVar
    chatPanel:ChatPanelInterface = {
        isOpen: false
    }
    screeControlPanel:ScreeControlPanelInterface = {
        isVisible: true,
        isOpen: false
    }

    constructor (
        private tokenService: TokenService,
        private eventService: EventService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userMethodsAux: UserMethodsAux
    ) {}

    async ngOnInit(): Promise<void> {
        this.loadingScreenActive = true;
        if (this.tokenService.get() != null) {
            let data = await lastValueFrom(this.tokenService.isValid())
                .catch ((err) => {
                    console.log('[visualizer] Login Error');
                    let errData = err.error;
                    this.optionsOnError.logout = true;
                    this.errMessage.isVisible = true;
                    this.errMessage.message = ['The token insert is invalid', errData.responsive?.message];
                    this.loadingScreenActive = false;
                });
            if (data) {
                console.log('[visualizer] Login success');
                await this.loadUserDataAsync();
                await this.loadEventDataAsync();
            }
        } else {
            this.clickOnLogOut();
        }
    }

    private async loadUserDataAsync() {
        this.loadingScreenActive = true;
        let userDataTemp = await this.userMethodsAux.loadDataInfoAsync();
        if (userDataTemp instanceof String) {
            console.log('[visualizer] User load error');
            this.errMessage.isVisible = true;
            this.errMessage.message = ['The token insert is invalid'];
            this.loadingScreenActive = false;
        } else {
            this.userData = userDataTemp as UserInterface;
        }
        this.loadingScreenActive = false;
    }

    private async loadEventDataAsync() {
        let idevent: number | undefined;
        this.activatedRoute.queryParams
            .subscribe((params:any) => {
                idevent = params.idevent ? params.idevent : undefined;
            });
        if (!idevent) {
            this.optionsOnError.backToPanel = true;
            this.errMessage.isVisible = true;
            this.errMessage.message = ['Id event is invalid'];
        } else {
            //await lastValueFrom(this.eventService.getEventById(idevent))
        }
    }

    onClickBackToHome() {
        this.router.navigate(['']);
    }

    clickOnLogOut() {
        this.tokenService.remove();
        this.router.navigate(['']);
    }

    alterPanelProfile() {
        this.profilePanelStatus = !this.profilePanelStatus;
    }

    onCloseErrScreen() {
        this.errMessage.isVisible = false;
        this.errMessage.message = [];
        if (this.optionsOnError.logout) this.clickOnLogOut();
        if (this.optionsOnError.backToPanel) this.onClickBackToHome();
    }

    onCloseSuccessScreen() {
        this.successMessage.isVisible = false;
        this.successMessage.message = [];
    }

    deployChatScreen() {
        this.chatPanel.isOpen = !this.chatPanel.isOpen;
    }

    sendFormChat() {

    }

    deployScreenControl() {
        this.screeControlPanel.isOpen = !this.screeControlPanel.isOpen;
    }
}

interface MessageErrorOptions {
    backToPanel: boolean;
    logout: boolean;
}

interface ChatPanelInterface {
    isOpen: boolean;
}

interface ScreeControlPanelInterface {
    isVisible: boolean;
    isOpen: boolean
}