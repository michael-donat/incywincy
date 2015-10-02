var express = require('express');
var app = express();

var hits = []
var mockPort;

var pageLoc = function(page) {
  return __dirname + '/pages/'+page+'.html'
}

app.use(function(req, res,next) {
  hits.push(req.originalUrl)
  next()
})

app.get('/wait', function() {
  //will cause socket to hang
})

app.get('/:page', function (req, res) {
  res.sendFile(pageLoc(req.params.page), function(err) {
    res.send()
  })
});

module.exports.init = function(port, callback) {
  mockPort = port;
  app.listen(mockPort,callback)
}

module.exports.hit = function(path) {
  return hits.indexOf(path) >= 0
}

module.exports.reset = function() {
  hits = [];
}

module.exports.url = function(path) {
  return 'http://localhost:'+mockPort+path
}
