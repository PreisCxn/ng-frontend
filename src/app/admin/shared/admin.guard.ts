import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanActivateFn,
  RouterStateSnapshot, UrlTree
} from '@angular/router';
import {Injectable} from "@angular/core";
import {RedirectService} from "../../shared/redirect.service";
import {AdminModule} from "../admin.module";
import {Observable} from "rxjs";

@Injectable({
  providedIn: AdminModule
})
export class AdminGuard implements CanActivateChild {

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }


}
