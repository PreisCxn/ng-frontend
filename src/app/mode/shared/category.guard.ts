// mode.guard.ts
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {RedirectService} from '../../shared/redirect.service';
import {ModeModule} from "../mode.module";
import {ModeService} from "./mode.service";
import bootstrap from "../../../main.server";
import {LoadingService} from "../../shared/loading.service";
import {TranslationService} from "../../shared/translation.service";

@Injectable({
  providedIn: ModeModule
})
export class CategoryGuard implements CanActivate {
  constructor(private redirectService: RedirectService, private modeService: ModeService, private translation: TranslationService) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const category = route.params['category'];
    const mode = route.params['mode'];

    console.log("category guard")

    const promise = this.modeService
      .getCategories(true, this.translation.getCurrentLanguage())
      .then(categories => {
        console.log(categories);

        console.log(category)

        const categoryEntry =
          category === ModeService.ALL_CATEGORY.route ||
          categories.some(
          c => c.route === category
        );

        if(!categoryEntry) {
          this.redirectService.redirect("mode/" + mode);
          return false;
        }

        return true;
      }).catch(error => {
        console.log("error")
        return false;
      });

    return promise;

  }
}
