import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Modes} from "../../../../mode/shared/modes";
import {UserShortInfo} from "../../../../shared/types/user.types";
import {AdminService} from "../../../shared/admin.service";
import {AdminNotifyService, AlertType} from "../../../shared/admin-notify.service";

export type SellBuyModeData = {
  modeKey: Modes,
  sellingUser: UserShortInfo[],
  buyingUser: UserShortInfo[]
}

@Component({
  selector: 'app-sell-buy-editor',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './sell-buy-editor.component.html',
  styleUrl: './sell-buy-editor.component.scss'
})
export class SellBuyEditorComponent {

  currentMode: Modes = Modes.SKYBLOCK;

  @ViewChild('sellerName') sellerName: ElementRef | undefined;
  @ViewChild('buyerName') buyerName: ElementRef | undefined;

  @Input('data') modeData: SellBuyModeData[] = [];
  @Input('itemId') item: number | undefined;

  constructor(private admin: AdminService, private notify: AdminNotifyService) {
  }

  protected removeBuyer(index: number) {
    this.remove(this.buyer[index].name, 'buyer');
  }

  protected removeSeller(index: number) {
    this.remove(this.seller[index].name, 'seller');
  }

  protected addBuyer(name: string) {
    this.add(name, 'buyer')?.then(() => {
      if(this.buyerName === undefined) return;
      this.buyerName.nativeElement.value = '';
    });
  }

  protected addSeller(name: string) {
    this.add(name, 'seller')?.then(() => {
      if(this.sellerName === undefined) return;
      this.sellerName.nativeElement.value = '';
    });
  }

  private add(name:string, type: 'seller' | 'buyer') {
    if(this.item === undefined) return;
    return this.admin.addSellerBuyer(this.item, this.currentMode, name, type).then(r => {

      this.notify.notify(AlertType.SUCCESS, 'Verkäufer hinzugefügt');

    }).catch(e => {
      this.notify.notify(AlertType.DANGER, 'Verkäufer konnte nicht hinzugefügt werden');
    });
  }

  private remove(name: string, type: 'seller' | 'buyer') {
    if(this.item === undefined) return;
    this.admin.removeSellerBuyer(this.item, this.currentMode, name, type).then(r => {

      this.notify.notify(AlertType.SUCCESS, 'Verkäufer entfernt');

    }).catch(e => {
      this.notify.notify(AlertType.DANGER, 'Verkäufer konnte nicht entfernt werden');
    });
  }

  changeMode(mode: string) {
    this.currentMode = mode as Modes;
  }

  get seller() {
    return this.modeData.find(data => data.modeKey === this.currentMode)?.sellingUser || [];
  }

  get buyer() {
    return this.modeData.find(data => data.modeKey === this.currentMode)?.buyingUser || [];
  }

  get modes() {
    return Object.values(Modes);
  }

  isMode(mode: string) {
    return this.currentMode.toUpperCase() === mode.toUpperCase() as Modes;
  }

  protected readonly Object = Object;
  protected readonly Modes = Modes;
}
