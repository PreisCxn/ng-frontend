import {UserAuth} from "../types/user.types";

export interface IUserCommunication {

  isAdmin(token: string): Promise<boolean>;

  login(username: string, password: string): Promise<UserAuth>;

}
