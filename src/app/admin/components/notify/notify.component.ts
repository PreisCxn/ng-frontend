import {Component, OnInit} from '@angular/core';
import {AdminNotifyService} from "../../shared/admin-notify.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'admin-notify',
  standalone: true,
  imports: [
    NgbAlert,
    NgIf,
    NgClass
  ],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss'
})
export class NotifyComponent implements OnInit{
  message: string = '';
  type: string = 'success';
  active: boolean = false;
  loaded: boolean = false;

  ngOnInit(): void {
    this.closeAlert();
  }

  constructor(private notify: AdminNotifyService) {
    this.notify.getAlert().subscribe((alert: any) => {
      if(!this.loaded) {
        this.loaded = true;
      }
      this.message = alert.message;
      this.active = true;
      this.type = alert.type;

      // Start a timer to close the alert after 5 seconds
      setTimeout(() => {
        this.closeAlert();
      }, 2000);
    });
  }

  protected closeAlert() {
    this.active = false;
  }
}
