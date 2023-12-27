import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ModeGuard} from "./mode/shared/mode.guard";
import {NotFoundComponent} from "./not-found/not-found.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", redirectTo: "" },
  {
    path: "mode",
    loadChildren: () => import("./mode/mode.module").then(m => m.ModeModule)
  },
  { path: "404", component: NotFoundComponent},
];
