import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {Modes} from "../../../../mode/shared/modes";
import {UserShortInfo} from "../../../../shared/types/user.types";

@Component({
  selector: 'app-sell-buy-editor',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './sell-buy-editor.component.html',
  styleUrl: './sell-buy-editor.component.scss'
})
export class SellBuyEditorComponent {

  currentMode: Modes = Modes.SKYBLOCK;

  buyer: UserShortInfo[] = [{
    name: 'John Doe'
  }, {
    name: 'Jane Doe'
  }]

  seller: UserShortInfo[] = [{
    name: 'John Doe'
  }, {
    name: 'Jane Doe'
  }]

  removeBuyer(index: number) {
    this.buyer.splice(index, 1);
  }

  removeSeller(index: number) {
    this.seller.splice(index, 1);
  }

  addBuyer(name: string) {
    this.buyer.push({name: name});
  }

  addSeller(name: string) {
    this.seller.push({name: name});
  }

  changeMode(mode: string) {
    this.currentMode = mode as Modes;
  }

  isMode(mode: string) {
    return this.currentMode.toUpperCase() === mode.toUpperCase() as Modes;
  }

  protected readonly Object = Object;
  protected readonly Modes = Modes;
}
