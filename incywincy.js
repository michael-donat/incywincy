var Spider = require('./lib/spider')

var argv = require('yargs')
    .usage('Usage: $0 --parallel [num] --timeout [seconds] url')
    .default('parallel', 4)
    .default('timeout', 5)
    .demand(1)
    .argv;

argv.url = argv._[0]

var spider = new Spider(argv.url, argv);

spider.go(function(err, result) {
  console.log('  -----  INTERNAL  -----  ')
  console.log(result.origin)
  console.log('  -----  EXTERNAL  -----  ')
  console.log(result.external)
  console.log('  -----   STATIC   -----  ')
  console.log(result.assets)
});
