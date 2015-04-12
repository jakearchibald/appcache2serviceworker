var appcache2ServiceWorker = require('../../../../dist');

self.onmessage = function(event) {
  try {
    self.postMessage({
      id: event.data.id,
      result: appcache2ServiceWorker(event.data.data)
    });
  }
  catch (error) {
    self.postMessage({
      id: event.data.id,
      error: error.message
    });
  }
};