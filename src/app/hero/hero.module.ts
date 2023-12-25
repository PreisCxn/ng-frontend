import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JumpButtonComponent} from "./jump-button/jump-button.component";
import {CategoryNavComponent} from "./category-nav/category-nav.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JumpButtonComponent,
    CategoryNavComponent
  ],
  exports: [
    JumpButtonComponent,
    CategoryNavComponent
  ]
})
export class HeroModule { }
