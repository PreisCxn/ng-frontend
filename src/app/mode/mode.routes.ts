import {Routes} from "@angular/router";
import {ModeComponent} from "./mode/mode.component";
import {ItemComponent} from "./item/item.component";
import {ModeGuard} from "./shared/mode.guard";
import {CategoryGuard} from "./shared/category.guard";

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
    path: ":mode/:category",
    component: ModeComponent,
    canActivate: [ModeGuard, CategoryGuard]
  },
  {
    path: ":mode/item/:itemId",
    component: ItemComponent,
    canActivate: [ModeGuard]
  }
];
