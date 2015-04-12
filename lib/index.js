var parseManifest = require('parse-appcache-manifest');
var swTemplate = require('./serviceworker');
var Handlebars = require('handlebars/runtime');
// Avoiding the full crypto lib, as that's huge
var sha1 = require('sha1');

Handlebars.registerHelper('json', function(val) {
  return new Handlebars.SafeString(JSON.stringify(val, undefined, '  '));
});

function appcache2ServiceWorker(input, {
  cachePrefix = 'siteName'
}={}) {
  var version = sha1(input).slice(0, 7);
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
    allowNetworkFallback,
    hasCachedItems: manifest.cache.length || fallbacks.length
  });

  return js;
}

module.exports = appcache2ServiceWorker;