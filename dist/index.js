'use strict';

var parseManifest = require('parse-appcache-manifest');
var crypto = require('crypto');
var swTemplate = require('./serviceworker');
var Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('json', function (val) {
  return new Handlebars.SafeString(JSON.stringify(val, undefined, '  '));
});

function createSHA1(input) {
  var shasum = crypto.createHash('sha1');
  shasum.update(input, 'utf8');
  return shasum.digest('hex');
}

function appcache2ServiceWorker(input) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];

  var _ref$cachePrefix = _ref.cachePrefix;
  var cachePrefix = _ref$cachePrefix === undefined ? 'siteName' : _ref$cachePrefix;

  var version = createSHA1(input).slice(0, 7);
  var staticCacheName = cachePrefix + '-static-' + version;
  var manifest = parseManifest(input);
  var fallbacks = Object.keys(manifest.fallback).map(function (key, i) {
    return [key, manifest.fallback[key]];
  });
  var networkOnly = manifest.network.filter(function (url) {
    return url != '*';
  });
  var allowNetworkFallback = manifest.network.indexOf('*') != -1;

  var js = swTemplate({
    cachePrefix: cachePrefix,
    staticCacheName: cachePrefix + '-static-' + version,
    fallbacks: fallbacks,
    explicitCache: manifest.cache,
    networkOnly: networkOnly,
    allowNetworkFallback: allowNetworkFallback
  });

  return js;
}

module.exports = appcache2ServiceWorker;
//# sourceMappingURL=index.js.map