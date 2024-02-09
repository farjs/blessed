import assert from "node:assert/strict";
import {
  charWidth,
  isCombining,
  isSurrogate,
  strWidth,
} from "../../lib/unicode.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("unicode.test.mjs", () => {
  //given
  const combiningNonsurrogate = "s̀";
  const combiningSurrogate = "s𐨁";
  const surrogateDouble = "🉐";
  const surrogateSingle = "𝌆";
  const double = "杜";
  const star = "⭐";
  const complex = "👨‍👩‍👧‍👧";
  const complex2 = "🤦🏼‍♂️";
  assert.deepEqual(combiningNonsurrogate.length, 2);
  assert.deepEqual(combiningSurrogate.length, 3);
  assert.deepEqual(surrogateDouble.length, 2);
  assert.deepEqual(surrogateSingle.length, 2);
  assert.deepEqual(double.length, 1);
  assert.deepEqual(star.length, 1);
  assert.deepEqual(complex.length, 11);
  assert.deepEqual(complex2.length, 7);

  it("should check for combining", () => {
    //when & then
    assert.deepEqual(isCombining(""), false);
    assert.deepEqual(isCombining("", 0), false);
    assert.deepEqual(isCombining(" ", 0), false);
    assert.deepEqual(isCombining("a", 0), false);
    assert.deepEqual(isCombining("a", 1), false);
    assert.deepEqual(isCombining(combiningNonsurrogate, 0), false);
    assert.deepEqual(isCombining(combiningNonsurrogate, 1), true);
    assert.deepEqual(isCombining(combiningSurrogate, 0), false);
    assert.deepEqual(isCombining(combiningSurrogate, 1), true);
    assert.deepEqual(isCombining(combiningSurrogate, 2), false);
    assert.deepEqual(isCombining(surrogateDouble, 0), false);
    assert.deepEqual(isCombining(surrogateDouble, 2), false);
    assert.deepEqual(isCombining(surrogateSingle, 0), false);
    assert.deepEqual(isCombining(surrogateSingle, 2), false);
    assert.deepEqual(isCombining(double, 0), false);
    assert.deepEqual(isCombining(star, 0), false);
  });

  it("should check for surrogate", () => {
    //when & then
    assert.deepEqual(isSurrogate(""), false);
    assert.deepEqual(isSurrogate("", 0), false);
    assert.deepEqual(isSurrogate(" ", 0), false);
    assert.deepEqual(isSurrogate("a", 0), false);
    assert.deepEqual(isSurrogate("a", 1), false);
    assert.deepEqual(isSurrogate(combiningNonsurrogate, 0), false);
    assert.deepEqual(isSurrogate(combiningNonsurrogate, 1), false);
    assert.deepEqual(isSurrogate(combiningSurrogate, 0), false);
    assert.deepEqual(isSurrogate(combiningSurrogate, 1), true);
    assert.deepEqual(isSurrogate(combiningSurrogate, 2), false);
    assert.deepEqual(isSurrogate(surrogateDouble, 0), true);
    assert.deepEqual(isSurrogate(surrogateDouble, 1), false);
    assert.deepEqual(isSurrogate(surrogateSingle, 0), true);
    assert.deepEqual(isSurrogate(surrogateSingle, 1), false);
    assert.deepEqual(isSurrogate(double, 0), false);
    assert.deepEqual(isSurrogate(star, 0), false);
  });

  it("should return char width", () => {
    //when & then
    assert.deepEqual(charWidth(0), 0);
    assert.deepEqual(charWidth("0", 0), 1);
    assert.deepEqual(charWidth(combiningNonsurrogate, 0), 1);
    assert.deepEqual(charWidth(combiningNonsurrogate, 1), 0);
    assert.deepEqual(charWidth(combiningSurrogate, 0), 1);
    assert.deepEqual(charWidth(combiningSurrogate, 1), 0);
    assert.deepEqual(charWidth(combiningSurrogate, 2), 0);
    assert.deepEqual(charWidth(surrogateDouble, 0), 2);
    assert.deepEqual(charWidth(surrogateDouble, 1), 0);
    assert.deepEqual(charWidth(surrogateSingle, 0), 2); //TODO: should be 1 !!!
    assert.deepEqual(charWidth(surrogateSingle, 1), 0);
    assert.deepEqual(charWidth(double, 0), 2);
    assert.deepEqual(charWidth(star, 0), 1); //TODO: should be 2 !!!
  });

  it("should return string width", () => {
    //when & then
    assert.deepEqual(strWidth(""), 0);
    assert.deepEqual(strWidth("0"), 1);
    assert.deepEqual(strWidth(complex), 8);
    assert.deepEqual(strWidth(complex2), 5);
  });
});
