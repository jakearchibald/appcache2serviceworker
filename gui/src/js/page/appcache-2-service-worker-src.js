"use strict";

class Appcache2ServiceWorkerSrc extends require('./worker-messenger') {
  constructor() {
    super('js/appcache-2-service-worker-src-worker.js');
  }

  convert(input) {
    return this._requestResponse({
      data: input
    });
  }
}

module.exports = Appcache2ServiceWorkerSrc;