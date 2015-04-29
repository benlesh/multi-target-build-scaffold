/* global process */
var fromGlob = require('./from-glob');
var Observable = require('rx').Observable;
var fromGaze = require('./from-gaze');
var path = require('path');
var lstat = require('./from-fs-lstat');

module.exports = function watch(pattern) {
  var starting = fromGlob(pattern)
    .flatMap(toAddEvents);

  var gazes = fromGaze(pattern);

  return Observable.concat(starting, gazes)
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

