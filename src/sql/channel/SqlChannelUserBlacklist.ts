"use strict"
import {Sql} from "../Sql"
import {FieldPacket, RowDataPacket} from "mysql2"

export class SqlChannelUserBlacklist {
  /**
   * Get a list of blacklisted userIDs
   */
  static async getUserIds (roomId: number): Promise<number[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await Sql.execute(`
        SELECT userId
        FROM channelUserBlacklist
        WHERE roomId = ?;`, [roomId])

    return rows.map(x => x["userId"])
  }

  /**
   * Add userID to blacklist.
   */
  static async addUserId (roomId: number | string, userId: number | string): Promise<void> {
    await Sql.execute(` INSERT IGNORE INTO channelUserBlacklist (roomId, userId)
                VALUES (?, ?);`, [roomId, userId])
  }
}
