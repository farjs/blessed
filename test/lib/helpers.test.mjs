import assert from "node:assert/strict";
import helpers from "../../lib/helpers.js";

const { dropUnicode, replaceUnicode } = helpers;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("helpers.test.mjs", () => {
  it("should replace unicode chars when dropUnicode", () => {
    //when & then
    assert.deepEqual(dropUnicode(""), "");
    assert.deepEqual(dropUnicode("abc"), "abc");
    assert.deepEqual(dropUnicode("🉐"), "?");
    assert.deepEqual(dropUnicode("a🉐"), "a?");
    assert.deepEqual(dropUnicode("🉐b"), "?b");
    assert.deepEqual(dropUnicode("a🉐b"), "a?b");
    assert.deepEqual(dropUnicode("杜"), "??");
    assert.deepEqual(dropUnicode("a杜"), "a??");
    assert.deepEqual(dropUnicode("杜b"), "??b");
    assert.deepEqual(dropUnicode("a杜b"), "a??b");
    assert.deepEqual(dropUnicode("s̀"), "s");
    assert.deepEqual(dropUnicode("as̀"), "as");
    assert.deepEqual(dropUnicode("s̀b"), "sb");
    assert.deepEqual(dropUnicode("as̀b"), "asb");
    assert.deepEqual(dropUnicode("as𐨁b"), "as?b");
    assert.deepEqual(dropUnicode("a🉐s̀杜b"), "a?s??b");
  });

  it("should replace unicode chars when replaceUnicode", () => {
    //given
    const replacer = (isSurrogate, charWidth, ch) => {
      return charWidth > 1 ? `${ch}\x03` : ch;
    };
    const replace = (str) => replaceUnicode(str, replacer);

    //when & then
    assert.deepEqual(replace(""), "");
    assert.deepEqual(replace("abc"), "abc");
    assert.deepEqual(replace("🉐"), "🉐\x03");
    assert.deepEqual(replace("a🉐"), "a🉐\x03");
    assert.deepEqual(replace("🉐b"), "🉐\x03b");
    assert.deepEqual(replace("a🉐b"), "a🉐\x03b");
    assert.deepEqual(replace("杜"), "杜\x03");
    assert.deepEqual(replace("a杜"), "a杜\x03");
    assert.deepEqual(replace("杜b"), "杜\x03b");
    assert.deepEqual(replace("a杜b"), "a杜\x03b");
    assert.deepEqual(replace("s̀"), "s̀");
    assert.deepEqual(replace("as̀"), "as̀");
    assert.deepEqual(replace("s̀b"), "s̀b");
    assert.deepEqual(replace("as̀b"), "as̀b");
    assert.deepEqual(replace("as𐨁b"), "as𐨁b");
    assert.deepEqual(replace("a🉐s̀杜b"), "a🉐\x03s̀杜\x03b");
  });
});
