/* global process */
var fs = require('fs');
var mkdirp = require('mkdirp');
var Observable = require('rx').Observable;
var path = require('path');

module.exports = function fromWriteFile(file, content) {
  return Observable.create(function(observer) {
    mkdirp(path.dirname(file), function(err) {
      if(err) {
        observer.onError(err);
      } else {
        fs.writeFile(file, content, function(err) {
          if(err) {
            observer.onError(err);
          } else {
            observer.onNext(path.resolve(process.cwd(), file));
            observer.onCompleted();
          }
        });
      };
    });
  });
};