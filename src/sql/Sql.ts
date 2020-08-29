"use strict"

import Mysql from "mysql2/promise"
import * as config from "../config.json"
import {FieldPacket, RowDataPacket} from "mysql2"

export class Sql {
  private static _pool: Mysql.Pool = Mysql.createPool({typeCast: Sql.castField, ...config.mysqloptions})

  public static async execute (sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[], FieldPacket[]]> {
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await Sql._pool.execute<RowDataPacket[]>(sql, values)
    this.bufferToBoolean(rows)
    return [rows, fields]
  }

  /**
   * @deprecated Use prepared with execute with prepared statements instead.
   */
  public static async query (sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[], FieldPacket[]]> {
    return this._pool.query(sql, values)
  }

  public static async escapeId (value: any): Promise<string> {
    return (await this._pool.getConnection()).escapeId(value)
  }

  //cast bit(1) to boolean
  //https://www.bennadel.com/blog/3188-casting-bit-fields-to-booleans-using-the-node-js-mysql-driver.htm
  private static castField (field: any, useDefaultTypeCasting: () => any): null | boolean {
    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if ((field.type === "BIT") && (field.length === 1)) {
      const bytes = field.buffer()
      //Account for the (hopefully rare) case in which a BIT(1) field would be NULL
      if (bytes === null) {
        return null
      }
      // A Buffer in Node represents a collection of 8-bit unsigned integers.
      // Therefore, our single "bit field" comes back as the bits '0000 0001',
      // which is equivalent to the number 1.
      return (bytes[0] === 1)
    }
    return (useDefaultTypeCasting())
  }

  private static bufferToBoolean (rows: RowDataPacket[]): void {
    for (const rowKey in rows) {
      for (const columnKey in rows[rowKey]) {
        if (Object.prototype.hasOwnProperty.call(rows[rowKey], columnKey)) {
          if (Buffer.isBuffer(rows[rowKey][columnKey])) {
            if ((rows[rowKey][columnKey] as Buffer).length === 1) {
              rows[rowKey][columnKey] = Boolean(rows[rowKey][columnKey])
            }
          }
        }
      }
    }
  }
}
