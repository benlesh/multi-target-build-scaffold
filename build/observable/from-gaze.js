var gaze = require('gaze');
var Observable = require('rx').Observable;

module.exports = function fromGaze(pattern) {
  return Observable.create(function(observer) {
    gaze(pattern, function(){
      this.on('all', function(event, filepath) {
        observer.onNext({
          event: event,
          filepath: filepath
        });
      });
    });
  });
};