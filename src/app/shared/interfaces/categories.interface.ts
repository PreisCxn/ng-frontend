import {Category, CategoryCreation, CategoryEntry} from "../types/categories.types";
import {Languages} from "../languages";

export interface ICategoryCommunication {

  /**
   * Fragt alle Kategorien vom Backend ab mit Translation Daten in der angegebenen Sprache
   * @param language
   */
  getCategoriesUsingLang(language: Languages): Promise<CategoryEntry[]>;

  /**
   * Fragt alle Kategorien vom Backend ab mit allen Translation Daten
   */
  getCategoryData(): Promise<Category[]>;

  /**
   * Fügt eine neue Kategorie hinzu
   * @param category - Kategorie die hinzugefügt werden soll
   */
  createCategory(category: CategoryCreation): Promise<Category>;

  /**
   * Updated eine Kategorie
   * @param category - Kategorie die bearbeitet werden soll
   */
  updateCategory(category: Category): Promise<Category>;

  /**
   * Löscht eine Kategorie
   */
  deleteCategory(category: Category): Promise<boolean>;

}
