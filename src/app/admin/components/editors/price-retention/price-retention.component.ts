import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NgbModal, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {ItemData, ItemRetention} from "../../../../shared/types/item.types";

export type RetentionModData = {
  modeKey: string,
  minPrice: number,
  maxPrice: number,
  retention: ItemRetention | undefined,
}

@Component({
  selector: 'app-price-retention',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
    NgbTooltipModule
  ],
  templateUrl: './price-retention.component.html',
  styleUrl: './price-retention.component.scss'
})
export class PriceRetentionComponent implements AfterViewInit{
  @ViewChild('content') content: any;

  @Output() retentionChange = new EventEmitter<[modeKey:string, ItemRetention | null]>();
  @Input('data') data: ItemData | undefined;


  get items(): RetentionModData[] | undefined {
    return this.data?.modes.filter(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined) as RetentionModData[];
  }

  getRetention(item: RetentionModData) {
    return item.retention;
  }

  protected modeKey: string = '';
  protected minPrice: number = 0;
  protected maxPrice: number = 0;
  protected fadeOut: number = 0;
  private currentItem: RetentionModData | undefined;

  constructor(private modalService: NgbModal) {
  }

  editPriceRetention(item: RetentionModData) {
    this.modeKey = item.modeKey;
    this.minPrice = item.minPrice;
    this.maxPrice = item.maxPrice;
    if(item.retention?.fadeOut === undefined) {
      this.fadeOut = 30;
    } else {
      const currentTime = Date.now();
      console.log(item.retention.fadeOut)
      if(item.retention.fadeOut == -1) {
        this.fadeOut = -1;
      } else {
      const timeUntilFadeOut = item.retention.fadeOut - currentTime;

      this.fadeOut = Math.floor(timeUntilFadeOut / (1000 * 60 * 60 * 24));
      }
    }

    console.log(this.fadeOut)

    this.currentItem = item;

    this.open();
  }

  deletePriceRetention(item: RetentionModData) {
    this.retentionChange.emit([item.modeKey, null]);
    item.retention = undefined;
  }

  open() {
    this.modalService.open(this.content)
  }

  saveRetention() {
    if(!this.currentItem) return;
    const retention = {
      modeKey: this.modeKey,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      fadeOut: -1
    }

    if(this.fadeOut > 0) {
      retention.fadeOut = Date.now() + (this.fadeOut * 24 * 60 * 60 * 1000)
    }

    this.currentItem.retention = retention;

    this.retentionChange.emit([this.modeKey, retention]);

    this.modalService.dismissAll();
  }

  getRetentionFadeOut(mode: RetentionModData) {
    const fadeOut = this.getRetention(mode)?.fadeOut;

    if (fadeOut) {

      if(fadeOut == -1)
        return "forever!";

      const currentTime = Date.now();
      const timeUntilFadeOut = fadeOut - currentTime;

      const days = Math.round(timeUntilFadeOut / (1000 * 60 * 60 * 24));
      const hours = Math.round((timeUntilFadeOut % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.round((timeUntilFadeOut % (1000 * 60 * 60)) / (1000 * 60));

      if(days > 0) return `${days} Tage`;

      if(hours > 0) return `${hours} Stunden`;

      return `${minutes} Minuten`;
    }
    return "Can't find fade out time.";
  }

  isInfluenced(item: RetentionModData) {
    return this.getRetention(item) !== undefined;
  }

  getRetentionPercentage(item: RetentionModData) {
    return (this.getRetention(item)?.retentionPercentage || 100) + "%";
  }

  ngAfterViewInit(): void {

  }
}
