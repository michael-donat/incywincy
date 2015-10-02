var chai = require('chai')

var mock = require('./helper/server')
var Spider = require('./../lib/spider')

chai.should();

describe('Spider', function() {

  before(function(done) {
    mock.init(5553, done)
  })

  beforeEach(function() {
    mock.reset();
  })

  describe('when climbing', function() {
    it('follows <a> tag locations only', function(done) {
      var spider = new Spider(mock.url('/waterspout'))
      spider.go(function(err, store) {
        mock.hit('/waterspout').should.be.true
        mock.hit('/waterspout/top').should.be.true
        mock.hit('/link').should.be.false
        done()
      })
    })
    it('visits locations only one', function(done) {
      var spider = new Spider(mock.url('/loop'))
      spider.go(function(err, store) {
        store.all.length.should.equal(1)
        done()
      })
    })
    it('times out after a period of time', function(done) {
      var spider = new Spider(mock.url('/wait'), {timeout: 0.5})
      spider.go(function(err, store) {
        done()
      })
    })
  })

  describe('when weaving', function() {
    it('captures all src/href attributes', function(done) {
      var spider = new Spider(mock.url('/waterspout'))
      spider.go(function(err, store) {
        store.all.length.should.equal(3)
        done()
      })
    })
    it('understands absolute locations', function(done) {
      var spider = new Spider(mock.url('/waterspout'))
      spider.go(function(err, store) {
        store.all.should.include(mock.url('/waterspout/top'))
        done()
      })
    })
    it('understands relative locations', function(done) {
      var spider = new Spider(mock.url('/relative'))
      spider.go(function(err, store) {
        store.all.should.include(mock.url('/top'))
        done()
      })
    })
    it('splits captured locations between internal, external and static assets', function(done) {
      var spider = new Spider(mock.url('/mix'))
      spider.go(function(err, store) {
        store.origin.should.include(mock.url('/origin'))
        store.origin.length.should.equal(1)
        store.external.should.include('http://google.com/')
        store.external.length.should.equal(1)
        store.assets.should.include(mock.url('/image'))
        store.assets.length.should.equal(1)
        done()
      })
    })
    it('ignores non permitted schemes', function(done) {
      var spider = new Spider(mock.url('/schemes'), {permitted: ['http']})
      spider.go(function(err, store) {
        store.all.length.should.equal(1)
        done()
      })
    })
  })
})
