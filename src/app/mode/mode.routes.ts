import {Routes} from "@angular/router";
import {ModeComponent} from "./mode/mode.component";
import {ItemComponent} from "./item/item.component";
import {ModeGuard} from "./shared/mode.guard";
import {CategoryGuard} from "./shared/category.guard";
import {ItemGuard} from "./shared/item.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: ":mode",
    redirectTo: ":mode/all"
  },
  {
    path: ":mode/item",
    component: ItemComponent,
    canActivate: [ModeGuard, ItemGuard]
  },
  {
    path: ":mode/:category",
    component: ModeComponent,
    canActivate: [ModeGuard, CategoryGuard]
  }
];
