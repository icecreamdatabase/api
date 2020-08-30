"use strict"
import {Kraken} from "./Kraken"
import {IKrakenChannel, IKrakenError, IKrakenUsersChat} from "./IKraken"


export class TwitchApiFunctionality {
  public static async isModInChannel (roomId: number | string, userId: number | string): Promise<boolean> {
    let userData: IKrakenUsersChat | IKrakenError = await Kraken.userInChannelInfo(roomId, userId)
    if (!(userData as IKrakenError).error) {
      userData = userData as IKrakenUsersChat
      return userData.Badges.some(value => ["broadcaster", "moderator"].includes(value.id))
    } else {
      return false
    }
  }

  public static async getSignupInfo (roomId: number | string): Promise<{ id: number | string; login: string; type: "" | "affiliate" | "partner" } | undefined> {
    let channelData: IKrakenChannel | IKrakenError = await Kraken.channelInfo(roomId)
    if (!(channelData as IKrakenError).error) {
      channelData = channelData as IKrakenChannel
      return {id: roomId, login: channelData.name, type: channelData.broadcaster_type}
    } else {
      return undefined
    }
  }


}

