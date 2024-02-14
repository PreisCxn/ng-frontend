import {Component} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../../shared/admin-notify.service";

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
  status: boolean = true;
  loading: boolean = false;

  constructor(private notify: AdminNotifyService) {
  }

  async toggleStatus() {
    this.loading = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.status = !this.status;
        this.loading = false;
        this.notify.notify(AlertType.WARNING, !this.status ? 'Server erfolgreich online' : 'Server erfolgreich im Wartungsmodus');
        resolve(null);
      }, 500);
    });

  }
}
