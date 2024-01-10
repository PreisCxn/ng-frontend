import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JumpButtonComponent} from "./jump-button/jump-button.component";
import {CategoryNavComponent} from "./category-nav/category-nav.component";
import {ParallaxDirective} from "./shared/parallax.directive";
import {HeadingComponent} from "./heading/heading.component";
import {ContainerComponent} from "./container/container.component";
import {ParallaxContainerComponent} from "./parallax-container/parallax-container.component";
import {ImageComponent} from "./image/image.component";



@NgModule({
  declarations: [
    HeadingComponent,
    ContainerComponent,
    ParallaxContainerComponent,
    ImageComponent
  ],
    imports: [
        CommonModule,
        JumpButtonComponent,
        CategoryNavComponent,
        ParallaxDirective
    ],
  exports: [
    JumpButtonComponent,
    CategoryNavComponent,
    HeadingComponent,
    ContainerComponent,
    ParallaxContainerComponent,
    ImageComponent
  ]
})
export class HeroModule { }
