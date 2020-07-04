'use strict'
const util = require('util')
// noinspection JSFileReferences
const XXXXX = require('./XXXXXX')

class ExampleClass {
  constructor() {
    this.xxxxx = new XXXXX()
  }

  /**
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {string[]} path
   * @param {Object.<string, string>} query
   * @return {any}
   */
  handle(req, res, path, query) {
    let data
    switch (path[0]) {
      case 'xxxxx':
        data = this.xxxxx.handle(req, res, path.slice(1), query)
        break
      case '':
        data = this.getDefaultResponse()
        break
      default:
        res.statusCode = 404
    }
    return data
  }

  /**
   * @return {string}
   */
  getDefaultResponse() {
    return "XXXXXXXXXXXXXXXXXXXXXXX"
  }

}

module.exports = ExampleClass

