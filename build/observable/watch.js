/* global process */
var fromGlob = require('./from-glob');
var Observable = require('rx').Observable;
var fromGaze = require('./from-gaze');
var path = require('path');
var lstat = require('./from-fs-lstat');

module.exports = function watch(pattern, startWithAll) {
  var files;
  var gazes = fromGaze(pattern);
  
  if(startWithAll) {
    var starting = fromGlob(pattern)
      .flatMap(toAddEvents);
    files = Observable.concat(starting, gazes);
  } else {
    files = gazes;
  }

  return files
    .do(console.log.bind(console))
    .flatMap(getResultStats)
    .filter(toJustFiles)
    .map(backToResult)
    .publish().refCount();
};

function getResultStats(d) {
  return lstat(d.file)
    .map(function(stats) {
      return { 
        stats: stats,
        data: d
      }
    });
}

function toAddEvents(files) {
  return Observable.fromArray(files).map(toAddEvent);
}

function toJustFiles(d) {
  return d.stats.isFile();
}

function backToResult(d) {
  return d.data;
}

function toAddEvent(file) {
  return {
    file: path.resolve(process.cwd(), file),
    event: 'add'
  };
}

