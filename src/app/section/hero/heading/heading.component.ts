import {Component, Input} from '@angular/core';
import {Optional} from "../../../shared/optional";
import {Direction} from "../shared/parallax.directive";

@Component({
  selector: 'hero-heading',
  standalone: false,
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent {

  @Input() title: Optional<{
    pictureUrl:string,
    preHeading: string,
    heading: string,
    postHeading: string
  }> = Optional.empty();


  protected readonly Direction = Direction;
}
