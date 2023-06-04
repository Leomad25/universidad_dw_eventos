export interface EventInterface {
    idevent:number;
    name:string;
    description:string;
    manager:number;
    dateInit:string;
    dateEnd:string;
    timeInit:string;
    timeEnd:string;
    status:number;
    isUrl?:boolean;
    direction?:string;
}