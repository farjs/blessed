//re-exporting @types/blessed typings from:
//  https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/blessed/index.d.ts

export * from 'blessed';

export const unicode: {
  charWidth(str: string | number, i: number | undefined = undefined): number;
  strWidth(str: string): number;
  isSurrogate(str: string | number, i: number | undefined = undefined): boolean;
  isCombining(str: string | number, i: number | undefined = undefined): boolean;
};
