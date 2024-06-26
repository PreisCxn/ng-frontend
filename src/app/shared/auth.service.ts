import { Injectable } from '@angular/core';
import {IUserCommunication} from "./interfaces/user.interface";
import {DataService} from "./data.service";
import {CookieService} from "ngx-cookie-service";
import {UserAuth} from "./types/user.types";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IUserCommunication {

  static readonly AUTH_COOKIE: string = 'auth';

  constructor(private data: DataService, private cookie: CookieService) { }

  public async isAdmin(): Promise<boolean> {
    const token = this.cookie.get(AuthService.AUTH_COOKIE);

    if(token && token.length > 0)
      return this.data.isAdmin();
    else
      return Promise.resolve(false);
  }

  public async login(username: string, password: string, remember: boolean): Promise<UserAuth> {
    const auth:UserAuth = await this.data.login(username, password);
    if(auth.access) {
      if(remember) {
        this.cookie.set(AuthService.AUTH_COOKIE, auth.token, { path: '/', expires: 365 });
      } else {
        this.cookie.set(AuthService.AUTH_COOKIE, auth.token, { path: '/' });
      }
    }

    return auth;
  }

  public logout() {
    console.log('logout');
    this.cookie.set(AuthService.AUTH_COOKIE, '', { path: '/' });
  }

  public isLoggedIn(): boolean {
    return this.cookie.get('auth').length > 0;
  }

  public checkForMaintenance(): Promise<boolean> {
    return this.data.isWebMaintenance()
  }

}
