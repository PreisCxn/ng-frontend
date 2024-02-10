import {Routes} from "@angular/router";
import {ModeComponent} from "../mode/mode/mode.component";
import {ModeGuard} from "../mode/shared/mode.guard";
import {CategoryGuard} from "../mode/shared/category.guard";
import {ItemComponent} from "../mode/item/item.component";
import {ItemGuard} from "../mode/shared/item.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  {
    path: '**',
    component: DashboardComponent,
  }
];
