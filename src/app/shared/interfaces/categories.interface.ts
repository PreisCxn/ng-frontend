import {Category, CategoryCreation, CategoryEntry} from "../types/categories.types";
import {Languages} from "../languages";

export interface ICategoryCommunication {

  /**
   * Fragt alle Kategorien vom Backend ab mit Translation Daten in der angegebenen Sprache
   * @param language
   *
   * - get: /web/categories/entries
   *
   */
  getCategoriesUsingLang(language: Languages): Promise<CategoryEntry[]>;

  /**
   * Fragt alle Kategorien vom Backend ab mit allen Translation Daten
   *
   * - get: /web/categories
   *
   */
  getCategoryData(): Promise<Category[]>;

  /**
   * Fügt eine neue Kategorie hinzu
   * @param category - Kategorie die hinzugefügt werden soll
   *
   * - post: /web/categories
   *
   */
  createCategory(category: CategoryCreation): Promise<Category>;

  /**
   * Updated eine Kategorie
   * @param category - Kategorie die bearbeitet werden soll
   *
   * - put: /web/categories/:id
   *
   */
  updateCategory(category: Category): Promise<Category>;

  /**
   * Löscht eine Kategorie
   *
   * - delete: /web/categories/:id
   *
   */
  deleteCategory(category: Category): Promise<boolean>;

}
