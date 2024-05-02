import {Component, Input} from '@angular/core';
import {TranslationService} from "../../../shared/translation.service";
import {UserShortInfo} from "../../../shared/types/user.types";
import {RedirectService} from "../../../shared/redirect.service";
import {ItemInfo} from "../../../shared/types/item.types";

@Component({
  selector: 'section-seller-table',
  templateUrl: './seller-table.component.html',
  styleUrl: './seller-table.component.scss'
})
export class SellerTableComponent {

  @Input() itemUrl: string | null = null;
  @Input() sellingUser: UserShortInfo[] = [];
  @Input() buyingUser: UserShortInfo[] = [];
  @Input() maxSellingUser: number = 4;
  @Input() center: boolean = false;
  @Input() showAddButton: boolean | null = null;
  @Input('onAddClick') onAddClick: () => void = () => console.log('Add button clicked');

  private static readonly showButtonSmallerThan: number = 2;

  constructor(protected translation: TranslationService, protected redirect: RedirectService) {
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

  goToItemAndOpenReqMenu() {
    console.log(this.itemUrl);
    if(!this.itemUrl) return;
    this.redirect.redirectToItem({
      itemUrl: this.itemUrl
    }, {
      openMenu: 'sellbuyreq'
    });
  }

}
