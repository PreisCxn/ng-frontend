import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {routes} from "./admin.routes";
import {AdminGuard} from "./shared/admin.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {NavComponent} from "./components/nav/nav.component";
import {
  NgbAlert, NgbAlertModule,
  NgbInputDatepicker,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLinkButton,
  NgbNavOutlet
} from "@ng-bootstrap/ng-bootstrap";
import {ActiveSwitchComponent} from "./components/active-switch/active-switch.component";
import {NotifyComponent} from "./components/notify/notify.component";
import {AdminNotifyService} from "./shared/admin-notify.service";
import {AdminNavService} from "./shared/admin-nav.service";



@NgModule({
  declarations: [
    DashboardComponent,
    NavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbAlertModule,
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    NgbNavOutlet,
    NgbInputDatepicker,
    ActiveSwitchComponent,
    NotifyComponent,
  ],
  providers: [AdminGuard, AdminNotifyService, AdminNavService],
})
export class AdminModule { }
