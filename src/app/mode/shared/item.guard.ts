import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {ModeModule} from "../mode.module";

@Injectable({
  providedIn: ModeModule
})
export class ItemGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const itemId = route.params['itemId'];

    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

}
