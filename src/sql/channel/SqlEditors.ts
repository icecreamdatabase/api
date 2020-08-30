"use strict"
import {Sql} from "../Sql"
import {FieldPacket, RowDataPacket} from "mysql2"

export class SqlEditors {
  static async getList (roomId: number | string): Promise<number[]> {
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await Sql.execute(`
        SELECT userId
        FROM editors
        WHERE roomId = ?;`, [roomId])

    return rows.map(value => value.roomId)
  }

  static async addEditor (roomId: number | string, userId: number | string): Promise<void> {
    await Sql.execute(`INSERT IGNORE INTO editors (roomId, userId)
                       VALUES (?, ?)
    `, [roomId, userId])
  }

  static async removeEditor (roomId: number | string): Promise<void> {
    await Sql.execute(`UPDATE IGNORE channels
                       SET enabled = b'0'
                       WHERE roomId = ?; `, [roomId])
  }

  static async isEditor (roomId: number | string, userId: number | string): Promise<boolean> {
    const [rows, fields] = await Sql.execute(`SELECT 1
                                              FROM editors
                                              WHERE roomId = ?
                                                AND userId = ?
                                              LIMIT 1;`, [roomId, userId])
    return rows.length !== 0
  }
}

