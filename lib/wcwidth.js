/**
 * wcwidth.js - An implementation of wcwidth / wcswidth in pure JS
 * 
 * Borrowed/reimplemented from https://github.com/ericpruitt/wcwidth.awk
 * License below.
 */

// Copyright (c) Eric Pruitt
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const { wcwidthTable } = require("./width-data");

/**
 * A reimplementation of the POSIX function of the same name to determine the
 * number of columns needed to display a single character.
 * 
 * @param {number | undefined} wchar A single character code point
 * @returns {number} The number of columns needed to display the character if it is
 * printable and -1 if it is not.
 */
exports.wcwidth = function(wchar) {
  if (!wchar) {
    return -1;
  }

  // Do a binary search to find the width of the character
  var min = 0;
  var max = wcwidthTable.length - 1;

  while (min <= max) {
    const i = Math.trunc((min + max) / 2);
    const row = wcwidthTable[i];
    const width = row[0];
    const start = row[1];
    const end = row[2];

    if (wchar < start) {
      max = i - 1;
    } else if (wchar > end) {
      min = i + 1;
    } else {
      return width;
    }
  }

  return -1;
};
