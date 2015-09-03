'use strict';

var fs = require('fs');
var mockfs = require('mock-fs');
var neoAsync = require('neo-async');
var expect = require('chai').expect;

var Plugin = require('..');

describe('StaticSite', function() {
  var template = '---\nname: Devin\n---\n{{> hello}}';
  var plugin;

  before(function() {
    mockfs({
      'app/templates': {
        '_hello.hbs': '{{name}}',
        'index.html.hbs': template
      }
    });
  });

  after(function() {
    mockfs.restore();
  });

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('#constructor', function() {
    expect(plugin).to.be.ok;
  });

  it('#getDependencies', function(done) {
    var path = 'app/templates/index.html.hbs';
    return plugin.getDependencies(template, path, function(err, partials) {
      if (err) return done(err);
      expect(partials).to.have.length(1);
      expect(partials).to.include('app/templates/_hello.hbs');
      return done();
    });
  });

  it('#compile', function(done) {
    var params = { data: template, path: 'app/templates/index.html.hbs' };
    return neoAsync.waterfall([
      neoAsync.apply(plugin.compile.bind(plugin), params),
      neoAsync.apply(fs.readFile, 'public/index.html', { encoding: 'utf-8' }),
      function(data, next) {
        expect(data).to.equal('Devin');
        return next();
      }
    ], done);
  });
});
