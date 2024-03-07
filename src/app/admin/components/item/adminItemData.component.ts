import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {TranslationEditorComponent} from "../editors/translation-editor/translation-editor.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Languages} from "../../../shared/languages";
import {AdminService} from "../../shared/admin.service";
import {IMultiSelectOption, IMultiSelectSettings, NgxBootstrapMultiselectModule} from "ngx-bootstrap-multiselect";
import {SellBuyEditorComponent, SellBuyModeData} from "../editors/sell-buy-editor/sell-buy-editor.component";
import {AnimationEditorComponent} from "../editors/animation-editor/animation-editor.component";
import {TabsModule} from "ngx-bootstrap/tabs";
import {PriceRetentionComponent} from "../editors/price-retention/price-retention.component";
import {CategoryEntry} from "../../../shared/types/categories.types";
import {ItemChanges, ItemData, ItemReport, ItemRetention} from "../../../shared/types/item.types";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {RedirectService} from "../../../shared/redirect.service";
import {Optional} from "../../../shared/optional";
import {AdminNotifyService, AlertType} from "../../shared/admin-notify.service";
import {Translation} from "../../../shared/types/translation.types";
import {TranslationDirective} from "../../../shared/translation.directive";
import {ItemAnimationData} from "../../../section/custom-anim/custom-anim.component";

@Component({
  selector: 'admin-itemData',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslationEditorComponent,
    NgClass,
    FormsModule,
    NgxBootstrapMultiselectModule,
    SellBuyEditorComponent,
    AnimationEditorComponent,
    TabsModule,
    PriceRetentionComponent,
    TooltipModule,
    TranslationDirective
  ],
  templateUrl: './adminItemData.component.html',
  styleUrl: './adminItemData.component.scss'
})
export class AdminItemDataComponent implements OnChanges, AfterViewInit {

  @ViewChild('animEditor') animEditor: AnimationEditorComponent | undefined;

  @Input() itemData: ItemData | undefined;

  protected dirty: boolean = false;

  private nameTransDirty: boolean = false;
  private descTransDirty: boolean = false;
  private categoryDirty: boolean = false;
  private animDirty: boolean = false;
  private retentionDirty: boolean = false;

  protected itemReports: ItemReport[] = [];

  protected isDirty(): boolean {
    return this.categoryDirty ||
      this.nameTransDirty ||
      this.descTransDirty ||
      this.animDirty ||
      this.retentionDirty ||
      this.isImgUrlDirty();
  }

  protected animData: ItemAnimationData[] = [];

  itemName: string = '';
  itemForm: any;
  submitted = false;

  private itemChanges: ItemChanges = {
    pcxnId: -1,
  };

  protected static readonly ITEM_IMG_DIR = 'assets/img/items/';

  constructor(private fb: FormBuilder, private admin: AdminService, private redirect: RedirectService, private notify: AdminNotifyService) {
    /*


     */
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      translations: this.fb.array([]),
      description: this.fb.array([]), // Change this line
      itemRetention: this.fb.array([]),
      imageUrl: [''],
      isEditing: [false]
    });

    this.admin.getCategories(Languages.German).then((categories) => {
      this.myOptions = categories
        .filter(entry => 'translation' in entry.translationData && entry.pcxnId !== -1)
        .map((entry) => {
          // @ts-ignore
          return {id: entry.pcxnId, name: entry.translationData.translation};
        });
    });

  }

  ngAfterViewInit() {
    this.refreshForm();
  }

  optionsModel: number[] = [];
  myOptions: IMultiSelectOption[] = [];
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 10,
    displayAllSelectedText: true,
    showUncheckAll: true
  }

  onCatChange() {
    this.refreshCatDirty();
  }

  private refreshCatDirty() {
    this.getCategoryChanges().ifPresentOrElse(() => {
      this.categoryDirty = true;
    }, () => {
      this.categoryDirty = false;
    });
  }

  private isImgUrlDirty() {
    return this.itemForm.get('imageUrl').value !== this.itemData?.imageUrl;
  }


  addTranslation(form: string, event: Translation[]) {
    if (event === undefined) return;
    const translations = this.itemForm.get(form) as FormArray;
    translations.clear();
    event.forEach(t => {
      translations.push(this.fb.group(t));
    });

    const isNameTrans = form === 'translations';

    const oldTrans = isNameTrans ? this.itemData?.translation : this.itemData?.description.information;

    this.getTranslationChanges(form, oldTrans || [], [Languages.English, Languages.German, Languages.MemeCxn])
      .ifPresentOrElse(() => {
        if (isNameTrans)
          this.nameTransDirty = true;
        else
          this.descTransDirty = true;
      }, () => {
        if (isNameTrans)
          this.nameTransDirty = false;
        else
          this.descTransDirty = false;
      });
  }

  protected onAnimUpdate(event: ItemAnimationData[]) {
    if (event === undefined) return;
    this.animData = event;

    this.refreshAnimDirty();
  }

  private getAnimChanges(): Optional<ItemAnimationData[]> {
    const oldAnim = this.itemData?.animationData || [];
    const newAnim = this.animData;

    if (oldAnim.length !== newAnim.length || JSON.stringify(oldAnim) !== JSON.stringify(newAnim)) {
      return Optional.of(newAnim);
    }

    return Optional.empty();
  }

  private refreshAnimDirty() {
    this.getAnimChanges().ifPresentOrElse(() => {
      this.animDirty = true;
    }, () => {
      this.animDirty = false;
    });
  }

  onSubmit() {

    const changes = this.calcChanges();

    if (changes.isPresent()) {
      this.admin.saveItemChanges(changes.get())
        .then(() => {
          this.notify.notify(AlertType.SUCCESS, 'Saved changes');
          this.itemForm.markAsPristine();
          if (changes.get().modes !== undefined) {
            this.admin.getItemReports().then(async r => {
              if (this.itemData)
                this.itemReports = await this.admin.getItemReportsOfItem(this.itemData.pcxnId);
            });
          }
          this.refreshForm();
        }).catch(e => {
        this.notify.notify(AlertType.DANGER, e.error || e.message);
      });
    } else {
      this.notify.notify(AlertType.INFO, 'No valid changes to save');
      this.refreshForm();
    }
  }

  public static getImgUrl(img: string | null): string {

    if (img === null)
      return '';

    if (img.startsWith('/'))
      img = img.slice(1);

    if (img.startsWith('assets/img/items/')) {
      return img;
    } else if (img.startsWith('img/items/')) {
      return 'assets/' + img;
    } else if (img.startsWith('items/')) {
      return 'assets/img/' + img;
    } else if (img.startsWith('mc') || img.startsWith('cxn'))
      return this.ITEM_IMG_DIR + img;

    return '';
  }

  protected isSetup() {
    return this.itemData?.setup || false;
  }

  protected isBlocked() {
    return this.itemData?.blocked || false;
  }

  protected getItemId() {
    return this.itemData?.pcxnId;
  }

  protected getConnectionId() {
    return Number(this.itemData?.connection);
  }

  protected isConnected() {
    return this.itemData?.connection !== null && this.itemData?.connection !== undefined && this.itemData?.connection > 0;
  }

  protected redirectToConnection() {
    const connection = this.getConnectionId();
    if (isNaN(connection)) return;

    this.redirect.redirectToAdminItem(connection);
  }

  protected getItemName() {
    if (this.itemData === undefined) return '';
    return this.admin.getItemDisplayData(this.itemData);
  }

  protected getConnectionName() {
    if (this.itemData === undefined) return '';

    const connection = this.admin.ITEM_DATA.orElse([]).find(item => item.pcxnId === this.getConnectionId());
    if (connection === undefined) return '';
    return this.admin.getItemDisplayData(connection);
  }

  protected getFoundModes(): Optional<string> {
    if(!this.itemData) return Optional.empty();
    return this.admin.getFoundModes(this.itemData);
  }

  protected getFoundModesArr(): Optional<string[]> {
    if(!this.itemData) return Optional.empty();
    return this.admin.getFoundModesArr(this.itemData);
  }

  protected hasSearchKey() {
    return this.itemData?.pcxnSearchKey !== undefined && this.itemData?.pcxnSearchKey !== null;
  }

  protected hasPbvSearchKey() {
    return this.itemData?.pbvSearchKey !== undefined && this.itemData?.pbvSearchKey !== null;
  }

  protected hasModes() {
    return this.itemData?.modes?.some(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined) || false;
  }

  protected hasRoute() {
    return this.itemData?.itemUrl !== undefined && this.itemData?.itemUrl !== null && this.itemData?.itemUrl.length > 0;
  }

  getModePrices(): string {
    if (this.itemData?.modes) {
      // Filtern Sie die modes, die minPrice oder maxPrice haben
      const modesWithPrice = this.itemData.modes.filter(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined);
      return modesWithPrice.map(mode => `${mode.modeKey}: ${mode.minPrice} - ${mode.maxPrice}`).join(', ');
    }
    return '';
  }

  getSetupRequirements(): string {
    let requirements = 'Fehlt: \n';

    if (!this.hasEnglishTranslation())
      requirements += 'Englische Namen Übersetzung, ';

    if (!this.hasGermanTranslation())
      requirements += 'Deutsche Namen Übersetzung, ';

    if (!this.itemData?.imageUrl || this.itemData?.imageUrl.length === 0)
      requirements += '(Bild Path)';

    return requirements;
  }

  private isActive(bool: boolean): string {
    return bool ? '✓' : '✖';
  }

  protected hasGermanTranslation() {
    return this.itemData?.translation.some(t => t.language === Languages.German) || false;
  }

  protected hasEnglishTranslation() {
    return this.itemData?.translation.some(t => t.language === Languages.English) || false;
  }

  protected onRetentionUpdate(event: [string, ItemRetention | null]) {
    const form = this.itemForm.get('itemRetention') as FormArray;
    const index = form.controls.findIndex(c => c.get('modeKey')?.value === event[0]);

    if (index !== -1) {
      form.removeAt(index);
    }

    const retentionGroup = this.fb.group({
      modeKey: event[0],
      retention: event[1]
    });

    form.push(retentionGroup);
    this.retentionDirty = true;
  }

  private refreshForm() {
    if (this.itemData === undefined) return;
    if (this.itemForm === undefined) return;

    const nameTrans: Translation[] = this.itemData.translation;
    const descTrans: Translation[] | undefined = this.itemData.description.information;
    this.itemForm.patchValue({
      imageUrl: this.itemData?.imageUrl || '',
    });
    this.addTranslation('translations', nameTrans);
    if (descTrans !== undefined) {
      this.addTranslation('description', descTrans);
    }

    this.optionsModel = [];
    this.optionsModel = [...(this.itemData?.categoryIds || [])];
    this.refreshCatDirty();

    this.animData = [...(this.itemData.animationData || [])];
    this.animEditor?.reload(true);
    this.refreshAnimDirty();

    this.retentionDirty = false;
  }

  private calcChanges(): Optional<ItemChanges> {
    if (this.itemData === undefined) return Optional.empty();


    this.itemChanges.pcxnId = this.itemData.pcxnId;

    if (this.itemForm.get('imageUrl')?.value !== this.itemData?.imageUrl) {
      const imgUrl = AdminItemDataComponent.getImgUrl(this.itemForm.get('imageUrl')?.value);
      if (imgUrl !== this.itemData?.imageUrl && imgUrl.length > 0)
        this.itemChanges.imageUrl = imgUrl;
    }

    const nameTransChanges = this.getTranslationChanges('translations', this.itemData.translation);

    if (nameTransChanges.isPresent())
      this.itemChanges.translation = nameTransChanges.get();

    const descTransChanges = this.getTranslationChanges('description',
      this.itemData.description.information || [],
      [Languages.MemeCxn, Languages.German, Languages.English]);

    if (descTransChanges.isPresent())
      this.itemChanges.description = {information: descTransChanges.get()};

    const catChanges = this.getCategoryChanges();

    if (catChanges.isPresent())
      this.itemChanges.categoryIds = catChanges.get();

    const animChanges = this.getAnimChanges();

    if (animChanges.isPresent())
      this.itemChanges.animationData = animChanges.get();

    const modes = this.getFoundModesArr();

    if (modes.isPresent()) {
      for (let mode of modes.get()) {
        const retentionChanges = this.getRetentionChanges(mode);

        if (retentionChanges.isPresent()) {
          if (this.itemChanges.modes === undefined) this.itemChanges.modes = [];

          const retention = retentionChanges.get();

          if (retention === -1) {
            this.itemChanges.modes.push({modeKey: mode, retention: null});
          } else {
            this.itemChanges.modes.push({modeKey: mode, retention: retention});
          }

        }
      }
    }

    if (Object.keys(this.itemChanges).length < 2) return Optional.empty();

    return Optional.of(this.itemChanges);
  }

  protected getTranslationChanges(form: string, oldTrans: Translation[], deletableLanguages: Languages[] = [Languages.MemeCxn]): Optional<Translation[]> {
    const translations = this.itemForm.get(form) as FormArray;
    const nameTrans = translations.getRawValue() as Translation[];

    //if (nameTrans.length < deletableLanguages.length) return Optional.empty();

    const findTranslation = (lang: Languages): Optional<string> => {
      const oldFind = oldTrans.find(t => t.language === lang)?.translation;
      const newFind = nameTrans.find(t => t.language === lang)?.translation;

      if (oldFind === newFind) return Optional.empty();

      if (newFind === undefined && !deletableLanguages.includes(lang)) return Optional.empty();

      return Optional.of(newFind || '');
    }


    const result: Translation[] = [];

    const deTrans = findTranslation(Languages.German);

    if (deTrans.isPresent())
      result.push({language: Languages.German, translation: deTrans.get()});

    const enTrans = findTranslation(Languages.English);

    if (enTrans.isPresent())
      result.push({language: Languages.English, translation: enTrans.get()});

    const memeTrans = findTranslation(Languages.MemeCxn);

    if (memeTrans.isPresent())
      result.push({language: Languages.MemeCxn, translation: memeTrans.get()});

    if (result.length === 0) return Optional.empty();

    return Optional.of(result);

  }

  private getCategoryChanges(): Optional<number[]> {
    const oldCats = this.itemData?.categoryIds || [];
    const newCats = this.optionsModel;

    if (oldCats.length !== newCats.length || !oldCats.every((value, index) => value === newCats[index])) {
      return Optional.of(newCats);
    }

    return Optional.empty();
  }

  private getRetentionChanges(modeKey: string): Optional<ItemRetention | -1> {
    const newData = this.itemForm.get('itemRetention')?.getRawValue() as {
      modeKey: string,
      retention: ItemRetention | null
    }[];

    console.log(newData)

    if (newData.length === 0) return Optional.empty();

    const mode = newData.find(data => data.modeKey === modeKey);

    if (mode === undefined) return Optional.empty();

    return Optional.of(mode.retention || -1);
  }

  getTranslation(): string {
    if (this.itemData === undefined) return '';
    if (this.itemData.description.information === undefined) return '';
    return this.itemData.description.information[0].translation || '';
  }

  getSellBuyData(): SellBuyModeData[] {
    if (this.itemData === undefined) return [];
    return this.itemData.modes as SellBuyModeData[];
  }

  blockItem() {
    if (this.itemData === undefined) return;
    this.admin.blockItem(this.itemData.pcxnId, !this.isBlocked())
      .then(() => {
        this.notify.notify(AlertType.SUCCESS, this.isBlocked() ? 'Item unblocked' : 'Item blocked');
        this.refreshForm();
      }).catch(e => {
      this.notify.notify(AlertType.DANGER, e.error || e.message);
    });
  }


  protected readonly TranslationEditorComponent = TranslationEditorComponent;
  protected readonly Languages = Languages;
  protected readonly Object = Object;
  protected readonly ItemComponent = AdminItemDataComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemData']) {
      this.refreshForm();
      if (this.itemData)
        this.admin.getItemReportsOfItem(this.itemData.pcxnId).then(reports => {
          this.itemReports = reports;
        });
    }
  }

  deleteReport(report: number) {
    this.admin.deleteItemReport(report).then(() => {
      this.admin.getItemReports().then(r => {
        this.notify.notify(AlertType.SUCCESS, "Report " + report + " deleted successfully");
        if (this.itemData)
          this.admin.getItemReportsOfItem(this.itemData.pcxnId).then(reports => {
            this.itemReports = reports;
          });
      });
    }).catch(e => {
      this.notify.notify(AlertType.DANGER, "Failed to delete report " + report + " due to " + e)
    });
  }

  refreshReports() {
    window.location.reload();
  }

}
