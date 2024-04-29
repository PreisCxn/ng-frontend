import {
  AfterContentChecked,
  AfterContentInit, AfterRenderPhase,
  AfterRenderRef,
  AfterViewInit,
  Component,
  ElementRef, Input, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {ChartComponent} from "../../section/chart/chart.component";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";
import {RedirectService} from "../../shared/redirect.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ContainerComponent} from "../../section/text-section/container/container.component";
import {PlainTextComponent} from "../../section/text-section/plain-text/plain-text.component";
import {ImgComponent} from "../../section/text-section/img/img.component";
import {
  AnimationDataBuilder,
  AnimationType,
  CustomAnimComponent
} from "../../section/custom-anim/custom-anim.component";
import {Modes} from "../shared/modes";
import {TranslationService} from "../../shared/translation.service";
import {Languages} from "../../shared/languages";
import {NumberFormatPipe} from "../../section/table/shared/number-format.pipe";
import {TranslationDirective} from "../../shared/translation.directive";
import {TableModule} from "../../section/table/table.module";
import {Optional} from "../../shared/optional";
import {LoadingService} from "../../shared/loading.service";
import {ItemExtendedInfo, ItemReportCreation, SellBuyReqCreation} from "../../shared/types/item.types";
import {CategoryEntry} from "../../shared/types/categories.types";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WindowMenuComponent} from "../../window-menu/window-menu.component";
import {CookieService} from "ngx-cookie-service";
import {DataService} from "../../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {NotifyService} from "../../shared/notify.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    ChartComponent,
    HeroModule,
    NgClass,
    ContainerComponent,
    PlainTextComponent,
    ImgComponent,
    CustomAnimComponent,
    NgIf,
    TranslationDirective,
    TableModule,
    NgOptimizedImage,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    WindowMenuComponent
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, AfterViewInit, OnDestroy {

  /*
  Item Seiten sollen anzeigen:
  - Animation, wenn vorhanden
  - NookPreis, wenn vorhanden
  - DiagrammDaten
  - Beschreibung
  - Letztes Update (check)
  - Möglichkeit zur Preisänderung
  - ItemSeller Buyer anzeigen
  - Item Kategorien anzeigen
   */

  @ViewChild('heading') heading: ElementRef | undefined;
  @ViewChild('animComponent') anim: CustomAnimComponent | null = null;
  @ViewChild('animComponent2') anim2: CustomAnimComponent | null = null;
  @ViewChild('sellBuyWindow') sellBuyWindow!: WindowMenuComponent;
  @ViewChild('itemReportWindow') itemReportWindow!: WindowMenuComponent;
  @ViewChild('custom') customInput!: ElementRef;

  private price1xCache: string = "";
  private lastUpdateCache: string = "";

  protected item: ItemExtendedInfo = this.modeService.getItemExtendedInfo().orElseThrow("Item not found");

  protected diaParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.4)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected jumpButtonParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.2)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected headingParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.6)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected show: boolean = false;

  protected sellBuyForm!: FormGroup;
  protected itemReportForm!: FormGroup;

  protected sellBuyError: boolean = false;
  protected itemReportError: boolean = false;

  private static readonly MC_NAME_COOKIE: string = 'pcxn?mcName';

  private tbPriceCache: string | undefined = undefined;
  private nmPriceCache: string | undefined = undefined;

  constructor(
    protected modeService: ModeService,
    route: ActivatedRoute,
    protected redirectService: RedirectService,
    private headerService: HeaderService,
    protected translation: TranslationService,
    private loading: LoadingService,
    private cookie: CookieService,
    private data: DataService,
    private notify: NotifyService
  ) {
    modeService.setActivatedRoute(route, () => {
    });
  }

  ngOnInit(): void {

    this.sellBuyForm = new FormGroup({
      selling: new FormControl([false, false]),
      mcName: new FormControl(this.getMcNameCookie()),
    });

    this.itemReportForm = new FormGroup({
      highPrice: new FormControl(this.item.maxPrice),
      lowPrice: new FormControl(this.item.minPrice)
    });

    this.translation.subscribe((lang) => {
      this.headerService.setSectionTitle(this.getItemName(lang) + " - " + this.getModeTranslation());
      this.modeService.getCategories(lang).then(categories => {
      });
    });


    this.redirectService.scrollToTop(false);

    this.headerService.init(
      this.getItemName() + " - " + this.getModeTranslation(),
      false,
      false,
      ModeService.mode.orElse("") as MenuActives);

    this.headerService.setModeBreadCrumb(ModeService.mode.orElse("") as Modes);

  }

  ngOnDestroy(): void {
    this.modeService.setItemExtendedInfo(null);
  }

  protected getModeTranslation(): string {
    return this.translation.getTranslation("pcxn.subsite." + this.item.modeKey + ".sectionTitle");
  }

  getItemName(lang: Languages = this.translation.getCurrentLanguage()): string {
    return TranslationService.ifTranslationUndefinedBackup(this.item.translation, lang);
  }

  ngAfterViewInit(): void {
    if (this.anim != null)
      this.anim.play();
    if (this.anim2 != null)
      this.anim2.play();

    this.redirectService.setQueryParams({search: null}, true);
    setTimeout(() => {
      this.initCalculatorAmount();
    });
    this.redirectService.shiftQueryParamToBeginning('id');
  }

  private initCalculatorAmount() {
    console.log("hi")
    const amount = isNaN(Number(this.redirectService.getQueryParam('amount'))) ? 1 : Number(this.redirectService.getQueryParam('amount'));
    this.setCustomInput(amount);
  }

  protected getLastUpdate(): string {
    const now = new Date();
    const lastUpdate = new Date(Number(this.item.lastUpdate));
    lastUpdate.setMilliseconds(0);
    lastUpdate.setSeconds(0);

    const diffInMs = now.getTime() - lastUpdate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInMinutes = diffInMs / (1000 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    const options = {hour: '2-digit' as const, minute: '2-digit' as const};

    if (diffInHours < 1) {
      return this.formatTimeAgo(diffInMinutes, "minute");
    } else if (diffInHours < 12) {
      return this.formatTimeAgo(diffInHours, "hour");
    } else if (diffInHours < 24) {
      return `${this.translation.getTranslation("pcxn.time.today")} - ${lastUpdate.toLocaleTimeString(undefined, options)}`;
    } else if (diffInHours < 48) {
      return `${this.translation.getTranslation("pcxn.time.yesterday")} - ${lastUpdate.toLocaleTimeString(undefined, options)}`;
    } else {
      return this.formatTimeAgo(diffInDays, "day");
    }
  }

  private formatTimeAgo(diff: number, unit: string): string {
    let unitTranslation: string = this.getTimeTranslation(unit, diff);
    if (TranslationService.isTranslationKey(unitTranslation)) {
      unitTranslation = this.getDefaultTranslation(unit);
    }

    let agoTranslation: string = this.translation.getTranslation("pcxn.time.ago");
    let isGerman: boolean = this.translation.getCurrentLanguage() === Languages.German;
    if (TranslationService.isTranslationKey(agoTranslation)) {
      agoTranslation = 'vor';
      isGerman = true;
    }

    if (isGerman) {
      return `${agoTranslation} ${Math.floor(diff)} ${unitTranslation}`;
    } else {
      return `${Math.floor(diff)} ${unitTranslation} ${agoTranslation}`;
    }
  }

  private getDefaultTranslation(unit: string): string {
    const translations = {
      minute: 'Minuten',
      hour: 'Stunden',
      day: 'Tage'
    };
    return translations[unit as keyof typeof translations] || "";
  }

  getTimeTranslation(unit: string, diff: number): string {
    return this.translation.getTranslation("pcxn.time." + unit + (diff >= 2 ? ".plural" : ".singular"));
  }

  protected redirectToCurrentMode() {
    if (Optional.of(this.item.modeKey).isEmpty()) return;
    this.redirectService.redirectToMode(this.item.modeKey as Modes);
    this.redirectService.scrollToTop(false);
  }

  protected redirectToCategory(category: CategoryEntry) {
    if (Optional.of(this.item.modeKey).isEmpty()) return;
    this.loading.onNavigationStart(null, null);
    this.redirectService.redirectToCategory(this.item.modeKey as Modes, category, false);
  }

  protected getPrice1x(): string {
    if (this.price1xCache == "" && this.item)
      this.price1xCache = NumberFormatPipe.format(this.item.minPrice, this.item.maxPrice, true);
    return this.price1xCache || "";
  }

  protected getLastUpdateCache(): string {
    if (this.lastUpdateCache == "") {
      this.lastUpdateCache = this.getLastUpdate();
    }
    return this.lastUpdateCache || "";
  }

  openSellBuyWindow() {
    this.sellBuyError = false;
    this.sellBuyWindow.open();
  }

  openReportWindow() {
    this.itemReportError = false;
    this.itemReportWindow.open();
  }

  protected sendSellBuyRequest() {
    this.sellBuyError = false;
    if (!this.item.pcxnId || !this.item.modeKey) {
      console.log("Item not found");
      this.notify.error('Due to an internal Error','Coudn\'t send Request');
      this.sellBuyError = true;
      return;
    }
    if (!this.sellBuyForm.get('mcName') || !this.sellBuyForm.get('selling')) {
      this.notify.error('Missing Username','Coudn\'t send Request');
      return;
    }

    const data: [boolean, boolean] = this.sellBuyForm.get('selling')?.value;

    const reqs: SellBuyReqCreation[] = [];

    const baseReq: SellBuyReqCreation = {
      itemId: this.item.pcxnId,
      modeKey: this.item.modeKey,
      userName: this.sellBuyForm.get('mcName')?.value,
    }

    if (data[0]) {
      const sellerReq: SellBuyReqCreation = {
        ...baseReq,
        isSelling: true,
        isBuying: false
      }
      reqs.push(sellerReq);
    }

    if (data[1]) {
      const buyerReq: SellBuyReqCreation = {
        ...baseReq,
        isSelling: false,
        isBuying: true
      }
      reqs.push(buyerReq);
    }

    let successCount = 0;

    let promises = reqs.map(req => {
      return this.data.createSellBuyRequest(req).then(r => {
        if (!r.id) {
          this.sellBuyError = true;
        } else
          successCount++;
      }).catch(e => {
        this.sellBuyError = true;
      });
    });

    Promise.all(promises).then(() => {
      if (successCount > 0) {
        this.sellBuyWindow.close();
        this.notify.success('Your request will be processed','Request sent');
      } else
        this.notify.error('You have already sent requests.','Coudn\'t send Request');
    });
  }

  protected sendItemReport() {
    this.itemReportError = false;
    if (!this.item.pcxnId || !this.item.modeKey) {
      this.itemReportError = true;
      console.log("Item not found");
      this.notify.error('Due to an internal Error','Coudn\'t send Report');
      return;
    }

    const upperPrice = this.itemReportForm.get('highPrice')?.value;
    const lowerPrice = this.itemReportForm.get('lowPrice')?.value;

    if (upperPrice === this.item.maxPrice && lowerPrice === this.item.minPrice) {
      this.itemReportError = true;
      this.notify.error('Please correct your Prices','Coudn\'t send Report');
      return;
    }

    const report: ItemReportCreation = {
      itemId: this.item.pcxnId,
      modeKey: this.item.modeKey,
      minPrice: lowerPrice,
      maxPrice: upperPrice
    }

    this.data.createItemReport(report).then(r => {
      if (!r.id) {
        this.itemReportError = true;
        this.notify.error('Due to an internal Error2','Coudn\'t send Report');
      } else {
        this.itemReportWindow.close();
        this.notify.success('Your report will be processed','Report sent');
      }
    }).catch(() => {
      this.itemReportError = true;
      this.notify.error('Due to an internal Error','Coudn\'t send Report');
    });


  }

  protected isSelling(): boolean {
    if (!this.sellBuyForm.get('selling')) return false;
    return this.sellBuyForm.get('selling')?.value[0];
  }

  protected isBuying(): boolean {
    if (!this.sellBuyForm.get('selling')) return false;
    return this.sellBuyForm.get('selling')?.value[1];
  }

  protected toggleBuying() {
    if (!this.sellBuyForm.get('selling')) return;

    const data: [boolean, boolean] = this.sellBuyForm.get('selling')?.value;

    data[1] = !data[1];

    return this.sellBuyForm.get('selling')?.setValue(data);
  }

  protected toggleSelling() {
    if (!this.sellBuyForm.get('selling')) return;

    const data: [boolean, boolean] = this.sellBuyForm.get('selling')?.value;

    data[0] = !data[0];

    return this.sellBuyForm.get('selling')?.setValue(data);
  }

  protected getItemText() {
    return TranslationService.ifTranslationUndefinedBackup(this.item.translation, this.translation.getCurrentLanguage()) + " | " + this.getModeTranslation()
  }

  protected onMcNameChange() {
    if (!this.sellBuyForm.get('mcName')) return;
    if (this.getMcNameCookie() === this.sellBuyForm.get('mcName')?.value) return;

    if (this.sellBuyForm.get('mcName')?.value.length > 0)
      this.cookie.set(ItemComponent.MC_NAME_COOKIE, this.sellBuyForm.get('mcName')?.value, {path: '/'});
    else
      this.cookie.delete(ItemComponent.MC_NAME_COOKIE, '/');
  }

  protected getMcNameCookie(): string {
    return this.cookie.get(ItemComponent.MC_NAME_COOKIE);
  }

  protected getSellBuyReqButtonText() {
    if (!this.sellBuyForm.get('selling')) return "";

    let text: string | null = null;

    if (this.sellBuyForm.get('selling')?.value[0] && this.sellBuyForm.get('selling')?.value[1])
      text = this.translation.getTranslation('pcxn.window.sell-buy-req.sell-buyer');
    else if (this.sellBuyForm.get('selling')?.value[0])
      text = this.translation.getTranslation('pcxn.window.sell-buy-req.seller');
    else if (this.sellBuyForm.get('selling')?.value[1])
      text = this.translation.getTranslation('pcxn.window.sell-buy-req.buyer');

    if (text === null)
      return this.translation.getTranslation('pcxn.window.sell-buy-req.choose');

    return this.translation.getTranslation('pcxn.window.sell-buy-req.request-as') + text;
  }

  protected getCustom() {
    return this.nmPriceCache;
  }

  protected getTomBlockCustom() {
    return this.tbPriceCache;
  }

  protected onCustomInput() {
    if(!this.customInput) return;

    const val:number = Number(this.customInput.nativeElement.value);

    if(isNaN(val)) return;

    if(val < 0) {
      this.setCustomInput(0);
      return;
    }
    if(val > 99999999) {
      this.setCustomInput(99999999);
      return;
    }

    if(this.hasNook()) {
      // @ts-ignore
      this.tbPriceCache = NumberFormatPipe.formatSingle(this.item.nookPrice * val);
    }

    this.nmPriceCache = NumberFormatPipe.format(this.item.minPrice * val, this.item.maxPrice * val, true);

    if(val > 1)
      this.redirectService.setQueryParams({amount: val}, true);
    else
      this.redirectService.setQueryParams({amount: null}, true);
  }

  protected setCustomInput(newNum: number) {
    if(!this.customInput) return;
    this.customInput.nativeElement.value = newNum;
    this.onCustomInput();
  }

  protected hasNook() {
    return this.item.nookPrice !== undefined;
  }

  protected readonly TranslationService = TranslationService;
  protected readonly NumberFormatPipe = NumberFormatPipe;
  protected readonly ModeService = ModeService;
  protected readonly Modes = Modes;
  protected readonly AnimationType = AnimationType;
  protected readonly AnimationDataBuilder = AnimationDataBuilder;
  protected readonly Optional = Optional;
}
