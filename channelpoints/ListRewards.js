'use strict'
const util = require('util')

class ListRewards {
  constructor() {
  }

  /**
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {string[]} path
   * @param {Object.<string, string>} query
   */
  handle(req, res, path, query) {
    res.write(`channelpoints list ${query.id} ${query.login}`)
  }

}

module.exports = ListRewards

