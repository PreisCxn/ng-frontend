import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";
import {NumberFormatPipe} from "../shared/number-format.pipe";
import {ItemShortInfo} from "../../../shared/pcxn.types";
import {Optional} from "../../../shared/optional";
import {TranslationService} from "../../../shared/translation.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'table-item-row',
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.scss'
})
export class ItemRowComponent implements OnInit, OnDestroy, AfterViewInit{

  protected readonly CLEAR_ITEM_INFO: ItemShortInfo = {
    modeKey: '',
    itemUrl: '',
    imageUrl: '',
    translation: [],
    minPrice: 0,
    maxPrice: 0,
    categoryIds: [],
    animationUrl: '',
    sellingUser: [],
    buyingUser: [],
  };

  @Input() itemCount: number = 0;

  private subscription: Subscription | null = null;
  protected customString: string = "";

  @Input() item: ItemShortInfo | null = null;

  @ViewChild('itemDesc') itemDesc: ElementRef | undefined;
  @ViewChild('custom') custom: ElementRef | null = null;

  protected state: boolean = false;

  constructor(
    private renderer: Renderer2,
    protected itemTableService: ItemTableService,
    protected translation: TranslationService) {
  }

  ngAfterViewInit(): void {
    this.updateCustomString();
    }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  openItem() {
    if (this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = true;
    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', `${this.itemDesc.nativeElement.scrollHeight}px`);

  }

  public closeItem() {
    if (!this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = false;

    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', '0');
  }

  toggleItem() {
    if (this.state) {
      this.closeItem();
    } else {
      this.openItem();
    }
  }

  onItemClicked() {
    this.itemTableService.toggleItemRow(this);
  }

  protected getName() {
    return Optional.of(this.item)
      .orElse(this.CLEAR_ITEM_INFO).translation
      .filter(t => t.language === this.translation.getCurrentLanguage())
      .map(t => t.translation)[0];
  }

  protected getMaxPrice(multiplier: number = 1) {
    return Optional.of(this.item)
      .orElse(this.CLEAR_ITEM_INFO).maxPrice * multiplier;
  }

  protected getMinPrice(multiplier: number = 1) {
    return Optional.of(this.item)
      .orElse(this.CLEAR_ITEM_INFO).minPrice * multiplier;
  }

  protected readonly NumberFormatPipe = NumberFormatPipe;

  ngOnDestroy(): void {
    const optional = Optional.of(this.subscription);
    if(optional.isPresent()) optional.get().unsubscribe();
    }

  ngOnInit(): void {

    this.subscription = this.itemTableService.multiplierChanged.subscribe(() => {
      this.updateCustomString();
    });
  }



  updateCustomString() {
    console.log(this.custom);
    this.customString = NumberFormatPipe.format(this.getMinPrice(this.itemTableService.customMultiplier), this.getMaxPrice(this.itemTableService.customMultiplier), true);
    if(this.custom != null) this.custom.nativeElement.innerHTML = this.customString;
    if(this.custom != null) this.custom.nativeElement.text = this.customString;
  }
}
