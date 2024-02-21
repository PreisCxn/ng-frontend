import {UserAuth} from "../types/user.types";

export interface IUserCommunication {

  /**
   * Prüft ob der Benutzer ein Admin ist
   *
   * - get: /web/auth/isAdmin
   *
   */
  isAdmin(): Promise<boolean>;

  /**
   * Loggt den Benutzer ein
   *
   * - post: /web/auth/login
   */
  login(username: string, password: string): Promise<UserAuth>;

}
