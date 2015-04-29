
module.exports = function extend(a, b) {
  if(a && b && a !== b) {
    for(var key in b) {
      if(b.hasOwnProperty(key)) {
        a[key] = b[key]
      }
    }
  }
  return a;
}