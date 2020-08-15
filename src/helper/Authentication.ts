"use strict"
import Axios, {AxiosResponse} from "axios"
import util from "util"

import {Logger} from "./Logger"
import {IApiResponse} from "../Rest/Rest"
import {IncomingMessage, ServerResponse} from "http"
import {HttpException} from "./HttpException"

export interface IAccessTokenData {
  client_id: string,
  login: string,
  scopes: string[],
  user_id: string,
  expires_in: number
}

interface IValidateReturn {
  authResponse: AuthResponses,
  accessTokenData?: IAccessTokenData,
  lastValidated: Date
}

export interface ICheckReturn {
  data: IApiResponse,
  accessTokenData?: IAccessTokenData
}

enum AuthResponses {
  "validAuth",
  "badClientId",
  "invalidAccessToken"
}

export class Authentication {
  private static readonly accessTokenCacheTimeMs = 30 * 60 * 1000 // 30 min
  private static readonly clientId = "fy2ntph9sdyeb73p5mdf7o5h4hs5j8"
  private static readonly authMap: Map<string, IValidateReturn> = new Map<string, IValidateReturn>()

  private constructor () {
  }

  public static async check (req: IncomingMessage, res: ServerResponse): Promise<IAccessTokenData> {
    if (!req.headers.authorization) {
      throw new HttpException(401, "Authorization is requried")
    }

    const auth: IValidateReturn = await Authentication.checkMap(req.headers.authorization)
    switch (auth.authResponse) {
      case AuthResponses.validAuth:
        if (auth.accessTokenData) {
          return auth.accessTokenData
        } else {
          throw new HttpException(500, "Authorization was successful but no accessTokenData exists.")
        }
      case AuthResponses.invalidAccessToken:
        throw new HttpException(401, "Invalid access_token")
      case AuthResponses.badClientId:
        throw new HttpException(401, "Bad clientId. OAuth token is associated with a different application.")
    }
  }


  private static async checkMap (accessToken: string): Promise<IValidateReturn> {
    accessToken = accessToken.startsWith("OAuth ") ? accessToken : `OAuth ${accessToken}`

    let authData = this.authMap.get(accessToken)
    if (!authData || authData.lastValidated.getTime() + this.accessTokenCacheTimeMs < Date.now()) {
      authData = await this.validate(accessToken)
      this.authMap.set(accessToken, authData)
    }
    return authData
  }

  private static async validate (accessToken: string): Promise<IValidateReturn> {
    try {
      const result: AxiosResponse<IAccessTokenData> = await Axios({
        method: 'get',
        url: 'https://id.twitch.tv/oauth2/validate',
        headers: {
          'Authorization': accessToken
        }
      })
      if (result.data.client_id === this.clientId) {

        //Logger.debug(`^^^ Valid token: ${util.inspect(result.data)}`)
        return {authResponse: AuthResponses.validAuth, accessTokenData: result.data, lastValidated: new Date()}
      } else {
        return {authResponse: AuthResponses.badClientId, lastValidated: new Date()}
      }
    } catch (e) {
      if (Object.prototype.hasOwnProperty.call(e, "response") && e.response) {
        const result = <IApiResponse>e.response
        //if unauthorized (expired or wrong token) also this.refresh()
        if (result.status === 401) {
          Logger.debug(`^^^ Invalid token: ${util.inspect(result)}`)
        } else {
          Logger.debug(`^^^ Error token: ${util.inspect(result)}`)
        }
      } else {
        Logger.error(`^^^ Error general: ${util.inspect(e)}`)
      }
    }
    return {authResponse: AuthResponses.invalidAccessToken, lastValidated: new Date()}
  }

  private static async revoke (accessToken: string): Promise<void> {
    try {
      await Axios({
        method: 'post',
        url: 'https://id.twitch.tv/oauth2/revoke',
        params: {
          'client_id': this.clientId,
          'token': accessToken
        }
      })
      Logger.debug(`Token revoked`)
    } catch (e) {
      Logger.warn(`Token revoke errored: \n${e.response}`)
    }
  }
}

