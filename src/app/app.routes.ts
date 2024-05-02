import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ErrorComponent} from "./error/error.component";
import {MaintenanceGuard} from "./shared/maintenance.guard";
import {ImprintComponent} from "./imprint/imprint.component";
import {DataProtectionComponent} from "./data-protection/data-protection.component";
import {McModComponent} from "./mc-mod/mc-mod.component";

export const routes: Routes = [
  {
    path: "",
    canActivateChild: [MaintenanceGuard],
    children: [
      { path: "", component: HomeComponent },
      { path: "home", redirectTo: "" },
      { path: "imprint", component: ImprintComponent },
      { path: "mod", component: McModComponent},
      { path: "data-protection", component: DataProtectionComponent },
      {
        path: "admin",
        loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule)
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
        path: "429",
        component: ErrorComponent,
        data: {
          errorCode: "429",
          titleKey: "pcxn.subsite.tooManyRequests.title",
          descriptionKey: "pcxn.subsite.tooManyRequests.description",
          sectionTitleKey: "pcxn.subsite.tooManyRequests.sectionTitle"
        }
      },
      {

        path: "",
        loadChildren: () => import("./mode/mode.module").then(m => m.ModeModule)
      }
    ]
  }
];
