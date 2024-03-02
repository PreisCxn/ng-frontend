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
import {DataService} from "../../shared/data.service";

@Injectable({
  providedIn: AdminModule
})
export class AdminGuard implements CanActivate {

  constructor(private data: DataService, private redirect: RedirectService) {

  }

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.data.isAdmin().then(isAdmin => {
      console.log(isAdmin);
      return isAdmin;
    }).catch(() => {
      this.redirect.redirectTo404();
      return false;
    });
  }


}
