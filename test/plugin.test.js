'use strict';

var expect = require('chai').expect;

var Plugin = require('..');

describe('StaticSite', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should create the plugin', function() {
    expect(plugin).to.be.ok;
  });
});
