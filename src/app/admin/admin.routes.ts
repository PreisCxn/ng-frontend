import {Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {ModSettingsComponent} from "./mod-settings/mod-settings.component";
import {CategorySettingsComponent} from "./category-settings/category-settings.component";
import {SellBuyReqComponent} from "./sell-buy-req/sell-buy-req.component";
import {AllItemsComponent} from "./items/all-items/all-items.component";
import {AdminGuard} from "./shared/admin.guard";

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'home',
        component: AdminHomeComponent,
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