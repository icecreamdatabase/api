"use strict"
import Axios, {AxiosRequestConfig, Method} from "axios"

import {IKrakenChannel, IKrakenError, IKrakenUsersChatChannel} from "./IKraken"
import {Logger} from "../../helper/Logger"
import {SqlBotData} from "../../sql/SqlBotData"

export class Kraken {

  private static async request<T> (pathAppend: string, accessToken?: string, method: Method = 'GET'): Promise<T/* | IKrakenError*/> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `https://api.twitch.tv/kraken/${pathAppend}`,
        method: method,
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': await SqlBotData.getClientId()
        }
      }
      if (accessToken) {
        axiosConfig.headers.Authorization = `OAuth ${accessToken}`
      }
      const result = await Axios(axiosConfig)
      return result.data
    } catch (e) {
      Logger.warn(e)
      //throw new Error(e)
      return e.response.data
    }
  }

  /**
   * Accesses kraken/users/userID/chat/channels/roomID
   */
  public static async userInChannelInfo (roomId: number | string, userId: number | string): Promise<IKrakenUsersChatChannel | IKrakenError> {
    return await this.request(`users/${userId}/chat/channels/${roomId}`)
  }

  /**
   * Accesses kraken/channels/roomId
   */
  public static async channelInfo (roomId: number | string): Promise<IKrakenChannel | IKrakenError> {
    return await this.request('channels/' + roomId)
  }
}

