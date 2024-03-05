import {Component, Input} from '@angular/core';
import {TranslationEditorComponent} from "../editors/translation-editor/translation-editor.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Languages} from "../../../shared/languages";
import {AdminService} from "../../shared/admin.service";
import {IMultiSelectOption, IMultiSelectSettings, NgxBootstrapMultiselectModule} from "ngx-bootstrap-multiselect";
import {TranslationService} from "../../../shared/translation.service";
import {SellBuyEditorComponent} from "../editors/sell-buy-editor/sell-buy-editor.component";
import {AnimationEditorComponent} from "../editors/animation-editor/animation-editor.component";
import {TabsModule} from "ngx-bootstrap/tabs";
import {PriceRetentionComponent} from "../editors/price-retention/price-retention.component";
import {CategoryEntry} from "../../../shared/types/categories.types";
import {ItemData} from "../../../shared/types/item.types";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {RedirectService} from "../../../shared/redirect.service";
import {Optional} from "../../../shared/optional";

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
    TooltipModule
  ],
  templateUrl: './adminItemData.component.html',
  styleUrl: './adminItemData.component.scss'
})
export class AdminItemDataComponent {

  @Input() itemData: ItemData | undefined;

  category: CategoryEntry[] = [];
  itemName: string = '';
  itemForm: any;
  submitted = false;
  categories: CategoryEntry[] = []

  protected static readonly ITEM_IMG_DIR = 'assets/img/items/';

  constructor(private fb: FormBuilder, private admin: AdminService, private redirect: RedirectService) {
    /*


     */
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      translations: this.fb.array([]),
      description: this.fb.array([]), // Change this line
      itemRetention: this.fb.group({}),
      imageUrl: ['', Validators.required],
      sellingUser: this.fb.array([]),
      buyingUser: this.fb.array([]),
      categories: this.fb.array([]),
      isEditing: [false]
    });

    this.admin.getCategories(Languages.German).then((categories) => {
      this.myOptions = categories
        .filter(entry => 'translation' in entry.translationData && entry.pcxnId !== -1)
        .map((entry) => {
          // @ts-ignore
          return { id: entry.pcxnId, name: entry.translationData.translation };
        });
    });
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

  onChange() {
    console.log(this.optionsModel);
  }


  addTranslation(form:string, event: any) {
    const translations = this.itemForm.get(form) as FormArray;
    translations.push(this.fb.control(event.translation));
  }

  onSubmit() {
    this.submitted = true;
    if (this.itemForm.valid) {
      console.log(this.itemForm.value);
      // Here you can add the code to submit the form data to the server
    }
  }

  isDirty() {
    return this.itemForm.dirty;
  }

  public static getImgUrl(img: string | null): string {

    if(img === null)
      return '';

    if(img.startsWith('/'))
      img = img.slice(1);

    if(img.startsWith('assets/img/items/')) {
      return img;
    } else if(img.startsWith('img/items/')){
      return 'assets/' + img;
    } else if (img.startsWith('items/')) {
      return 'assets/img/' + img;
    } else if(img.startsWith('mc') || img.startsWith('cxn'))
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
    if(isNaN(connection)) return;

    this.redirect.redirectToAdminItem(connection);
  }

  protected getItemName() {
    if(this.itemData === undefined) return '';
    return this.admin.getItemDisplayData(this.itemData);
  }

  protected getConnectionName() {
    if(this.itemData === undefined) return '';

    const connection = this.admin.ITEM_DATA.orElse([]).find(item => item.pcxnId === this.getConnectionId());
    if(connection === undefined) return '';
    return this.admin.getItemDisplayData(connection);
  }

  protected getFoundModes():Optional<string> {
    if(this.itemData?.modes && this.itemData.modes.length === 0)
      return Optional.empty();

    return Optional.of(this.itemData?.modes.map(mode => mode.modeKey).join(', ') || '');
  }

  protected hasSearchKey() {
    return this.itemData?.pcxnSearchKey !== undefined && this.itemData?.pcxnSearchKey !== null;
  }

  protected hasPbvSearchKey() {
    return this.itemData?.pbvSearchKey !== undefined && this.itemData?.pbvSearchKey !== null;
  }

  protected hasModes() {
    return this.itemData?.modes !== undefined && this.itemData?.modes !== null && this.itemData?.modes.length > 0;
  }

  protected hasRoute() {
    return this.itemData?.itemUrl !== undefined && this.itemData?.itemUrl !== null && this.itemData?.itemUrl.length > 0;
  }

  getModePrices(): string {
    if(this.itemData?.modes) {
      return this.itemData.modes.map(mode => `${mode.modeKey}: ${mode.minPrice} - ${mode.maxPrice}`).join(', ');
    }
    return '';
  }

  getSetupRequirements(): string {
    let requirements = 'Fehlt: \n';

    if(!this.hasEnglishTranslation())
      requirements += 'Englische Namen Übersetzung, ';

    if(!this.hasGermanTranslation())
      requirements += 'Deutsche Namen Übersetzung, ';

    if (!this.itemData?.imageUrl || this.itemData?.imageUrl.length === 0)
      requirements += '(Bild Path)';

    return requirements;
  }

  private isActive(bool: boolean):string {
    return bool ? '✓' : '✖';
  }

  protected hasGermanTranslation() {
    return this.itemData?.translation.some(t => t.language === Languages.German) || false;
  }

  protected hasEnglishTranslation() {
    return this.itemData?.translation.some(t => t.language === Languages.English) || false;
  }


  protected readonly TranslationEditorComponent = TranslationEditorComponent;
  protected readonly Languages = Languages;
  protected readonly Object = Object;
  protected readonly ItemComponent = AdminItemDataComponent;
}
