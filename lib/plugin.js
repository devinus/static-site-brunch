'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var neoAsync = require('neo-async');
var handlebars = require('handlebars');
var yamlFrontMatter = require('yaml-front-matter');

function StaticSite(config) {
  var paths = config.paths || {};
  this.publicPath = paths.public || 'public';
}

StaticSite.prototype.brunchPlugin = true;
StaticSite.prototype.type = 'template';
StaticSite.prototype.extension = 'hbs';

StaticSite.prototype.compile = function compile(params, callback) {
  var handlebarsInstance = handlebars.create();

  var outputPath = path.join(
    this.publicPath,
    path.relative('app/templates', path.dirname(params.path)),
    path.basename(params.path, '.hbs')
  );

  neoAsync.waterfall([
    neoAsync.apply(glob, '**/_*.hbs'),

    function(partials, next) {
      neoAsync.each(partials, function(file, done) {
        fs.readFile(file, { encoding: 'utf8' }, function(err, data) {
          if (err) {
            return done(err);
          }

          var name = path.basename(file, '.hbs').slice(1);
          handlebarsInstance.registerPartial(name, data);
          done();
        });
      }, next);
    },

    function(next) {
      mkdirp(path.dirname(outputPath), next);
    },

    function(made, next) {
      try {
        var context = yamlFrontMatter.parse(params.data);
        var template = handlebarsInstance.compile(context.__content);
        next(null, template(context));
      } catch (err) {
        next(err);
      }
    },

    function(output, next) {
      fs.writeFile(outputPath, output, next);
    }
  ], function(err) {
    callback(err, params);
  });
};

module.exports = StaticSite;