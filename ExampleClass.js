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
   */
  handle(req, res, path, query) {
    switch (path[0]) {
      case 'xxxxx':
        this.xxxxx.handle(req, res, path.slice(1), query)
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
    return "XXXXXXXXXXXXXXXXXXXXXXX"
  }

}

module.exports = ExampleClass

