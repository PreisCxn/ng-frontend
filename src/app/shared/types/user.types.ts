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

export type OnlinePlayers = {
  onlinePlayers: number;
}

export type ActivePlayers = {
  activePlayers: number;
}

export type TotalUser = {
  totalUser: number;
}
