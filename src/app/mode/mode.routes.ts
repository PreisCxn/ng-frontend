import {Routes} from "@angular/router";
import {ModeComponent} from "./mode/mode.component";
import {ItemComponent} from "./item/item.component";
import {ModeGuard} from "./shared/mode.guard";

export const routes: Routes = [
  {
    path: ":mode",
    component: ModeComponent,
    canActivate: [ModeGuard]
  },
  {
    path: ":mode/:itemId",
    component: ItemComponent,
    canActivate: [ModeGuard]
  }
];
