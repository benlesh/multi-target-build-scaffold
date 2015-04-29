var babelTransformFile = require('../observable/from-babel-transform-file');
var writeFile = require('../observable/from-write-file');
var movePathToDirectory = require('../util/move-path-to-directory');
var rx = require('rx');
var Observable = rx.Observable;
var extend = require('../util/extend');

/**
 * @module build/babel/index.js
 * @method babelTranspile
 * @param files {Observable<File>} the stream of files to process
 * @param srcDir {String} the root directory of the stream of files to process
 * @param destDir {String} the directory to place transformed files into
 * @param options {Object} the Babel Options to use
 */
module.exports = function babelTranspile(files, srcDir, destDir, options) {
  return files
    .map(includeStartTime)
    .do(logStart)
    .flatMap(transformFile(options))
    .flatMap(writeFiles(srcDir, destDir))
    .map(calculateTime)
    .do(logEnd);
}

function includeStartTime(d) {
  return {
    file: d.file,
    map: d.map,
    start: Date.now()
  };
}

function calculateTime(d) {
  d.total = Date.now() - d.start;
  return d;
}

function logEnd(d) {
  console.log('babel (%sms) %s', d.total, d.file);
}

function logStart(d) {
  console.log('babel %s', d.file);
}

function transformFile(options) {
  return function transformer(d) {
    var file = d.file;
    
    return babelTransformFile(file, options)
      .map(function (b) {
        return {
          file: file,
          map: b.map,
          code: b.code,
          ast: b.ast,
          start: d.start
        };
      });
  };
}

function writeFiles(srcDir, destDir) {
  return function fileWriter(d) {
    return Observable.combineLatest(
      writeFile(movePathToDirectory(d.file, srcDir, destDir), d.code),
      writeFile(movePathToDirectory(d.file, srcDir, destDir, '.map'), JSON.stringify(d.map)),
      function (file, map) {
        return {
          file: file,
          map: map,
          original: d.file,
          start: d.start,
          total: Date.now() - d.start
        };
      });
  };
}