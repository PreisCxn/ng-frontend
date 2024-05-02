import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";
import {NumberFormatPipe} from "../shared/number-format.pipe";
import {Optional} from "../../../shared/optional";
import {TranslationService} from "../../../shared/translation.service";
import {from, Subscription} from "rxjs";
import lottie, {AnimationItem} from 'lottie-web';
import {tap} from "rxjs/operators";
import {AnimationDataBuilder, AnimationType, CustomAnimComponent} from "../../custom-anim/custom-anim.component";
import {RedirectService} from "../../../shared/redirect.service";
import {ItemShortInfo} from "../../../shared/types/item.types";
import {Translation} from "../../../shared/types/translation.types";
import {TableIntersectService} from "../shared/table-intersect.service";
import {ModeService} from "../../../mode/shared/mode.service";
import {DataService} from "../../../shared/data.service";

@Component({
  selector: 'table-item-row',
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.scss'
})
export class ItemRowComponent implements OnDestroy, AfterViewInit, OnInit {

  protected readonly CLEAR_ITEM_INFO: ItemShortInfo = {
    modeKey: '',
    itemUrl: '',
    imageUrl: '',
    translation: [],
    minPrice: 0,
    maxPrice: 0,
    categoryIds: [],
    animationData: [],
    sellingUser: [],
    buyingUser: [],
  };

  @Input() itemCount: number = 0;

  private price1xCache: string = "";
  private categoryMultipliedCache: string = "";
  private nameCache: string = "";
  private imgUrlCache: string = "";

  private subscription: Subscription | null = null;
  protected customString: string = "";

  protected qmarkHover: boolean = false;

  @Input() item: ItemShortInfo | null = null;

  @ViewChild('itemDesc') itemDesc: ElementRef | undefined;
  @ViewChild('rowElement') rowElement: ElementRef | undefined;
  @ViewChild('custom') custom: ElementRef | null = null;
  @ViewChild('descriptionLottie') animEle: ElementRef | null = null;
  @ViewChild('animComponent') animComponent: CustomAnimComponent | null = null;

  private categoryChangeSubscription: Subscription | null = null;

  protected state: boolean = false;

  private animation: AnimationItem | undefined;

  protected visible: boolean = false;

  constructor(
    private renderer: Renderer2,
    private mode: ModeService,
    protected itemTableService: ItemTableService,
    protected translation: TranslationService,
    protected redirect: RedirectService,
    private tableIntersectService: TableIntersectService){
  }

  ngAfterViewInit(): void {
    this.tableIntersectService.observeItemRow(this);
  }

  updateAnimation() {
    from(import("../../../../assets/anims/test/data.json")).pipe(
      tap((data: any) => {
        // Create a deep copy of the data
        const dataCopy = JSON.parse(JSON.stringify(data));

        dataCopy.assets.forEach((asset: any, index: number) => {
          asset.u = `assets/anims/test/images/`;
        });

        dataCopy.assets[1].u = 'assets/img/items/cxn/general/specialitems/';
        dataCopy.assets[1].p = 'valentines_minion_item.png';

        // Find the asset you want to change and update its path

        // Load the animation with the modified data
        this.animation = lottie.loadAnimation({
          container: this.animEle?.nativeElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: dataCopy,
        });
      })
    ).subscribe();
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  openItem() {
    if (this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = true;
    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', `${this.itemDesc.nativeElement.scrollHeight}px`);

    if (this.animComponent != null) {
      setTimeout(() => {
        if (this.animComponent != null)
          this.animComponent.play();
      }, this.animComponent?.getIsInitialized() ? 0 : 450);
    }
  }

  public closeItem() {
    if (!this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = false;

    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', '0');

    if (this.animComponent != null)
      this.animComponent.reset();
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
    const translation: Translation[] = Optional.of(this.item)
      .orElse(this.CLEAR_ITEM_INFO).translation

    return TranslationService.ifTranslationUndefinedBackup(translation, this.translation.getCurrentLanguage());
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

  private categoryChanged: boolean = true;

  ngOnDestroy(): void {
    if (this.animComponent != null)
      this.animComponent.reset();

    const optional = Optional.of(this.subscription);
    if (optional.isPresent()) optional.get().unsubscribe();
    this.tableIntersectService.unobserveItemRow(this);
    if(this.categoryChangeSubscription)
      this.categoryChangeSubscription.unsubscribe();
  }

  public showRow() {
    if(!this.visible) {
      this.subscription = this.itemTableService.multiplierChanged.subscribe(() => {
        this.updateCustomString();
      });
      this.updateCustomString();

      if(!this.item) return;
      if(this.price1xCache == "") {
        this.price1xCache = NumberFormatPipe.format(this.getMinPrice(), this.getMaxPrice(), true);
      }

      if(this.categoryMultipliedCache == "") {
        this.categoryMultipliedCache = NumberFormatPipe.format(this.getMinPrice(this.itemTableService.getCategoryMultiplier()), this.getMaxPrice(this.itemTableService.getCategoryMultiplier()), true);
      }

      if(this.nameCache == "") {
        this.nameCache = this.getName();
      }

      if(this.imgUrlCache == "") {
        this.imgUrlCache = this.item.imageUrl;
      }
    }
    this.visible = true;
  }

  public hideRow() {
    this.visible = false;
  }

  protected get1xPrice() {
    return this.price1xCache;
  }

  protected getCategoryMultipliedPrice() {
    return this.categoryMultipliedCache;
  }

  protected getNameCache() {
    return this.nameCache;
  }

  protected getImgUrl() {
    return DataService.getFromCDN(this.imgUrlCache, 48);
  }

  updateCustomString() {
    this.customString = NumberFormatPipe.format(this.getMinPrice(this.itemTableService.customMultiplier), this.getMaxPrice(this.itemTableService.customMultiplier), true);
    if (this.custom != null) this.custom.nativeElement.innerHTML = this.customString;
    if (this.custom != null) this.custom.nativeElement.text = this.customString;
  }

  public getItemId(): Optional<number> {
    return Optional.of(Number(this.item?.pcxnId));
  }

  public getRowElement(): Optional<Element> {
    return Optional.of(this.rowElement?.nativeElement);
  }

  protected readonly CustomAnimComponent = CustomAnimComponent;
  protected readonly AnimationType = AnimationType;
  protected readonly AnimationDataBuilder = AnimationDataBuilder;

  ngOnInit(): void {
    if(this.item && ModeService.isItemCategoryMultiplierDefault(this.item)) return;
    this.categoryChangeSubscription = this.mode.subscribeToCategoryChange(category => {
      if(this.visible)
        this.categoryMultipliedCache = NumberFormatPipe.format(this.getMinPrice(this.itemTableService.getCategoryMultiplier()), this.getMaxPrice(this.itemTableService.getCategoryMultiplier()), true);
      else
        this.categoryMultipliedCache = "";
    })
  }

}
