var watch = require('./observable/watch');
var babelTranspile = require('./babel');

var noop = function(){};

var files = watch('src/**/*.js');

babelTranspile(files, 'src/', 'dist/cjs/', {
  sourceMaps: true,
  externalHelpers: true,
  loose: ['all'],
  optional: ['runtime']
})
.subscribe(noop);
  
babelTranspile(files, 'src/', 'dist/amd/', {
  sourceMaps: true,
  externalHelpers: true,
  loose: ['all'],
  optional: ['runtime'],
  modules: 'amd'
}).subscribe(noop);
