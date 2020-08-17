"use strict"
import Axios, {AxiosResponse} from "axios"
import util from "util"

import {Logger} from "../helper/Logger"
import {IApiResponse} from "./Rest"
import {HttpException} from "../helper/HttpException"
import {NextFunction, Request, Response} from "express"

interface IValidateReturn {
  authResponse: AuthResponses,
  accessTokenData?: IAccessTokenData,
  lastValidated: Date
}

enum AuthResponses {
  "validAuth",
  "badClientId",
  "invalidAccessToken"
}

export class Authentication {
  private static readonly _accessTokenCacheTimeMs = 30 * 60 * 1000 // 30 min
  private static readonly _mapClearInterval = 60 * 1000 // 1 min
  private static readonly _clientId = "fy2ntph9sdyeb73p5mdf7o5h4hs5j8"
  private static readonly _authMap: Map<string, IValidateReturn> = new Map<string, IValidateReturn>()
  // noinspection JSUnusedLocalSymbols
  private static readonly _clearAuthMapIntervalId: NodeJS.Timeout = setInterval(Authentication.clearMap, Authentication._mapClearInterval)

  private constructor () {
  }

  private static clearMap () {
    const now = Date.now()
    for (const entry of Authentication._authMap) {
      if (entry[1].lastValidated.getTime() + Authentication._accessTokenCacheTimeMs < now) {
        Authentication._authMap.delete(entry[0])
      }
    }
  }

  public static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      //TODO: Use res.locals instead of extending the Request object? 🤔
      req.oAuthData = await Authentication.check(req, res)
      next()
    } catch (e) {
      next(e)
    }
  }

  private static async check (req: Request, res: Response): Promise<IAccessTokenData> {
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
        throw new HttpException(401, "Bad _clientId. OAuth token is associated with a different application.")
    }
  }

  private static async checkMap (accessToken: string): Promise<IValidateReturn> {
    accessToken = accessToken.startsWith("OAuth ") ? accessToken : `OAuth ${accessToken}`

    let authData = this._authMap.get(accessToken)
    if (!authData) {
      authData = await this.validate(accessToken)
      this._authMap.set(accessToken, authData)
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
      if (result.data.client_id === this._clientId) {

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
          'client_id': this._clientId,
          'token': accessToken
        }
      })
      Logger.debug(`Token revoked`)
    } catch (e) {
      Logger.warn(`Token revoke errored: \n${e.response}`)
    }
  }
}

