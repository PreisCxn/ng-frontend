import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModeGuard} from "./shared/mode.guard";
import {RouterModule} from "@angular/router";
import {routes} from "./mode.routes";
import {ModeService} from "./shared/mode.service";
import {CategoryGuard} from "./shared/category.guard";
import {ItemGuard} from "./shared/item.guard";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [ModeGuard, ModeService, CategoryGuard, ItemGuard],
})
export class ModeModule { }
