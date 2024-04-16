import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
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

@Component({
  selector: 'table-item-row',
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.scss'
})
export class ItemRowComponent implements OnInit, OnDestroy, AfterViewInit {

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
  private price64xCache: string = "";
  private nameCache: string = "";
  private imgUrlCache: string = "";

  private subscription: Subscription | null = null;
  protected customString: string = "";

  @Input() item: ItemShortInfo | null = null;

  @ViewChild('itemDesc') itemDesc: ElementRef | undefined;
  @ViewChild('rowElement') rowElement: ElementRef | undefined;
  @ViewChild('custom') custom: ElementRef | null = null;
  @ViewChild('descriptionLottie') animEle: ElementRef | null = null;
  @ViewChild('animComponent') animComponent: CustomAnimComponent | null = null;

  protected state: boolean = false;

  private animation: AnimationItem | undefined;

  private visibilityObserver: IntersectionObserver | undefined;
  protected visible: boolean = false;

  constructor(
    private renderer: Renderer2,
    protected itemTableService: ItemTableService,
    protected translation: TranslationService,
    protected redirect: RedirectService) {
  }

  ngAfterViewInit(): void {
    if(this.visibilityObserver == undefined) {
      console.error('Visibility observer is undefined for item ' + this.getNameCache());
      return;
    }
    if(this.rowElement == undefined) {
      console.error('Row element is undefined for item ' + this.getNameCache());
      return;
    }
    this.testObserver();
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

  ngOnDestroy(): void {
    const optional = Optional.of(this.subscription);
    if (optional.isPresent()) optional.get().unsubscribe();
  }

  ngOnInit(): void {
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if(!this.visible) {
          this.subscription = this.itemTableService.multiplierChanged.subscribe(() => {
            this.updateCustomString();
          });
          this.updateCustomString();

          if(!this.item) return;
          if(this.price1xCache == "") {
            this.price1xCache = NumberFormatPipe.format(this.getMinPrice(), this.getMaxPrice(), true);
          }

          if(this.price64xCache == "") {
            this.price64xCache = NumberFormatPipe.format(this.getMinPrice(64), this.getMaxPrice(64), true);
          }

          if(this.nameCache == "") {
            this.nameCache = this.getName();
          }

          if(this.imgUrlCache == "") {
            this.imgUrlCache = this.item.imageUrl;
          }
        }
        this.visible = true;
      } else {
        if(this.visible) {
          this.subscription?.unsubscribe();
        }
        this.visible = false;
      }
    });
    this.testObserver();

    setTimeout(() => {
      this.testObserver();
    }, 400);
  }

  private testObserver() {
    if(this.visibilityObserver && this.rowElement) {
      this.visibilityObserver.unobserve(this.rowElement.nativeElement);
      this.visibilityObserver.observe(this.rowElement.nativeElement);
    }
  }

  protected get1xPrice() {
    return this.price1xCache;
  }

  protected get64xPrice() {
    return this.price64xCache;
  }

  protected getNameCache() {
    return this.nameCache;
  }

  protected getImgUrl() {
    return this.imgUrlCache;
  }

  updateCustomString() {
    this.customString = NumberFormatPipe.format(this.getMinPrice(this.itemTableService.customMultiplier), this.getMaxPrice(this.itemTableService.customMultiplier), true);
    if (this.custom != null) this.custom.nativeElement.innerHTML = this.customString;
    if (this.custom != null) this.custom.nativeElement.text = this.customString;
  }

  protected readonly CustomAnimComponent = CustomAnimComponent;
  protected readonly AnimationType = AnimationType;
  protected readonly AnimationDataBuilder = AnimationDataBuilder;
}
