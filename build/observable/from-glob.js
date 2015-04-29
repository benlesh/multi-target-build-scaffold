var glob = require('glob');
var Observable = require('rx').Observable;

module.exports = function fromGlob(pattern, options) {
  return Observable.create(function(observer) {
    glob(pattern, options, function(err, files) {
      if(err) {
        observer.onError(err);
      } else {
        observer.onNext(files);
        observer.onCompleted();
      }
    });
  });
}