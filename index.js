'use strict'
const http = require('http')
const util = require('util')
const url = require('url')

const ChannelPoints = require('./channelpoints/ChannelPoints')
const BasicBucket = require('./BasicBucket')

const PORT = 4710
const RATELIMIT_GLOBAL = 20
const RATELIMIT_RETRY_AFTER = 2

class Index {
  constructor() {
    this.server = http.createServer(this.onMessage.bind(this))
    this.server.listen(PORT)
    this.channelPoints = new ChannelPoints()
    this.bucketGlobalRatelimit = new BasicBucket(RATELIMIT_GLOBAL)
    console.log(`Running on port ${PORT}...`)
  }

  /**
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  async onMessage(req, res) {
    let data

    res.setHeader("RateLimit-Limit", `${this.bucketGlobalRatelimit.limit} ${this.bucketGlobalRatelimit.limit};window=${this.bucketGlobalRatelimit.returnTimeoutS}`)
    res.setHeader("RateLimit-Remaining", this.bucketGlobalRatelimit.ticketsRemaining)
    if (!this.bucketGlobalRatelimit.takeTicket()) {
      // Global RateLimit exceeded
      res.statusCode = 429
      res.setHeader("Retry-After", RATELIMIT_RETRY_AFTER)
      data = "Global Ratelimit exceeded"
    } else {

      switch (req.method) {
        case "GET":
          res.setHeader("Content-Type", "application/json")

          let p = url.parse(req.url, true)
          let query = p.query
          let path = p.pathname.substr(1).toLowerCase().split('/')
          path.push('') // make sure both example.com/xd and example.com/xd/ have an empty element in the array at the end
          //let ip = req.connection.remoteAddress


          switch (path[0]) {
            case 'channelpoints':
              data = await this.channelPoints.handle(req, res, path.slice(1), query)
              break
            case '':
              data = this.getDefaultResponse()
              break
            default:
              res.statusCode = 404
          }

          break
        case "HEAD":
          break
        default:
          res.statusCode = 405 //Method not allowed
          break
      }
    }

    res.write(JSON.stringify({statusCode: res.statusCode, data: data}, null, 2))
    console.log(`${req.connection.remoteAddress} - - [${new Date().toISOString()}] ${req.method} ${req.url} HTTP/${req.httpVersion} ${res.statusCode} ${res.socket.bytesWritten}`)
    res.end()
  }

  /**
   * @return {string}
   */
  getDefaultResponse() {
    return "xD"
  }

}

new Index()
