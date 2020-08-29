"use strict"
import {Sql} from "../Sql"
import {FieldPacket, RowDataPacket} from "mysql2"

export interface ISqlChannel {
  roomId: number,
  channelName: string,
  isTwitchPartner: boolean,
  maxMessageLength: number,
  minCooldown: number,
  timeoutCheckTime: number,
  ircMuted: boolean,
  isQueueMessages: boolean,
  volume: number,
  allModsAreEditors: boolean
}

export type SqlChannelUpdateParameter =
  "isTwitchPartner"
  | "maxMessageLength"
  | "minCooldown"
  | "timeoutCheckTime"
  | "ircMuted"
  | "isQueueMessages"
  | "volume"
  | "allModsAreEditors"

export class SqlChannels {
  static async get (roomId: number | string): Promise<ISqlChannel | undefined> {
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await Sql.execute(`
        SELECT roomId,
               channelName,
               isTwitchPartner,
               maxMessageLength,
               minCooldown,
               timeoutCheckTime,
               ircMuted,
               isQueueMessages,
               volume,
               allModsAreEditors
        FROM channels
        WHERE enabled = b'1'
          AND roomId = ?;`, [roomId])

    if (rows.length > 0) {
      return <ISqlChannel>rows[0]
    }
    return undefined
  }

  static async addChannel (roomId: number | string, channelName: string, isTwitchPartner: boolean): Promise<void> {
    await Sql.execute(`INSERT INTO channels (roomId, channelName, enabled, isTwitchPartner)
                       VALUES (?, ?, true, ?)
                       ON DUPLICATE KEY UPDATE channelName     = VALUES(channelName),
                                               enabled         = VALUES(enabled),
                                               isTwitchPartner = VALUES(isTwitchPartner)
    `, [roomId, channelName, isTwitchPartner])
  }

  static async disableChannel (roomId: number | string): Promise<void> {
    await Sql.execute(`UPDATE IGNORE channels
                       SET enabled = b'0'
                       WHERE roomId = ?; `, [roomId])
  }


  static async updateSetting (roomId: number, key: SqlChannelUpdateParameter, value: string | number | boolean): Promise<void> {
    await Sql.execute(`UPDATE channels 
                       SET ${await Sql.escapeId(key)} = ?  
                       WHERE roomId = ?; `, [value, roomId]) // Can this be handled without escapeId? some way to find ?? usage
  }
}

