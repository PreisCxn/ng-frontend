import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {routes} from "./admin.routes";
import {AdminGuard} from "./shared/admin.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {NavComponent} from "./nav/nav.component";



@NgModule({
  declarations: [
    DashboardComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [AdminGuard],
})
export class AdminModule { }
