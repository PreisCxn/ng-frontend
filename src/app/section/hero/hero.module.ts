import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryNavComponent} from "./category-nav/category-nav.component";
import {ParallaxDirective} from "./shared/parallax.directive";
import {HeadingComponent} from "./heading/heading.component";
import {ContainerComponent} from "./container/container.component";
import {ParallaxContainerComponent} from "./parallax-container/parallax-container.component";
import {ImageComponent} from "./image/image.component";
import {TranslationDirective} from "../../shared/translation.directive";

@NgModule({
  declarations: [
    HeadingComponent,
    ContainerComponent,
    ParallaxContainerComponent,
    CategoryNavComponent,
    ImageComponent
  ],
  imports: [
    CommonModule,
    ParallaxDirective,
    TranslationDirective
  ],
  exports: [
    HeadingComponent,
    ContainerComponent,
    ParallaxContainerComponent,
    ImageComponent,
    CategoryNavComponent
  ]
})
export class HeroModule { }
