import { Component } from '@angular/core';
import {Direction} from "../shared/parallax.directive";

@Component({
  selector: 'hero-picture',
  templateUrl: './picture.component.html',
  styleUrl: './picture.component.scss'
})
export class PictureComponent {

  protected readonly Direction = Direction;
}
