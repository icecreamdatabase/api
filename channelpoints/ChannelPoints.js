'use strict'
const util = require('util')

const ListRewards = require('./ListRewards')
const GetQueue = require('./GetQueue')
const UpdateRedemptionStatuses = require('./UpdateRedemptionStatuses')

class ChannelPoints {
  constructor() {
    this.listRewards = new ListRewards()
    this.getQueue = new GetQueue()
    this.updateRedemptionStatuses = new UpdateRedemptionStatuses()
  }

  /**
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {string[]} path
   * @param {Object.<string, string>} query
   * @return {any}
   */
  async handle(req, res, path, query) {
    let data
    switch (path[0]) {
      case 'listrewards':
        data = await this.listRewards.handle(req, res, path.slice(1), query)
        break
      case 'getqueue':
        data = await this.getQueue.handle(req, res, path.slice(1), query)
        break
      case 'updateredemptionstatuses':
        data = await this.updateRedemptionStatuses.handle(req, res, path.slice(1), query)
        break
      case '':
        data = this.getDefaultResponse()
        break
      default:
        res.statusCode = 404
    }
    return data
  }

  getDefaultResponse() {
    return {
      "availableEndpoints": ["listrewards", "getqueue", "updateredemptionstatuses"]
    }
  }

}

module.exports = ChannelPoints

