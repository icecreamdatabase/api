'use strict'
const http = require('http')
const util = require('util')
const url = require('url')

const ChannelPoints = require('./channelpoints/ChannelPoints')

const PORT = 4701

class Index {
  constructor() {
    this.server = http.createServer(this.onMessage.bind(this))
    this.server.listen(PORT)
    this.channelPoints = new ChannelPoints()
  }

  /**
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  onMessage(req, res) {
    switch (req.method) {
      case "GET":
        res.setHeader('Content-Type', 'text/plain')

        let p = url.parse(req.url, true)
        let query = p.query
        let path = p.pathname.substr(1).toLowerCase().split('/')
        path.push('') // make sure both example.com/xd and example.com/xd/ have an empty element in the array at the end
        let ip = req.connection.remoteAddress

        console.log("Query:   " + util.inspect(query))
        console.log("Path:    " + util.inspect(path))
        console.log("Ip:      " + ip)
        console.log("----------------")

        switch (path[0]) {
          case 'channelpoints':
            this.channelPoints.handle(req, res, path.slice(1), query)
            break
          case '':
            res.write(this.getDefaultResponse())
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
