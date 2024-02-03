import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";
import {LoadingService} from "./loading.service";
import {CategoryEntry, ItemInfo} from "./pcxn.types";
import {ModeService} from "../mode/shared/mode.service";
import {Optional} from "./optional";
import {isPlatformBrowser} from "@angular/common";

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

  public redirect(path: string) {
    console.log("redirect to " + path)
    this.loadingService.onNavigationEnd(null, null).then(r => {})
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
  }

  public redirectToCategory(mode: Modes, category: CategoryEntry) {
    this.redirect("mode/" + mode + "/" + category.route);
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

  public jumpToElement(elementId: string) {
    let element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  }

  public scrollToTop(smooth: boolean = true) {
    if(isPlatformBrowser(this.platformId))
      window.scrollTo({top: 0, behavior: smooth ? 'smooth' : 'instant'});
  }

  public jumpToTable(force: boolean = false) {
    ModeService.activeCategory.ifPresent(category => {
      if(category.pcxnId == ModeService.ALL_CATEGORY.pcxnId && !force) return;
      this.jumpToElement("#main");
    });
  }


  redirectToItem(item: ItemInfo | null, mode: Modes = ModeService.mode.orElse('') as Modes) {
    console.log("redirect to item " + item?.itemUrl)
    console.log("redirect to mode " + mode)
    if(!mode || item == null) return;
    this.redirect("mode/" + mode + "/item/" + item.itemUrl);
  }

}
