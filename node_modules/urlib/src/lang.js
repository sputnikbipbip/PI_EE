export function extend (to, from) {
  var keys = Object.keys(from);
  var i = keys.length;
  while (i--) {
    to[keys[i]] = from[keys[i]];
  }
  return to;
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object';
}

export function looseEqual (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  );
  /* eslint-enable eqeqeq */
}

export function forOwn (obj, callback) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(obj[key], key);
    }
  }
}

export function isEmptyObject (obj) {
  if (!isObject(obj)) {
    return false;
  }
  return Object.keys(obj).length === 0;
}
