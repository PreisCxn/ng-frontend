import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {ModeModule} from "../mode.module";
import {ModeService} from "./mode.service";
import {Modes} from "./modes";
import {RedirectService} from "../../shared/redirect.service";

@Injectable({
  providedIn: ModeModule
})
export class ItemGuard implements CanActivate {

  constructor(private modeService: ModeService, private redirect: RedirectService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const itemId = route.params['itemId'];
    const mode = route.params['mode'];

    console.log(itemId);

    const item = await this.modeService.getExtendedItem(itemId, mode as Modes).catch(error => {
      return null;
    });

    if(!item) {
      this.redirect.redirectTo404();
      return false;
    }

    console.log(item);

    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

}
