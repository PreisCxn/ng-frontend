import {AfterViewInit, Injectable} from '@angular/core';
import {NotifyService} from "./notify.service";
import {RedirectService} from "./redirect.service";
import {CookieService} from "ngx-cookie-service";

enum NOTIFIES {
  MOD_VERSION_1_21 = 0,
  MOD_VERSION_1_20_4_OUT_SERVICE = 1,
  CHECK_OUT_MOD = 2,
}

@Injectable({
  providedIn: 'root'
})
export class CallToActionServiceService implements AfterViewInit {

  static readonly NOTIFY_COOKIE: string = 'notify';

  constructor(private notify: NotifyService, private redirect: RedirectService, private cookie: CookieService) { }

  ngAfterViewInit(): void {

  }

  public onNavigationEnd() {

    if(!this.isShown(NOTIFIES.MOD_VERSION_1_20_4_OUT_SERVICE)) {
      this.notify.warning("Downloade dir jetzt die 1.20.6 Version und verpasse nix!", "1.20.4 nicht mehr unterstützt!", () => {
        this.redirect.redirect('mod');
      });
      this.setShown(NOTIFIES.MOD_VERSION_1_20_4_OUT_SERVICE);
      return;
    }

    if(!this.isShown(NOTIFIES.MOD_VERSION_1_21)) {
      this.notify.info("Downloade dir jetzt die Version für 1.21!", "Neue Mod Version verfügbar!", () => {
        this.redirect.redirect('mod');
      });
      this.setShown(NOTIFIES.MOD_VERSION_1_21);
      return;
    }

    if(!this.isShown(NOTIFIES.CHECK_OUT_MOD)) {
      if(window.location.pathname.includes('mod')) return;
      this.notify.info("Schau dir unsere Mod an!", "Unsere Mod", () => {
        this.redirect.redirect('mod');
      });

      this.setShown(NOTIFIES.CHECK_OUT_MOD);
      return;
    }
  }

  private isShown(notify: NOTIFIES): boolean {
    const shownNotifies = this.cookie.get(CallToActionServiceService.NOTIFY_COOKIE);
    const shownNotifiesArray = shownNotifies.split(',');
    return shownNotifiesArray.includes(notify.toString());
  }

  setShown(notify: NOTIFIES): void {
    let shownNotifies = this.cookie.get(CallToActionServiceService.NOTIFY_COOKIE);
    let shownNotifiesArray = shownNotifies ? shownNotifies.split(',') : [];

    if (!shownNotifiesArray.includes(notify.toString())) {
      shownNotifiesArray.push(notify.toString());
    }

    this.cookie.set(CallToActionServiceService.NOTIFY_COOKIE, shownNotifiesArray.join(','), { path: '/', expires: 365 });
  }



}
