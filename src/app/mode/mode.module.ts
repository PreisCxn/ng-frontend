import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModeGuard} from "./shared/mode.guard";
import {RouterModule} from "@angular/router";
import {routes} from "./mode.routes";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ModeModule { }
