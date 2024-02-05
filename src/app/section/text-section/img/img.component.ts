import {Component, Input} from '@angular/core';

@Component({
  selector: 'text-img',
  standalone: true,
  imports: [],
  templateUrl: './img.component.html',
  styleUrl: './img.component.scss'
})
export class ImgComponent {

  @Input() img: string = '';
  @Input() alt: string = '';
  @Input() isBig: boolean = false;

}
