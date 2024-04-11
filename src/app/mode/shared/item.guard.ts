import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {ModeModule} from "../mode.module";
import {ModeService} from "./mode.service";
import {Modes} from "./modes";
import {RedirectService} from "../../shared/redirect.service";
import {Optional} from "../../shared/optional";
import {DataService} from "../../shared/data.service";

@Injectable({
  providedIn: ModeModule
})
export class ItemGuard implements CanActivate {

  constructor(private modeService: ModeService, private redirect: RedirectService, private dataService: DataService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const itemId = route.queryParams['id'];
    const mode = route.params['mode'];

    const item = await this.modeService
      .getExtendedItem(itemId, mode as Modes)
      .catch(error => {
        this.dataService.checkError(error);
      });

    if (!item) {
      this.redirect.redirectTo404();
      return false;
    }

    this.modeService.setItemExtendedInfo(item);

    return true;
  }
}
