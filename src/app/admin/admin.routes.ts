import {Routes} from "@angular/router";
import {ModeComponent} from "../mode/mode/mode.component";
import {ModeGuard} from "../mode/shared/mode.guard";
import {CategoryGuard} from "../mode/shared/category.guard";
import {ItemComponent} from "../mode/item/item.component";
import {ItemGuard} from "../mode/shared/item.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {ModSettingsComponent} from "./mod-settings/mod-settings.component";
import {CategorySettingsComponent} from "./category-settings/category-settings.component";
import {SellBuyReqComponent} from "./sell-buy-req/sell-buy-req.component";
import {AllItemsComponent} from "./items/all-items/all-items.component";

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'mod-settings',
        component: ModSettingsComponent,
      },
      {
        path: 'category-settings',
        component: CategorySettingsComponent,
      },
      {
        path: 'sell-buy-req',
        component: SellBuyReqComponent,
      },
      {
        path: 'item/all',
        component: AllItemsComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];
