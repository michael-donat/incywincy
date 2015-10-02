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
  console.log('INTERNAL  -----  ')
  console.log('\t'+result.origin.join('\n\t'))
  console.log('EXTERNAL  -----  ')
  console.log('\t'+result.external.join('\n\t'))
  console.log('STATIC   -----  ')
  console.log('\t'+result.assets.join('\n\t'))

  if (err && err.message == 'timeout') {
    console.log('TIMEOUT REACHED   -----  ')
    process.exit(1)
  }
});
