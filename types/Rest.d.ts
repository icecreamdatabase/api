interface IAccessTokenData {
  client_id: string,
  login: string,
  scopes: string[],
  user_id: string,
  expires_in: number
}

declare namespace Express {
  export interface Request {
    oAuthData?: IAccessTokenData // Maybe remove the nullable? It's set int the first ever app.use
    oAuthLevelV1Channel: number
  }
}
