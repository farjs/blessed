/**
 * helpers.js - helpers for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var fs = require('fs');

var unicode = require('./unicode');

/**
 * Helpers
 */

var helpers = exports;

helpers.merge = function(a, b) {
  Object.keys(b).forEach(function(key) {
    a[key] = b[key];
  });
  return a;
};

helpers.asort = function(obj) {
  return obj.sort(function(a, b) {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();

    if (a[0] === '.' && b[0] === '.') {
      a = a[1];
      b = b[1];
    } else {
      a = a[0];
      b = b[0];
    }

    return a > b ? 1 : (a < b ? -1 : 0);
  });
};

helpers.hsort = function(obj) {
  return obj.sort(function(a, b) {
    return b.index - a.index;
  });
};

helpers.findFile = function(start, target) {
  return (function read(dir) {
    var files, file, stat, out;

    if (dir === '/dev' || dir === '/sys'
        || dir === '/proc' || dir === '/net') {
      return null;
    }

    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      files = [];
    }

    for (var i = 0; i < files.length; i++) {
      file = files[i];

      if (file === target) {
        return (dir === '/' ? '' : dir) + '/' + file;
      }

      try {
        stat = fs.lstatSync((dir === '/' ? '' : dir) + '/' + file);
      } catch (e) {
        stat = null;
      }

      if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
        out = read((dir === '/' ? '' : dir) + '/' + file);
        if (out) return out;
      }
    }

    return null;
  })(start);
};

// Escape text for tag-enabled elements.
helpers.escape = function(text) {
  return text.replace(/[{}]/g, function(ch) {
    return ch === '{' ? '{open}' : '{close}';
  });
};

helpers.parseTags = function(text, screen) {
  return helpers.Element.prototype._parseTags.call(
    { parseTags: true, screen: screen || helpers.Screen.global }, text);
};

helpers.generateTags = function(style, text) {
  var open = ''
    , close = '';

  Object.keys(style || {}).forEach(function(key) {
    var val = style[key];
    if (typeof val === 'string') {
      val = val.replace(/^light(?!-)/, 'light-');
      val = val.replace(/^bright(?!-)/, 'bright-');
      open = '{' + val + '-' + key + '}' + open;
      close += '{/' + val + '-' + key + '}';
    } else {
      if (val === true) {
        open = '{' + key + '}' + open;
        close += '{/' + key + '}';
      }
    }
  });

  if (text != null) {
    return open + text + close;
  }

  return {
    open: open,
    close: close
  };
};

helpers.attrToBinary = function(style, element) {
  return helpers.Element.prototype.sattr.call(element || {}, style);
};

helpers.stripTags = function(text) {
  if (!text) return '';
  return text
    .replace(/{(\/?)([\w\-,;!#]*)}/g, '')
    .replace(/\x1b\[[\d;]*m/g, '');
};

helpers.cleanTags = function(text) {
  return helpers.stripTags(text).trim();
};

/**
 * @param {string} text
 * @returns {string}
 */
helpers.dropUnicode = function(text) {
  return helpers.replaceUnicode(text, defaultUnicodeReplacer);
};

/**
 * @param {boolean} isSurrogate
 * @param {number} charWidth
 * @returns {string}
 */
function defaultUnicodeReplacer(isSurrogate, charWidth) {
  if (isSurrogate) {
    return "?";
  }
  if (charWidth > 1) {
    return "??";
  }
  return "";
}

/**
 * @param {string} str
 * @param {(isSurrogate: boolean, charWidth: number, ch: string) => string} replacer
 * @returns {string}
 */
helpers.replaceUnicode = function(str, replacer) {
  if (!str) return '';

  const result = [];
  var next = undefined;
  for (var i = 0; i < str.length; i++) {
    const isSurrogate = unicode.isSurrogate(str, i);
    const cw = unicode.charWidth(str, i);
    if (cw != 1 || isSurrogate) {
      const start = next ?? 0;
      if (start < i) {
        result.push(str.substring(start, i));
      }
      next = i + (isSurrogate ? 2 : 1);
      const ch = str.substring(i, next);
      const rc = replacer(isSurrogate, cw, ch);
      if (rc) {
        result.push(rc);
      }
    }
    if (isSurrogate) i++;
  }

  if (next && next < i) {
    result.push(str.substring(next, str.length));
  }

  return result.length === 0 ? str : result.join("");
};

helpers.__defineGetter__('Screen', function() {
  if (!helpers._screen) {
    helpers._screen = require('./widgets/screen');
  }
  return helpers._screen;
});

helpers.__defineGetter__('Element', function() {
  if (!helpers._element) {
    helpers._element = require('./widgets/element');
  }
  return helpers._element;
});
