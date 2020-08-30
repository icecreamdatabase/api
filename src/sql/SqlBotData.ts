"use strict"
import {Sql} from "./Sql"
import {FieldPacket, RowDataPacket} from "mysql2"

export class SqlBotData {
  private static _clientId?: string
  private static _clientSecret?: string

  static async getClientId (): Promise<string> {
    if (!this._clientId) {
      this._clientId = await this.get('clientId')
    }
    return this._clientId
  }

  static async getClientSecret (): Promise<string> {
    if (!this._clientSecret) {
      this._clientSecret = await this.get('clientSecret')
    }
    return this._clientSecret
  }

  private static async get (key: string): Promise<string> {
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await Sql.execute(`
        SELECT \`value\`
        FROM botData
        WHERE \`key\` LIKE ?;`, [key])

    if (rows.length > 0) {
      return rows[0].value
    }
    throw new Error(`No ${key} defined in Database!`)
  }
}
