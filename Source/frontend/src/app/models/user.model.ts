export interface UserInterface {
    iduser:number;
    nick: string;
    fullname:string;
    document:string;
    active:boolean;
    role:RoleInterface
}

interface RoleInterface {
    idrole:number;
    tag:string;
    weight:number;
    asignedBy:number|null;
}