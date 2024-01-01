import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, CanActivateChild, UrlTree
} from '@angular/router';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {RedirectService} from "./redirect.service";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivateChild{
  private maintenanceMode = false;

  constructor(private router: Router, private redirectService: RedirectService) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkMaintenanceMode(route, state);
  }

  private checkMaintenanceMode(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return of(this.maintenanceMode).pipe(
      map(isMaintenanceMode => {
        if (isMaintenanceMode && state.url !== '/503') {
          this.redirectService.redirectTo503();
          return false;
        } else if (!isMaintenanceMode && state.url === '/503') {
          this.redirectService.redirectToHome();
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
