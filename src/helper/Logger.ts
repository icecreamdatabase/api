/* eslint-disable no-console */
"use strict"

import {Request, Response} from "express"
import util from 'util'

export class Logger {
  public static error (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.error(`${this.getTimestamp()} ${message}`)
  }

  public static warn (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.warn(`${this.getTimestamp()} ${message}`)
  }

  public static info (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.info(`${this.getTimestamp()} ${message}`)
  }

  public static log (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.log(`${this.getTimestamp()} ${message}`)
  }

  public static debug (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.debug(`${this.getTimestamp()} ${message}`)
  }

  public static trace (message: unknown, utilInspect: boolean = false): void {
    if (utilInspect) {
      message = util.inspect(message)
    }
    console.trace(`${this.getTimestamp()} ${message}`)
  }

  private static getTimestamp (): string {
    return `[${new Date().toLocaleTimeString("de-DE", {hour12: false})}]`
  }

  public static http (req: Request, res: Response): void {
    console.log(`${req.connection.remoteAddress} - - [${new Date().toISOString()}] ${req.method} ${req.url} HTTP/${req.httpVersion} ${res.statusCode} ${res.socket?.bytesWritten}`)
  }
}
