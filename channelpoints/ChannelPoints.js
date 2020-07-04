'use strict'
const util = require('util')

const ListRewards = require('./ListRewards')

class ChannelPoints {
  constructor() {
    this.listRewards = new ListRewards()
  }

  /**
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {string[]} path
   * @param {Object.<string, string>} query
   */
  handle(req, res, path, query) {
    switch (path[0]) {
      case 'listrewards':
        this.listRewards.handle(req, res, path.slice(1), query)
        break
      case '':
        res.write(this.getDefaultResponse())
        break
      default:
        res.statusCode = 404
    }
  }

  /**
   * @return {string}
   */
  getDefaultResponse() {
    return "channelpoints"
  }

}

module.exports = ChannelPoints

