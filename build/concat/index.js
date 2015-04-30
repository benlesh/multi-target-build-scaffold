var watch = require('../observable/watch');
var fromGlob = require('../observable/from-glob');
var writeFile = require('../observable/from-write-file');
var Concat = require('concat-with-sourcemaps');
var changeFileExtension = require('../util/change-file-extension');
var fs = require('fs');
var extend = require('../util/extend');
var Observable = require('rx').Observable;

module.exports = function concat(trigger, options) {
	var config = extend({
		sourceMap: true,
		outputFile: 'cattered.js',
		files: 'src/**/*.js',
		mapExtension: '.map',
		separator: '\n'
	}, options);
	
  return trigger.flatMap(function() {
		return fromGlob(config.files).map(function(files) {
			return files.map(function(file) {
				return {
					file: file,
					map: changeFileExtension(file, config.mapExtension)
				};
			});
		});
	})
	.map(function(files) {
		var concat = files.reduce(function(concat, d) {
			concat.add(d.file, fs.readFileSync(d.file), fs.readFileSync(d.map));
			return concat;
		}, new Concat(config.sourceMap, config.outputFile, config.separator));
		
		return {
			code: concat.content,
			sourceMap: concat.sourceMap
		};
	})
	.flatMap(function(d) {
		var file = config.outputFile;
		var map = changeFileExtension(file, config.mapExtension);
		
		return Observable.concat(writeFile(file, d.code), writeFile(map, d.sourceMap))
			.map({ 
				file: file,
				map: map
			});
	});
};