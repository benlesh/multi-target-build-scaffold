var babel = require('babel-core');
var Observable = require('rx').Observable;

module.exports = function fromBabelTransformFile(filepath, options) {
  return Observable.create(function(observer) {
    babel.transformFile(filepath, options, function(err, result) {
      if(err) {
        observer.onError(err);
      } else {
        observer.onNext(result);
        observer.onCompleted();
      }
    });
  });
}