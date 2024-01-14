// mode.guard.ts
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {RedirectService} from '../../shared/redirect.service';
import {ModeModule} from "../mode.module";
import {ModeService} from "./mode.service";
import bootstrap from "../../../main.server";
import {LoadingService} from "../../shared/loading.service";

@Injectable({
  providedIn: ModeModule
})
export class CategoryGuard implements CanActivate {
  constructor(private redirectService: RedirectService,private modeService: ModeService) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const category = route.params['category'];

    console.log("category guard")

    const promise = this.modeService
      .getCategories()
      .then(categories => {
        console.log(categories);
        console.log("test");
        return false;
      }).catch(error => {
        console.log("error")
        return false;
      });

    LoadingService.promises.push(promise);

    return await promise;

  }
}
