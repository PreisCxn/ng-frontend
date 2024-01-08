import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JumpButtonComponent} from "./jump-button/jump-button.component";
import {CategoryNavComponent} from "./category-nav/category-nav.component";
import {ParallaxDirective} from "./shared/parallax.directive";
import {HeadingComponent} from "./heading/heading.component";
import {ContainerComponent} from "./container/container.component";



@NgModule({
  declarations: [
    HeadingComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,
    JumpButtonComponent,
    CategoryNavComponent
  ],
  exports: [
    JumpButtonComponent,
    CategoryNavComponent,
    HeadingComponent,
    ContainerComponent
  ]
})
export class HeroModule { }
