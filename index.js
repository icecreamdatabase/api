const http = require('http')

http.createServer((req, res) => {
  res.write('xD')
  res.end()
}).listen(4701)
