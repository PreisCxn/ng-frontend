import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";
import {RedirectService} from "../../../shared/redirect.service";

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

    let multiplier = 1;

    if(event == null)
      multiplier = Number(this.custom.nativeElement.value);
    else {
      multiplier = Number((event.target as HTMLInputElement).value);
    }

    multiplier = Math.min(multiplier, 9999999);

    if(isNaN(multiplier)) {
      multiplier = 1;
    }

    if(event)
      (event.target as HTMLInputElement).value = String(multiplier);

    this.redirect.setQueryParams({amount: multiplier <= 1 ? null : multiplier},true);

    this.itemTableService.setCustomMultiplier(multiplier);
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  ngAfterViewInit(): void {
    const multi: string | null = this.redirect.getQueryParam('amount');

    console.log(multi);

    if (multi) {
      this.custom.nativeElement.value = multi;
      this.setCustomMultiplier();
    }
  }

}
