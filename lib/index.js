var parseManifest = require('parse-appcache-manifest');
var crypto = require('crypto');
var swTemplate = require('./serviceworker');
var Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('json', function(val) {
  return new Handlebars.SafeString(JSON.stringify(val, undefined, '  '));
});

function createSHA1(input) {
  var shasum = crypto.createHash('sha1');
  shasum.update(input, 'utf8');
  return shasum.digest('hex');
}

function appcache2ServiceWorker(input, {
  cachePrefix = 'siteName'
}={}) {
  var version = createSHA1(input).slice(0, 7);
  var staticCacheName = cachePrefix + '-static-' + version;
  var manifest = parseManifest(input);
  var fallbacks = Object.keys(manifest.fallback).map((key, i) => [key, manifest.fallback[key]]);
  var networkOnly = manifest.network.filter(url => url != '*');
  var allowNetworkFallback = manifest.network.indexOf('*') != -1;

  var js = swTemplate({
    cachePrefix,
    staticCacheName: cachePrefix + '-static-' + version,
    fallbacks,
    explicitCache: manifest.cache,
    networkOnly,
    allowNetworkFallback
  });

  return js;
}

module.exports = appcache2ServiceWorker;