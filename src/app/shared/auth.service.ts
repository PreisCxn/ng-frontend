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

  public async login(username: string, password: string): Promise<UserAuth> {
    const auth:UserAuth = await this.data.login(username, password);
    if(auth.access)
      this.cookie.set(AuthService.AUTH_COOKIE, auth.token);

    return auth;
  }

  public logout() {
    this.cookie.delete(AuthService.AUTH_COOKIE);
  }

  public isLoggedIn(): boolean {
    return this.cookie.get('auth').length > 0;
  }

}
