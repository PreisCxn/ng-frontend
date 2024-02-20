import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";
import {LoadingService} from "./loading.service";
import {ModeService} from "../mode/shared/mode.service";
import {Optional} from "./optional";
import {isPlatformBrowser} from "@angular/common";
import {CategoryEntry} from "./types/categories.types";
import {ItemInfo} from "./types/item.types";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public redirect(path: string, useNgRouter: boolean = true) {
    this.loadingService.onNavigationEnd(null, null).then(r => {})
    if(useNgRouter) {
      this.router.navigate([path]).then(e => {
          if (e) {
            console.log("Navigation is successful!");
          } else {
            this.loadingService.onNavigationFail();
            console.log("Navigation has failed!");
          }
        }
      ).catch(error => {
        console.log(error);
      });
    } else {
      window.location.href = window.location.origin + "/" + path;
    }
  }

  public redirectToCategory(mode: Modes, category: CategoryEntry, useNgRouter: boolean = true) {
    this.redirect("mode/" + mode + "/" + category.route, useNgRouter);
  }

  public redirectTo404() {
    this.redirect("404");
  }

  public redirectTo503() {
    this.redirect("503");
  }

  public redirectToHome() {
    this.redirect("");
  }

  redirectToMode(mode: Modes) {
    this.redirect("mode/" + mode);
  }

  redirectToCxnContribution() {
    window.open('https://www.cytooxien.de', '_blank')
  }

  public jumpToElement(elementId: string, smooth: boolean = true) {
    let element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: smooth ? 'smooth' : 'instant'});
    }
  }

  public scrollToTop(smooth: boolean = true) {
    if(isPlatformBrowser(this.platformId))
      window.scrollTo({top: 0, behavior: smooth ? 'smooth' : 'instant'});
  }

  public jumpToTable(force: boolean = false, smooth: boolean = true) {
    ModeService.activeCategory.ifPresent(category => {
      if(category.pcxnId == ModeService.ALL_CATEGORY.pcxnId && !force) return;
      this.jumpToElement("#main", smooth);
    });
  }


  redirectToItem(item: ItemInfo | null, mode: Modes = ModeService.mode.orElse('') as Modes) {
    if(!mode || item == null) return;
    this.redirect("mode/" + mode + "/item/" + item.itemUrl);
  }

}
