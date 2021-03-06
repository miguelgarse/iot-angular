import { Injectable } from "@angular/core";

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORTIES_KEY = 'AuthAuthorities';
const DATE_LAST_LOGIN_KEY = 'AuthDateLastLogin';

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

    public getUserName(): string {
        const userName = window.sessionStorage.getItem(USERNAME_KEY);
        return userName ? userName : "";
    }

    public setAuthorities(authorities: string[]): void {
        window.sessionStorage.removeItem(AUTHORTIES_KEY);
        window.sessionStorage.setItem(AUTHORTIES_KEY, JSON.stringify(authorities));
    }

    public setDateLastLogin(dateLastLogin: number): void {
        window.sessionStorage.removeItem(DATE_LAST_LOGIN_KEY);
        window.sessionStorage.setItem(DATE_LAST_LOGIN_KEY, dateLastLogin.toString());
    }

    public getDateLastLogin(): Date {
        const dateLastLogin = window.sessionStorage.getItem(DATE_LAST_LOGIN_KEY);
        let miliseconds: number = dateLastLogin?Number(dateLastLogin):0;
        return new Date(miliseconds);
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