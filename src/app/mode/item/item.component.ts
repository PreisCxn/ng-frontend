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
import {ItemExtendedInfo} from "../../shared/types/item.types";
import {CategoryEntry} from "../../shared/types/categories.types";

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
    NgForOf
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

  constructor(
    protected modeService: ModeService,
    route: ActivatedRoute,
    protected redirectService: RedirectService,
    private headerService: HeaderService,
    protected translation: TranslationService,
    private loading: LoadingService,
  ) {
    modeService.setActivatedRoute(route, () => {
    });
  }

  ngOnInit(): void {

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
    if(this.anim2 != null)
      this.anim2.play();
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
    if(Optional.of(this.item.modeKey).isEmpty()) return;
    this.redirectService.redirectToMode(this.item.modeKey as Modes);
    this.redirectService.scrollToTop(false);
  }

  protected redirectToCategory(category: CategoryEntry) {
    if(Optional.of(this.item.modeKey).isEmpty()) return;
    this.loading.onNavigationStart(null, null);
    this.redirectService.redirectToCategory(this.item.modeKey as Modes, category, false);
  }

  protected getPrice1x(): string {
    if(this.price1xCache == "" && this.item)
      this.price1xCache = NumberFormatPipe.format(this.item.minPrice, this.item.maxPrice, true);
    return this.price1xCache;
  }

  protected getLastUpdateCache(): string {
    if(this.lastUpdateCache == "") {
      this.lastUpdateCache = this.getLastUpdate();
    }
    return this.lastUpdateCache;
  }

  protected readonly TranslationService = TranslationService;
  protected readonly NumberFormatPipe = NumberFormatPipe;
  protected readonly ModeService = ModeService;
  protected readonly Modes = Modes;
  protected readonly AnimationType = AnimationType;
  protected readonly AnimationDataBuilder = AnimationDataBuilder;
}
