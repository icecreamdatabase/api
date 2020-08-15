/* eslint-disable no-console */
"use strict"

import {Request, Response} from "express"

export class Logger {
  public static error (message: unknown): void {
    console.error(`${this.getTimestamp()} ${message}`)
  }

  public static warn (message: unknown): void {
    console.warn(`${this.getTimestamp()} ${message}`)
  }

  public static info (message: unknown): void {
    console.info(`${this.getTimestamp()} ${message}`)
  }

  public static log (message: unknown): void {
    console.log(`${this.getTimestamp()} ${message}`)
  }

  public static debug (message: unknown): void {
    console.debug(`${this.getTimestamp()} ${message}`)
  }

  public static trace (message: unknown): void {
    console.trace(`${this.getTimestamp()} ${message}`)
  }

  private static getTimestamp (): string {
    return `[${new Date().toLocaleTimeString("de-DE", {hour12: false})}]`
  }

  public static http (req: Request, res: Response):void {
    console.log(`${req.connection.remoteAddress} - - [${new Date().toISOString()}] ${req.method} ${req.url} HTTP/${req.httpVersion} ${res.statusCode} ${res.socket.bytesWritten}`)
  }
}
