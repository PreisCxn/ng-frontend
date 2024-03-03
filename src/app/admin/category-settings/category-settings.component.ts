import {Component, OnInit} from '@angular/core';
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../shared/admin-notify.service";
import {TranslationEditorComponent} from "../components/editors/translation-editor/translation-editor.component";
import {Translation} from "../../shared/types/translation.types";
import {AdminService} from "../shared/admin.service";

@Component({
  selector: 'app-category-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass,
    TranslationEditorComponent
  ],
  templateUrl: './category-settings.component.html',
  styleUrl: './category-settings.component.scss'
})
export class CategorySettingsComponent implements OnInit {

  categoriesForm: FormGroup;
  submitted = false;
  dirty = false;

  constructor(private fb: FormBuilder, private nav: AdminNavService, private notify: AdminNotifyService, private admin: AdminService) {
    this.categoriesForm = this.fb.group({
      categories: this.fb.array([]) // Initialisiert ohne Einträge
    });
    this.refreshForm();
  }

  ngOnInit(): void {
    this.nav.setActiveSubsite(AdminSubsites.CATEGORY_SETTINGS);
  }

  get categories() {
    return this.categoriesForm.get('categories') as FormArray;
  }

  addCategory() {
    this.categories.push(this.fb.group({
      pcxnId: -9,
      translations: this.fb.array([]), // Initialisiert als leeres Array
      inNav: [false],
      isEditing: [false] // Hinzufügen der isEditing-Eigenschaft
    }));

    this.dirty = true;
  }

  removeCategory(index: number) {
    const categoryGroup = this.categories.at(index) as FormGroup;
    const category = categoryGroup.value;
    if(category.pcxnId === -9) {
      this.categories.removeAt(index);
      return;
    }
    this.admin.deleteCategory(category.category).then(() => {
      this.notify.notify(AlertType.SUCCESS, 'Category deleted');
      this.refreshForm();
    }).catch(e => {
      this.notify.notify(AlertType.DANGER, e);
      this.refreshForm();
    });
  }

  saveCategory(index: number) {
    // Get the category form group
    const category = this.categories.at(index);

    // Get the translation form group
    const translation = category.get('translations');

    // Save the translation
    if (translation) {
      const translationValue = translation.value;

      if (!TranslationEditorComponent.isValid(translationValue, 'all')) {
        this.notify.notify(AlertType.DANGER, 'Translations are not valid - minLang: all');

        throw new Error('Invalid translations');
      }


      // Here you would typically save the changes, for example by sending a request to a backend service.
      // Since this is not specified in the question, we'll just log the translation value for now.
    } else {
      throw new Error('No translations found');
    }

    // Set isEditing to false to collapse the category
    category.get('isEditing')?.setValue(false);
  }

  onSubmit() {

    for (let i = 0; i < this.categories.length; i++) {
      try {
        this.saveCategory(i);
      } catch (e) {
        this.notify.notify(AlertType.DANGER, e + ' - Category:' + i);
        return;
      }
    }
    this.submitted = true;
    this.dirty = false;

    this.categoriesForm.markAsPristine();
    console.log(this.categoriesForm.value);
    this.notify.notify(AlertType.SUCCESS, 'Saved changes');
  }

  addTranslation(categoryIndex: number, translation: Translation[]) {
    const category = this.categories.at(categoryIndex);
    const translations = category.get('translations') as FormArray;
    translations.clear();
    translation.forEach(t => {
      translations.push(this.fb.group(t));
    });
  }

  private refreshForm() {
    this.admin.getCategoriesSettings().then(categories => {
      this.categories.clear();
      console.log(categories)
      categories.forEach(category => {
        this.categories.push(this.fb.group({
          pcxnId: [category.pcxnId],
          category: [category],
          translations: this.fb.array(category.translationData),
          inNav: [category.inNav],
          isEditing: [false]
        }));
      });
    });
  }

  isDirty() {
    return this.categoriesForm.dirty || this.dirty;
  }

  protected readonly TranslationEditorComponent = TranslationEditorComponent;
}
