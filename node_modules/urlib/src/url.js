import { extend, looseEqual, forOwn, isEmptyObject } from './lang';

export function parseSearch (search) {
  if (!search) return {};

  var ret = {};
  search = search.slice(1).split('&');
  for (var i = 0, arr; i < search.length; i++) {
    arr = search[i].split('=');
    var key = arr[0];
    var value = arr[1];
    if (/\[\]$/.test(key)) {
      ret[key] = ret[key] || [];
      ret[key].push(value);
    } else {
      ret[key] = value;
    }
  }
  return ret;
}

export function parser (url) {
  var a = document.createElement('a');
  a.href = url;

  return {
    protocol: a.protocol,
    host: a.host,
    hostname: a.hostname,
    pathname: a.pathname,
    search: parseSearch(a.search),
    hash: a.hash,
    port: a.port
  };
}

export function addParams (url, params, lastKey) {
  if (!url || isEmptyObject(params)) {
    return url;
  }

  var parsed = parser(url);

  var p = extend(parsed.search, params);
  var arr = [];
  var lastTmp;
  forOwn(p, (value, key) => {
    var result = key + '=' + encodeURIComponent(value);
    if (lastKey === key) {
      lastTmp = result;
    } else {
      arr.push(result);
    }
  });
  if (lastTmp) {
    arr.push(lastTmp);
  }

  return parsed.protocol +
         '//' +
         parsed.host +
         parsed.pathname +
         '?' +
         arr.join('&') +
         parsed.hash;
}

export function equal (url, anotherUrl) {
  var urlParsed = parser(url);
  var anotherUrlParsed = parser(anotherUrl);

  return looseEqual(urlParsed, anotherUrlParsed);
}
