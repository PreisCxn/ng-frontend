export type UserShortInfo = {
  name: string,
  userId?: string,
}

export type UserExtendedInfo = UserShortInfo & {

}

export type UserInfo = UserShortInfo | UserExtendedInfo;

export type UserAuth = {
  access: boolean,
  token: string,
}
