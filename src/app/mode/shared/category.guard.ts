// mode.guard.ts
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {RedirectService} from '../../shared/redirect.service';
import {ModeModule} from "../mode.module";
import {ModeService} from "./mode.service";
import {TranslationService} from "../../shared/translation.service";

@Injectable({
  providedIn: ModeModule
})
export class CategoryGuard implements CanActivate {
  constructor(private redirectService: RedirectService, private modeService: ModeService, private translation: TranslationService) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let category = route.params['category'];
    const mode = route.params['mode'];

    if(category.includes('?'))
      category = category.split('?')[0];

    return this.modeService
      .getCategories(this.translation.getCurrentLanguage())
      .then(categories => {

        const categoryEntry =
          category === ModeService.ALL_CATEGORY.route ||
          categories.some(
            c => c.route.slice(1, c.route.length) === category
          );

        if (!categoryEntry) {
          this.redirectService.redirect("mode/" + mode);
          return false;
        }

        return true;
      }).catch(error => {
        return false;
      });

  }
}
