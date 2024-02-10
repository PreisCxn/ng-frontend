import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ModeGuard} from "./mode/shared/mode.guard";
import {ErrorComponent} from "./error/error.component";
import {MaintenanceGuard} from "./shared/maintenance.guard";
import {ImprintComponent} from "./imprint/imprint.component";

export const routes: Routes = [
  {
    path: "",
    canActivateChild: [MaintenanceGuard],
    children: [
      { path: "", component: HomeComponent },
      { path: "home", redirectTo: "" },
      { path: "imprint", component: ImprintComponent },
      {
        path: "mode",
        loadChildren: () => import("./mode/mode.module").then(m => m.ModeModule)
      },
      {
        path: "404",
        component: ErrorComponent,
        data: {
          errorCode: "404",
          titleKey: "pcxn.subsite.notFound.title",
          descriptionKey: "pcxn.subsite.notFound.description",
          sectionTitleKey: "pcxn.subsite.notFound.sectionTitle"
        }
      },
      {
        path: "503",
        component: ErrorComponent,
        data: {
          errorCode: "503",
          titleKey: "pcxn.subsite.maintenance.title",
          descriptionKey: "pcxn.subsite.maintenance.description",
          sectionTitleKey: "pcxn.subsite.maintenance.sectionTitle"
        }
      },
      {
        path: "**",
        redirectTo: "404"
      },
      {
        path: "admin",
        loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule)
      }
    ]
  }
];
