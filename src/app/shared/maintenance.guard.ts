import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, CanActivateChild, UrlTree
} from '@angular/router';
import {from, Observable, of, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {RedirectService} from "./redirect.service";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivateChild {
  private maintenanceMode = false; // mit get anfrage an api nach mode checken

  constructor(private router: Router, private redirectService: RedirectService, private dataService: DataService) {
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    if (state.url === '/404' || state.url === '/503' || state.url === '/429') {
      return true;
    }

    const result = await this.dataService.isWebMaintenance();

    const isAdmin = await this.dataService.isAdmin()
      .catch(e => {
        return false;
      });

    if (result && !isAdmin) {
      this.redirectService.redirectTo503();
      return false;
    } else {
      return true;
    }
  }

}
