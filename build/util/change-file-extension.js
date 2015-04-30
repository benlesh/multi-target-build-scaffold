var path = require('path');

module.exports = function(file, ext) {
	return path.join(path.dirname(file), path.basename(file, path.extname(file)) + ext)
}