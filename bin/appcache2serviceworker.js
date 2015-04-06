var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var appcache2ServiceWorker = require('../dist/');

if (!argv.i) {
  console.error("No input. Use -i <filepath>.");
  process.exit(1);
}

var input = fs.readFileSync(argv.i, {
  encoding: 'utf8'
});

console.log(appcache2ServiceWorker(input));