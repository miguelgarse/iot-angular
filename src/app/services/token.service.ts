import { Injectable } from "@angular/core";

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORTIES_KEY = 'AuthAuthorities';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    roles: Array<string> = [];

    constructor() { }

    public setToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): any {
        return window.sessionStorage.getItem(TOKEN_KEY);
    }

    public setUserName(userName: string): void {
        window.sessionStorage.removeItem(USERNAME_KEY);
        window.sessionStorage.setItem(USERNAME_KEY, userName);
    }

    public getUserName(): any {
        return window.sessionStorage.getItem(USERNAME_KEY);
    }

    public setAuthorities(authorities: string[]): void {
        window.sessionStorage.removeItem(AUTHORTIES_KEY);
        window.sessionStorage.setItem(AUTHORTIES_KEY, JSON.stringify(authorities));
    }

    public getAuthorities(): string[] {
        this.roles = [];
        if (sessionStorage.getItem(AUTHORTIES_KEY)) {
            let authoritiesKey: string = new String(sessionStorage.getItem(AUTHORTIES_KEY)).toString();
           
            JSON.parse(authoritiesKey).forEach((authority: { authority: string; }) => {
                this.roles.push(authority.authority);
            });
        }
        
        return this.roles;
    }

    public logOut(): void {
        window.sessionStorage.clear();
    }

    public isAdmin(): boolean {
        let isAdmin: boolean = false;

        this.getAuthorities().forEach(role => {
            if (role == 'ROLE_ADMIN') {
                isAdmin = true;
            }
        });

        return isAdmin;
    }
}