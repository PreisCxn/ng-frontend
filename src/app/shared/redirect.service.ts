import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router,private loadingService: LoadingService) {
  }

  public redirect(path: string) {
    console.log("redirect to " + path)
    this.loadingService.onNavigationEnd(null, null)
    this.router.navigate([path]).then(e => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      }
    ).catch(error => {
      console.log(error);
    });
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

}
