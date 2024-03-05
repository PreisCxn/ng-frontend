import {Component} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../../shared/admin-notify.service";
import {AdminService} from "../../shared/admin.service";

@Component({
  selector: 'admin-active-switch',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './active-switch.component.html',
  styleUrl: './active-switch.component.scss'
})
export class ActiveSwitchComponent {
  loading: boolean = false;

  constructor(private notify: AdminNotifyService, protected admin: AdminService) {
  }

  async toggleStatus() {
    this.loading = true;
    this.admin.toggleServerMaintenance().then(() => {
      console.log('Server maintenance ' + (this.admin.SERVER_MAINTENANCE ? 'enabled' : 'disabled'));
      this.notify.notify(AlertType.SUCCESS, 'Server maintenance ' + (this.admin.SERVER_MAINTENANCE ? 'enabled' : 'disabled'));
      this.loading = false;
    });
  }
}
