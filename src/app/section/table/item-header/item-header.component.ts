import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";
import {RedirectService} from "../../../shared/redirect.service";
import {ModeService} from "../../../mode/shared/mode.service";

@Component({
  selector: 'table-item-header',
  templateUrl: './item-header.component.html',
  styleUrl: './item-header.component.scss'
})
export class ItemHeaderComponent implements AfterViewInit {

  @ViewChild('custom') custom!: ElementRef;

  constructor(private itemTableService: ItemTableService, private redirect: RedirectService) {
  }

  protected setCustomMultiplier(event: Event | null = null) {
    let multiplierString = event ? (event.target as HTMLInputElement).value : this.custom.nativeElement.value;
    multiplierString = multiplierString.replace(/[^0-9.,]+/g, '').replace(/([.,])+/, '');

    let multiplierNumber = Number(multiplierString.replace(/[.,]/g, '')) || 0;
    multiplierNumber = Math.min(multiplierNumber, 1_000_000_000);

    if(isNaN(multiplierNumber)) {
      multiplierString = "1";
      multiplierNumber = 1;
    }

    multiplierString = this.addPointsToNumber(multiplierNumber);

    if(event)
      (event.target as HTMLInputElement).value = multiplierString;

    this.redirect.setQueryParams({amount: multiplierNumber <= 1 ? null : multiplierNumber},true);

    this.itemTableService.setCustomMultiplier(multiplierNumber);
  }

  private addPointsToNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  ngAfterViewInit(): void {
    const multi: string | null = this.redirect.getQueryParam('amount');

    if(isNaN(Number(multi)))
      this.redirect.redirectTo404();

    if (multi) {
      this.custom.nativeElement.value = isNaN(Number(multi)) ? "1" : this.addPointsToNumber(Number(multi));
      this.setCustomMultiplier();
    }
  }

  protected getCategoryMultiplier() {
    return this.itemTableService.getCategoryMultiplier();
  }

}
