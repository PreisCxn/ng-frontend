import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";
import {LoadingService} from "./loading.service";
import {ModeService} from "../mode/shared/mode.service";
import {Optional} from "./optional";
import {isPlatformBrowser} from "@angular/common";
import {CategoryEntry} from "./types/categories.types";
import {ItemInfo} from "./types/item.types";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {
  }

  public redirect(path: string, queryParams: any = {}, useNgRouter: boolean = true) {
    this.loadingService.onNavigationEnd(null, null).then(r => {
    })
    if (useNgRouter) {
      this.router.navigate([path], {
        queryParams: queryParams,
        queryParamsHandling: "merge"
      }).then(e => {
          console.log(path)
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
      let url = new URL(window.location.origin + "/" + path);
      Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
      window.location.href = url.href;
    }
  }

  public setQueryParams(params: Params, shouldMerge: boolean = true) {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: shouldMerge ? 'merge' : '',
      replaceUrl: true
    }).then(r => {});
  }


  public redirectToCategory(mode: Modes, category: CategoryEntry, useNgRouter: boolean = true) {
    console.log("Redirecting to category: " + category.route.slice(1, category.route.length));

    // Get the current search query parameter
    const searchParam = this.route.snapshot.queryParams['search'];

    // Create the query parameters for the redirect
    let queryParams: any = {};
    if (searchParam) {
      queryParams['search'] = searchParam;
    }

    this.redirect(mode + "/" + this.removeRoutingSlash(category.route), queryParams, useNgRouter);
  }

  public redirectTo404() {
    this.redirect("404");
  }

  public redirectTo503() {
    this.redirect("503");
  }

  public redirectTo429() {
    this.redirect("429");
  }

  public redirectToHome() {
    this.redirect("");
  }

  redirectToMode(mode: Modes) {
    this.redirect(mode);
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
    if (isPlatformBrowser(this.platformId))
      window.scrollTo({top: 0, behavior: smooth ? 'smooth' : 'instant'});
  }

  public jumpToTable(force: boolean = false, smooth: boolean = true) {
    ModeService.activeCategory.ifPresent(category => {
      if (category.pcxnId == ModeService.ALL_CATEGORY.pcxnId && !force) return;
      this.jumpToElement("#main", smooth);
    });
  }


  redirectToItem(item: ItemInfo | null, mode: Modes = ModeService.mode.orElse('') as Modes) {
    if (!mode || item == null) return;
    this.redirect("" + mode + "/item", {id: this.removeRoutingSlash(item.itemUrl)});
  }

  redirectToAdminItem(itemId: number) {
    this.redirect("admin/item/id/" + itemId);
  }

  public redirectIfError(url: string = ""): void {
    if (this.router.url.includes('404') || this.router.url.includes('503') || this.router.url.includes('429')) {
      this.redirect(url);
    }
  }

  private redirectToAdmin(): void {
    this.redirect("admin");
  }

  private removeRoutingSlash(route: string): string {
    if (route.startsWith('/')) {
      route = route.slice(1);
    }
    if (route.endsWith('/')) {
      route = route.slice(0, -1);
    }
    return route;
  }

  public reloadPage(): void {
    window.location.reload();
  }

  public isOnAdmin(): boolean {
    return this.router.url.includes('admin');
  }

}
