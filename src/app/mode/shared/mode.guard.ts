// mode.guard.ts
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {RedirectService} from '../../shared/redirect.service';
import {ModeModule} from "../mode.module";
import {Modes} from "./modes";
import {ModeService} from "./mode.service";
import {DataService} from "../../shared/data.service";

const allowedModes = [
  Modes.SKYBLOCK,
  Modes.CITYBUILD
];

@Injectable({
  providedIn: ModeModule
})
export class ModeGuard {
  constructor(private redirectService: RedirectService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const mode = route.params['mode'];
    if (allowedModes.includes(mode)) {
      return true;
    } else {
      this.redirectService.redirectTo404();
      return false;
    }
  }
}
