// mode.guard.ts
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import { Injectable } from '@angular/core';
import { RedirectService } from '../../shared/redirect.service';
import {ModeModule} from "../mode.module";

const allowedModes = ['skyblock', 'citybuild'];

@Injectable({
  providedIn: ModeModule
})
export class ModeGuard{
  constructor(private redirectService: RedirectService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const mode = route.params['mode'];
    console.log(mode);
    if (allowedModes.includes(mode)) {
      return true;
    } else {
      this.redirectService.redirectTo404();
      return false;
    }
  }
}
