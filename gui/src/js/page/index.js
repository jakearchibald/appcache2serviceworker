var appcache2ServiceWorkerSrc = new (require('./appcache-2-service-worker-src'));
var input = document.querySelector('.input');
var output = document.querySelector('.output');

function convert() {
  appcache2ServiceWorkerSrc.convert(input.value)
    .then(val => output.textContent = val)
}

input.addEventListener('input', event => {
  event.preventDefault();
  convert();
});

convert();