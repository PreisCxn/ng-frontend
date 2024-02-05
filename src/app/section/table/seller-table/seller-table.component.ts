import {Component, Input} from '@angular/core';
import {ItemInfo, UserShortInfo} from "../../../shared/pcxn.types";
import {TranslationService} from "../../../shared/translation.service";

@Component({
  selector: 'section-seller-table',
  templateUrl: './seller-table.component.html',
  styleUrl: './seller-table.component.scss'
})
export class SellerTableComponent {

  @Input() sellingUser: UserShortInfo[] = [];
  @Input() buyingUser: UserShortInfo[] = [];
  @Input() maxSellingUser: number = 4;
  @Input() center: boolean = false;
  @Input() showAddButton: boolean | null = null;

  private static readonly showButtonSmallerThan: number = 2;

  constructor(protected translation: TranslationService) {
  }

  get maxLength() {
    return Math.min(this.maxSellingUser, Math.max(this.sellingUser.length, this.buyingUser.length));
  }

  get range() {
    return Array.from({length: this.maxLength}, (_, i) => i);
  }

  showAdding(): boolean {
    if(this.showAddButton === null) return this.maxLength < SellerTableComponent.showButtonSmallerThan;
    return this.showAddButton;
  }

}
