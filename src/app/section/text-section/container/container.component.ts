import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'text-container',
  standalone: true,
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

  @Input() justifyContent: string = "space-evenly";
  @Input() reverseOnSmall: boolean = false;

}
