"use strict"

import {Logger} from "../helper/Logger"

export class BasicBucket {
  private usedTickets: number
  private readonly _limit: number
  private readonly _returnTimeoutS: number

  constructor (limit: number = 20, returnTimeoutS: number = 30) {
    this.usedTickets = 0
    this._limit = limit
    this._returnTimeoutS = returnTimeoutS
  }

  public get returnTimeoutS (): number {
    return this._returnTimeoutS
  }

  public get returnTimeoutMs (): number {
    return this.returnTimeoutS * 1000
  }

  /**
   * Get limit of the current bucket
   */
  public get limit (): number {
    return this._limit
  }

  /**
   * Get remaining tickets of the current bucket
   */
  public get ticketsRemaining (): number {
    return this.limit - this.usedTickets
  }

  /**
   * Take a ticket and start the returnTicket timeout
   * @return Was ticket taken
   */
  public takeTicket (): boolean {
    if (this.usedTickets < this.limit) {
      this.usedTickets++
      setTimeout(this.returnTicket.bind(this), this.returnTimeoutMs)
      return true
    } else {
      return false
    }
  }

  /**
   * Returns one used ticket and therefore reduces the usedTickets amount by one.
   */
  private returnTicket () {
    if (this.usedTickets > 0) {
      this.usedTickets--
    } else {
      Logger.error("Ticket returned when there where none given out!")
    }
  }
}

