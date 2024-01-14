import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, CanActivateChild, UrlTree
} from '@angular/router';
import {from, Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import {RedirectService} from "./redirect.service";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivateChild{
  private maintenanceMode = false; // mit get anfrage an api nach mode checken

  constructor(private router: Router, private redirectService: RedirectService,private  dataService: DataService) {}

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    console.log(state);

    if(state.url === '/404') {
      return true;
    }

    const result = await this.dataService.checkMaintenance();

    if (result) {
      this.redirectService.redirectTo503();
      return false;
    } else {
      return true;
    }
  }

  private checkMaintenanceMode(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return from(this.dataService.checkMaintenance()).pipe(
      switchMap(isMaintenanceMode => {
        if (isMaintenanceMode && state.url !== '/503') {
          this.redirectService.redirectTo503();
          return of(false);
        } else if (!isMaintenanceMode && state.url === '/503') {
          this.redirectService.redirectToHome();
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }

}
