import {Component} from '@angular/core';
import {AdminNavService, AdminSubsites} from "../../shared/admin-nav.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {AdminService} from "../../shared/admin.service";
import {AdminNotifyService, AlertType} from "../../shared/admin-notify.service";
import {ItemReport} from "../../../shared/types/item.types";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'admin-item-reports',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    DatePipe,
    RouterLink
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  constructor(private nav: AdminNavService, protected admin: AdminService, private notify: AdminNotifyService) {
    this.nav.setActiveSubsite(AdminSubsites.ITEM_REPORTS);
  }

  deleteReport(report: number) {
    this.admin.deleteItemReport(report).then(() => {
      this.admin.getItemReports().then(r => {
        this.notify.notify(AlertType.SUCCESS, "Report " + report + " deleted successfully");
      });
    }).catch(e => {
      this.notify.notify(AlertType.DANGER, "Failed to delete report " + report + " due to " + e)
    });
  }

  refresh() {
    window.location.reload();
  }

}
