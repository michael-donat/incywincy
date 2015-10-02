var async = require('async')
var request = require('request')
var cheerio = require('cheerio')
var nurl = require('url')

var Store = function() {
  var origin = [];
  var external = [];
  var assets = [];
  var all = [];
  return {
    save: function(url, isAsset) {
      if (!url.permitted()) return;
      all.push(url.toString())
      if (isAsset) {
        assets.push(url.toString())
        return
      }
      if (url.local()) {
        origin.push(url.toString())
        return
      }
      external.push(url.toString())
    },
    seen: function(url) {
      return all.indexOf(url.toString()) >= 0;
    },
    store: {
      origin: origin,
      external: external,
      assets: assets,
      all: all
    }
  }
}

var UrlHelper = function(origin, permittedSchemas) {

  return function(url, context, keepHash) {
    this.url = nurl.parse(url)

    if (!this.url.host) {
      this.url = nurl.parse(nurl.resolve(context.toString(), url))
    }

    this.url.protocol = this.url.protocol || origin.protocol;
    this.url.hash = keepHash ? this.url.hash : null;

    this.permitted = function() {
      return permittedSchemas.indexOf(this.url.protocol.replace(':', '')) >= 0;
    }

    this.local = function() {
      return this.url.host == origin.host;
    }

    this.toString = function() {
      return nurl.format(this.url)
    }
  }
}

module.exports = function Spider(baseUrl, opts) {

  opts = opts || {}

  var store = new Store();
  this.store = store.store;

  var origin = nurl.parse(baseUrl)

  var Url = UrlHelper(origin, opts.permitted || ['https', 'http'])

  baseUrl = new Url(baseUrl)

  var spider = this;

  this.go = function(doneCallback) {

    var q = async.queue(function(url, callback) {

      if (!url.permitted() || !url.local()) {
        return callback();
      }

      request(url.toString(), function (error, response, body) {

        if (error) {
          return callback(error);
        }

        var children = []
        var $ = cheerio.load(body);

        $("[href!=''],[src!='']").each(function(i, link) {
          var link = $(link);
          var urlLink = new Url(link.attr('href') || link.attr('src'), url);
          if (store.seen(urlLink)) return;
          if (link.is('a')) {
              q.push(urlLink)
              store.save(urlLink)
              return;
          }
          store.save(urlLink, url, true)
        })
        callback();
      })
    }, opts.parallel || 4);

    //kick off the queue
    q.push(baseUrl)

    //flush, should not be needed, queue normally calls q.drain
    //not sure why it isn't, no time to properly debug
    var idleInterval = setInterval(function() {
      if (q.idle()) {
        clearInterval(idleInterval)
        clearTimeout(timeoutTimeout)
        doneCallback(null, spider.store)
      }
    }, 200)

    //in case we are runnign for too long
    var timeoutTimeout = setTimeout(function() {
      clearInterval(idleInterval)
      doneCallback(new Error('timeout'), spider.store)
    }, (opts.timeout || 30) * 1000)
  }
}
