var fs = require('fs');
var Observable = require('rx').Observable;

module.exports = function fromFSLStat(path) {
	console.log('########', path);
	return Observable.create(function(observer) {
		fs.lstat(path, function(err, stat) {
			if(err) {
				observer.onError(err);
			} else {
				observer.onNext(stat);
				observer.onCompleted();
			}
		});
	});
};