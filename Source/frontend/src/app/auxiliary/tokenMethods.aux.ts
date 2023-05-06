import { TokenService } from "../services/api/auth/token.service";
import { lastValueFrom } from "rxjs"

export class TokenMethodsAux {
    constructor(
        private tokenService: TokenService
    ) {}

    async tokenIsValid(jwt: string | null): Promise<true | string> {
        if (jwt != null) {
            let data =  lastValueFrom(this.tokenService.isValid(this.tokenService.get()))
                .catch((err) => {
                    console.log('error:')
                    console.log(err);
                });
            if (data) { 
                console.log(data);
            }
        }
        return "Err: Token Not Found";
    }

    async tokenUserInfo(jwt: string | null): Promise<TokenUserInfoInterface | string> {
        const isValid = await this.tokenIsValid(jwt);
        if (isValid != true) return isValid;
        let userData:TokenUserInfoInterface;
        userData = {
            idUser: -1,
            roleWeight: -1
        }
        return userData;
    }
}

export interface TokenUserInfoInterface {
    idUser:number
    roleWeight: number
}