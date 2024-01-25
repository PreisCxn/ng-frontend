import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy{

  protected show: boolean = false;

  ngOnDestroy(): void {
    this.show = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.show = true;
    }, 250);
  }



}
