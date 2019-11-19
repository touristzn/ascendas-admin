/**
 * format string
 * @param  {Array} ...args
 * @return {String}
 */
export function format(...args) {
  let i = 1;
  const f = args[0];
  const len = args.length;

  if (typeof f === 'string') {
    let str = String(f).replace(formatRegExp, (x) => {
      if (x === '%%') {
        return '%';
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case '%s':
          return String(args[i++]);
        case '%d':
          return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
          break;
        default:
          return x;
      }
    });
    for (let arg = args[i]; i < len; arg = args[++i]) {
      str += ` ${arg}`;
    }
    return str;
  }
  return f;
}

// copy json
export function copyJson(json) {
  return JSON.parse(JSON.stringify(json));
}

/**
 * 加载图片
 * @param {String} url 
 * @param {Function} callback 
 */
export function imageLoad(url, callback) {
  let image = new Image();

  image.onload = () => {
    callback({
      width: image.width,
      height: image.height,
      url: url
    });
    image = null;
  }

  image.src = url;
}
