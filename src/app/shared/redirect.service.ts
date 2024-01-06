import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Modes} from "../mode/shared/modes";
import {HeaderService} from "./header.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router) {
  }

  public redirect(path: string) {
    this.router.navigate([path]).then();
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

}
