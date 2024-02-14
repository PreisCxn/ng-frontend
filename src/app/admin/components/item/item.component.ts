import {Component} from '@angular/core';
import {TranslationEditorComponent} from "../editors/translation-editor/translation-editor.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoryEntry} from "../../../shared/pcxn.types";
import {Languages} from "../../../shared/languages";
import {AdminService} from "../../shared/admin.service";
import {IMultiSelectOption, IMultiSelectSettings, NgxBootstrapMultiselectModule} from "ngx-bootstrap-multiselect";
import {TranslationService} from "../../../shared/translation.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslationEditorComponent,
    NgClass,
    FormsModule,
    NgxBootstrapMultiselectModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  category: CategoryEntry[] = [];
  itemForm: any;
  submitted = false;
  categories: CategoryEntry[] = []

  protected readonly ITEM_IMG_DIR = 'assets/img/items/';

  constructor(private fb: FormBuilder, private admin: AdminService) {
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
      this.myOptions = categories.map((entry) => {
        if ('translation' in entry.translationData) {
          return { id: entry.pcxnId, name: entry.translationData.translation };
        } else {
          // Behandlung für den Fall, dass translationData eine translatableKey-Eigenschaft hat
          // Sie können hier eine geeignete Logik hinzufügen
          return { id: entry.pcxnId, name: '' };
        }
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

  /*
export interface ItemInfoSettings {
  imageUrl: string,
  translation: Translation[],
  categoryIds: number[],
  retention: ItemRetention,
  animationData?: ItemAnimationData[],
  description: ItemDescription,
  sellingUser: string[],
  buyingUser: string[],
}

   */

  isDirty() {
    return this.itemForm.dirty;
  }

  protected getImgUrl(img: string): string {

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

  protected readonly TranslationEditorComponent = TranslationEditorComponent;
  protected readonly Languages = Languages;
  protected readonly Object = Object;
  protected readonly ItemComponent = ItemComponent;
}
