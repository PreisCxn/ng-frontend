import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";

export type CardFeauture = [active: boolean, title: string]

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input('title') title!: string;
  @Input('fa-icon') faIcon: string | undefined = undefined;
  @Input('description') description!: string;
  @Input('features') features!: CardFeauture[];
  @Input('on-Btn-Click') onBtnClick: () => void = () => console.log('Button Clicked');
  @Input('btn-text') btnText: string = 'Press Me';

}
