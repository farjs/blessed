import assert from "node:assert/strict";
import { charWidth } from "../../lib/unicode.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("unicode.test.mjs", () => {
  it("should return char width", () => {
    //when & then
    assert.deepEqual(charWidth(0), 0);
    assert.deepEqual(charWidth("0", 0), 1);
  });
});
