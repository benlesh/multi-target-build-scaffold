var path = require('path');

module.exports = function movePath(filepath, oldRoot, newRoot, ext) {
  var rel = path.relative(oldRoot, filepath);
  return !ext ? path.join(newRoot, rel) : 
    path.join(newRoot, path.dirname(rel), path.basename(rel, path.extname(rel)) + ext);
}
