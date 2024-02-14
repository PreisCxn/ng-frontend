import {Component, inject, TemplateRef} from '@angular/core';

import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {RedirectService} from "../../../shared/redirect.service";
import {AdminNavService, AdminSubsites} from "../../shared/admin-nav.service";

@Component({
  selector: 'admin-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private offcanvasService = inject(NgbOffcanvas);
  closeResult = '';

  constructor(private redirect: RedirectService, private nav: AdminNavService) {
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  protected navigateTo(url: AdminSubsites) {
    this.redirect.redirect("admin/" + url);
  }

  isSubsiteActive(subsite: AdminSubsites) {
    return this.nav.activeSubsite === subsite;
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  protected readonly AdminSubsites = AdminSubsites;
}
