"use strict"

class BasicBucket {
  /**
   * @param {number} limit
   */
  constructor(limit = 20) {
    this.usedTickets = 0
    this._limit = limit
  }

  get returnTimeoutS() {
    return 30
  }

  get returnTimeoutMs() {
    return this.returnTimeoutS * 1000
  }

  /**
   * Get limit of the current bucket
   * @returns {number}
   */
  get limit() {
    return this._limit
  }

  /**
   * Get remaining tickets of the current bucket
   * @returns {number}
   */
  get ticketsRemaining() {
    return this.limit - this.usedTickets
  }

  /**
   * Take a ticket and start the returnTicket timeout
   * @returns {boolean} Was ticket taken
   */
  takeTicket() {
    if (this.usedTickets < this.limit) {
      this.usedTickets++
      setTimeout(returnTicket.bind(this), this.returnTimeoutMs)
      return true
    } else {
      return false
    }
  }
}

/**
 * Returns one used ticket and therefor reduces the usedTickets amount by one.
 * don't forget to bind this. E.g.: `returnTicket.bind(this)`
 */
function returnTicket() {
  if (this.usedTickets > 0) {
    this.usedTickets--
  } else {
    console.error("Ticket returned when there where none given out!")
  }
}

module.exports = BasicBucket
