import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModeGuard} from "./shared/mode.guard";
import {RouterModule} from "@angular/router";
import {routes} from "./mode.routes";
import {ModeService} from "./shared/mode.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [ModeGuard, ModeService]
})
export class ModeModule { }
