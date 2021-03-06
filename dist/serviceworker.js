var Handlebars = require("handlebars/runtime");module.exports = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "var explicitCache = "
    + this.escapeExpression((helpers.json || (depth0 && depth0.json) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.explicitCache : depth0),{"name":"json","hash":{},"data":data}))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.explicitCache : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ";\n";
},"2":function(depth0,helpers,partials,data) {
    return ".filter(function(url) {\n  // Appcache silently ignores urls with a different protocol,\n  // even HTTPS when the host is HTTP, so I guess we'll do\n  // the same.\n  return new URL(url).protocol === localtion.protocol;\n})";
},"4":function(depth0,helpers,partials,data) {
    return "var networkOnly = "
    + this.escapeExpression((helpers.json || (depth0 && depth0.json) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.networkOnly : depth0),{"name":"json","hash":{},"data":data}))
    + ".filter(function(url) {\n  // Again, Appcache silently ignores URLs of a\n  // different scheme.\n  return new URL(url).protocol === localtion.protocol;\n});;\n";
},"6":function(depth0,helpers,partials,data) {
    return "var fallbacks = "
    + this.escapeExpression((helpers.json || (depth0 && depth0.json) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.fallbacks : depth0),{"name":"json","hash":{},"data":data}))
    + ".reduce(function(entries, fallbackEntry) {\n  var prefixURL   = new URL(fallbackEntry[0], location);\n  var fallbackURL = new URL(fallbackEntry[1], location);\n\n  // Cross-origin fallbacks are possible with ServiceWorker,\n  // but AppCache doesn't allow them, so we're going to drop them\n  // here too. Duplicates are also ignored.\n  if (prefixURL === location.origin\n    && fallbackURL === location.origin\n    && entries.indexOf(prefixURL.href) == -1) {\n    entries.push([prefixURL.href, fallbackURL.href]);\n  }\n  return entries;\n}, []);\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n  var requests = explicitCache"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.fallbacks : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ".map(function(url) {\n    // Appcache makes no-cors requests by default, you may not want this\n    return new Request(url, {mode: 'no-cors'});\n  });\n\n  event.waitUntil(\n    Promise.all(requests.map(function(request) {\n      // Fetch the stuff we want to cache\n      return fetch(request).then(function(response) {\n        // If the response looks like an error, it's considered a failure.\n        // Note: we can only detect this on same-origin requests.\n        var responseOk = response.type == 'opaque' || (response.status >= 200 && response.status < 300);\n        // Appcache considers redirects a failure.\n        var redirected = response.url != request.url;\n        // Appcache refuses to cache 'no-store' responses.\n        // Note: we can only detect this on same-origin requests.\n        var noStore = response.type != 'opaque' && (response.headers.get('cache-control') || '').toLowerCase().indexOf('no-store') != -1;\n        \n        if (responseOk && !redirected && !noStore) {\n          return response;\n        }\n        throw Error(\"Invalid response from \" + request.url);\n      });\n    })).then(function(responses) {\n      // Cache them\n      return caches.open(staticCacheName).then(function(cache) {\n        return Promise.all(responses.map(function(response, i) {\n          return cache.put(requests[i], response);\n        }));\n      });\n    })\n  );\n";
},"9":function(depth0,helpers,partials,data) {
    return ".concat(\n    fallbacks.map(function(fallbackEntry){ return fallbackEntry[1]; })\n  )";
},"11":function(depth0,helpers,partials,data) {
    return "  // Prefix matches in NETWORK (except '*') cause an early-exit\n  for (var networkEntry of networkOnly) {\n    if (requestURL.href.indexOf(networkEntry) === 0) return;\n  }\n";
},"13":function(depth0,helpers,partials,data) {
    return ".then(function(response) {\n        // Handling FALLBACK:\n        // If we already have a response, use it.\n        if (response) return response;\n        // FALLBACK doesn't apply to other-origin URLs.\n        if (requestURL.origin != location.origin) return;\n\n        for (var fallbackEntry of fallbacks) {\n          // Look for a prefix match\n          if (requestURL.href.indexOf(fallbackEntry[0]) === 0) {\n            return fetch(event.request).then(function(response) {\n              // Successful but error-like responses are treated as failures.\n              var responseOk = response.status >= 200 && response.status < 300;\n              // Redirects to other origins are counted as failures.\n              var responseSameOrigin = new URL(response.url).origin == location.origin;\n              if (!responseOk || !responseSameOrigin) throw Error(\"Fallback request failure\");\n            }).catch(function() {\n              // Use the fallback\n              return cache.match(fallbackEntry[1]);\n            });\n          }\n        }\n      })";
},"15":function(depth0,helpers,partials,data) {
    return ".then(function(response) {\n      // You had \"*\" in your network section, lucky you!\n      return response || fetch(event.request);\n    })";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "var cachePrefix = "
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.cachePrefix : depth0),{"name":"json","hash":{},"data":data}))
    + ";\n// The hash is generated from the manifest contents,\n// so changes to the manifest will be picked up here\n// and create their own cache.\nvar staticCacheName = "
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.staticCacheName : depth0),{"name":"json","hash":{},"data":data}))
    + ";\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasCachedItems : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.networkOnly : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.fallbacks : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\nself.addEventListener('install', function(event) {\n  // TODO: skipwaiting\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasCachedItems : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "});\n\nself.addEventListener('activate', function(event) {\n  // Delete caches from previous versions\n  event.waitUntil(\n    caches.keys().then(function(cacheNames) {\n      return Promise.all(cacheNames.map(function(name) {\n        if (name.indexOf(cachePrefix + '-') === 0 && name !== staticCacheName) {\n          return caches.delete(cacheName);\n        }\n      }));\n    })\n  );\n});\n\nself.addEventListener('fetch', function(event) {\n  var requestURL = new URL(event.request.url);\n  // Appcache only handles GET & same-scheme requests\n  if (event.request.method != 'GET' || requestURL.scheme != location.scheme) return;\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.networkOnly : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  event.respondWith(\n    caches.open(staticCacheName).then(function(cache) {\n      return cache.match(event.request)"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.fallbacks : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ";\n    })"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.allowNetworkFallback : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n  );\n});";
},"useData":true});