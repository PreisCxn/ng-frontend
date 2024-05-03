import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NgbModal, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {ItemData, ItemRetention, PriceSetter} from "../../../../shared/types/item.types";
import {Subject, Subscription} from "rxjs";
import {DataService} from "../../../../shared/data.service";
import {AdminService} from "../../../shared/admin.service";
import {NotifyService} from "../../../../shared/notify.service";

export type RetentionModData = {
  modeKey: string,
  minPrice: number,
  maxPrice: number,
  retention: ItemRetention | undefined,
}

export type FlexPriceData = {
  count: number,
  minPrice?: number,
  maxPrice?: number,
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
export class PriceRetentionComponent implements AfterViewInit, OnChanges, OnInit {
  @ViewChild('content') content: any;

  @Output() retentionChange = new EventEmitter<[modeKey: string, ItemRetention | null]>();
  @Input('data') data: ItemData | undefined;

  private loadDataSubject: Subject<void> = new Subject<void>();
  private getFlexingSubscription: Subscription | undefined;

  private flexingData: Map<string, FlexPriceData> = new Map<string, FlexPriceData>();
  protected takeOverBtnLoading: boolean = false;


  get items(): RetentionModData[] | undefined {
    return this.data?.modes.filter(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined) as RetentionModData[];
  }

  getItem(modeKey: string): RetentionModData {
    const item = this.items?.find(item => item.modeKey === modeKey);
    return item || {modeKey: modeKey, minPrice: -1, maxPrice: -1, retention: undefined};
  }

  hasPrice(modeKey: string): boolean {
    return this.getItem(modeKey).minPrice !== -1 || this.getItem(modeKey).maxPrice !== -1;
  }

  get modes(): string[] {
    return ['skyblock', 'citybuild']
  }

  getRetention(item: RetentionModData) {
    return item.retention;
  }

  protected modeKey: string = '';
  protected minPrice: number = 0;
  protected maxPrice: number = 0;
  protected fadeOut: number = 0;
  private currentItem: RetentionModData | undefined;

  constructor(private modalService: NgbModal,
              private dataService: DataService,
              private admin: AdminService,
              private notify: NotifyService) {
  }

  editPriceRetention(item: RetentionModData) {
    this.modeKey = item.modeKey;
    if(!this.hasPrice(item.modeKey)) {
      const flexData = this.getFlexingData(item.modeKey);
      this.minPrice = flexData.minPrice || 0;
      this.maxPrice = flexData.maxPrice || 0;
    } else {
      this.minPrice = item.minPrice;
      this.maxPrice = item.maxPrice;
    }
    if (item.retention?.fadeOut === undefined) {
      this.fadeOut = 30;
    } else {
      const currentTime = Date.now();
      console.log(item.retention.fadeOut)
      if (item.retention.fadeOut == -1) {
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

  handleRetentionClick() {
    if(!this.modeKey) return;
    if(this.hasPrice(this.modeKey)) {
      this.saveRetention();
    } else {
      if(this.minPrice <= 0 || this.maxPrice <= 0) {
        this.notify.error("Bitte geben Sie einen gültigen Preis ein (> 0)", "Fehler");
        return;
      }
      if(this.minPrice === this.maxPrice) {
        this.notify.error("Der Mindestpreis darf nicht gleich dem Höchstpreis sein", "Fehler");
        return;
      }
      if(this.minPrice > this.maxPrice) {
        this.notify.error("Der Mindestpreis darf nicht größer als der Höchstpreis sein", "Fehler");
        return;
      }
      this.forcePriceSetter(this.minPrice, this.maxPrice, this.modeKey);
      this.modalService.dismissAll();
    }
  }

  saveRetention() {
    if (!this.currentItem) return;
    const retention = {
      modeKey: this.modeKey,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      fadeOut: -1
    }

    if (this.fadeOut > 0) {
      retention.fadeOut = Date.now() + (this.fadeOut * 24 * 60 * 60 * 1000)
    }

    this.currentItem.retention = retention;

    this.retentionChange.emit([this.modeKey, retention]);

    this.modalService.dismissAll();
  }

  getRetentionFadeOut(mode: RetentionModData) {
    const fadeOut = this.getRetention(mode)?.fadeOut;

    if (fadeOut) {

      if (fadeOut == -1)
        return "forever!";

      const currentTime = Date.now();
      const timeUntilFadeOut = fadeOut - currentTime;

      const days = Math.round(timeUntilFadeOut / (1000 * 60 * 60 * 24));
      const hours = Math.round((timeUntilFadeOut % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.round((timeUntilFadeOut % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days} Tage`;

      if (hours > 0) return `${hours} Stunden`;

      return `${minutes} Minuten`;
    }
    return "Can't find fade out time.";
  }

  isInfluenced(item: RetentionModData) {
    return this.getRetention(item) !== undefined;
  }

  getRetentionPercentage(item: RetentionModData) {
    if (!this.hasPrice(item.modeKey)) return "NULL";
    const retention = this.getRetention(item)?.retentionPercentage;
    return (retention ? 100 - retention : 100) + "%";
  }

  protected canCalculatePrice(mode: string): boolean {
    if(!this.hasFlexingData(mode)) return false;

    const flexPrices: number | undefined = this.getFlexingData(mode).count;

    if (!this.data) return false;
    if (!flexPrices) return false;

    return flexPrices > 0;
  }

  protected hasLoadedData(): boolean {
    return this.data !== undefined;
  }

  ngAfterViewInit(): void {
    this.refreshFlexingData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log("Data changed")
      this.loadDataSubject.next();
    }
  }

  ngOnInit(): void {
    this.getFlexingSubscription = this.loadDataSubject
      .subscribe(() => this.refreshFlexingData());
  }

  private refreshFlexingData() {
    for (let mode of this.modes) {
      if (!this.data) continue;
      if (this.hasPrice(mode)) continue;

      this.reqFlexingData(this.data.pcxnId, mode)
        .then(flexingData => {
          this.flexingData.set(mode, flexingData);
        });

    }
  }

  protected hasFlexingData(mode: string): boolean {
    return this.flexingData.has(mode);
  }

  protected getFlexingData(mode: string): FlexPriceData {
    return this.flexingData.get(mode) as FlexPriceData;
  }

  protected takeOverBtn(mode: string) {
    if(this.takeOverBtnLoading) return;

    this.takeOverBtnLoading = true;
    this.takeOverPrice(mode).then(r => {
      setTimeout(() => {
        this.flexingData.delete(mode);
        this.loadDataSubject.next();
        this.takeOverBtnLoading = false;
      }, 500);
    });
  }

  protected async takeOverPrice(mode: string) {
    if (!this.data) return;
    if (!this.hasFlexingData(mode)) return;
    if (!this.canCalculatePrice(mode)) return;
    if (this.hasPrice(mode)) return;
    if (!this.data.pcxnId) return;


    const setter: PriceSetter = {
      modeKey: mode,
      itemId: this.data.pcxnId,
      calculate: true,
    }

    await this.admin.postPriceSetter(setter);
  }

  protected forcePriceSetter(minPrice: number, maxPrice: number, mode: string) {
    if(!this.data) return;
    if(this.hasPrice(mode)) return;
    if(!this.data.pcxnId) return;

    const setter: PriceSetter = {
      modeKey: mode,
      itemId: this.data.pcxnId,
      minPrice: minPrice,
      maxPrice: maxPrice,
      calculate: false,
    }

    this.admin.postPriceSetter(setter).then(r => {
      this.notify.success("Preis erfolgreich gesetzt", "Erfolg");
    }).catch(e => {
      this.notify.error("Preis konnte nicht gesetzt werden", "Fehler");
    });
  }

  private async reqFlexingData(itemId: number, mode: string): Promise<FlexPriceData> {
    return this.dataService.getFlexingData(itemId, mode);
  }
}
