export interface PanelMessageInterface {
    isVisible:boolean;
    message:string[];
}

export interface PanelNavInterface {
    administration: PanelControlInterface;
    eventManagement: PanelControlInterface;
    personalEvents: PanelControlInterface;
    diary: PanelControlInterface;
}

interface PanelControlInterface {
    isEnable: boolean;
    isOpen: boolean;
}

export interface PanelsInterface {
    home:boolean;
    admin:PanelAdminInterface;
    eventManager: PanelEventManagerInterface;
    personal: PanelPersonalInterface;
    diary: PanelDairyInterface;
}

interface PanelAdminInterface {
    userManager: boolean;
}

interface PanelEventManagerInterface {
    createByMe: boolean;
    create: boolean;
}

interface PanelPersonalInterface {
    myInterested:boolean;
}

interface PanelDairyInterface {
    explore:boolean;
}