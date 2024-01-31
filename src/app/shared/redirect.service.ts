import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";
import {LoadingService} from "./loading.service";
import {CategoryEntry, ItemInfo} from "./pcxn.types";
import {ModeService} from "../mode/shared/mode.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private router: Router,
    private loadingService: LoadingService
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

  redirectToItem(item: ItemInfo | null, mode: Modes = ModeService.mode.orElse('') as Modes) {
    console.log("redirect to item " + item?.itemUrl)
    console.log("redirect to mode " + mode)
    if(!mode || item == null) return;
    this.redirect("mode/" + mode + "/item/" + item.itemUrl);
  }

}
