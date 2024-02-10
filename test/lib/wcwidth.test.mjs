import assert from "node:assert/strict";
import { wcwidth } from "../../lib/wcwidth.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("wcwidth.test.mjs", () => {
  it("should return char width when wcwidth", () => {
    //when & then
    assert.deepEqual(wcwidth(undefined), -1);
    assert.deepEqual(wcwidth(-1), -1);
    assert.deepEqual(wcwidth(0), -1);
    assert.deepEqual(wcwidth(1), -1);
    assert.deepEqual(wcwidth(0xe01ef), 0);
    assert.deepEqual(wcwidth(173781), 2);
    assert.deepEqual(wcwidth(917505), 0);
    assert.deepEqual(wcwidth(1048575), -1);
    assert.deepEqual(wcwidth(1048576), 1);
    assert.deepEqual(wcwidth(1114109), 1);
    assert.deepEqual(wcwidth(1114110), -1);
    assert.deepEqual(wcwidth(1114111), -1);
    assert.deepEqual(wcwidth("a".codePointAt(0)), 1);
    assert.deepEqual(wcwidth("🉐".codePointAt(0)), 2);
    assert.deepEqual(wcwidth("杜".codePointAt(0)), 2);
    assert.deepEqual(wcwidth("s̀".codePointAt(0)), 1);
    assert.deepEqual(wcwidth("s̀".codePointAt(1)), 0);
    assert.deepEqual(wcwidth("s𐨁".codePointAt(0)), 1);
    assert.deepEqual(wcwidth("s𐨁".codePointAt(1)), 0);
  });
});
