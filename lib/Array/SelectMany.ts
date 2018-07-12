Array.prototype.SelectMany = function <T, TIntermediate, TResult>(
  this: Array<T>,
  collectionSelector?: (item: T) => Array<TIntermediate>,
  resultSelector?: (item: T, child: TIntermediate) => TResult
): Array<TResult> {
  const accumulator: Array<TResult> = [];
  if (this.length === 0) {
    return accumulator;
  }

  if (collectionSelector == undefined) {
    // Using signature:
    // - SelectMany<TResult>(this: Array<Array<TResult>>): Array<TResult>
    // Selector should return each item
    collectionSelector = i => i as any;
  }

  if (resultSelector === undefined) {
    // Using signatures:
    // - SelectMany<TResult>(this: Array<T>, collectionSelector: (item: T) => Array<TResult>): Array<TResult>;
    // - SelectMany<TResult>(this: Array<Array<TResult>>): Array<TResult>
    // Selector should return the child
    resultSelector = (i, c) => c as any;
  }

  for (let idx = 0, ilen = this.length; idx < ilen; ++idx) {
    let item: T = this[idx];
    let itermediate: Array<TIntermediate> = collectionSelector(item);
    for (let jdx = 0, jlen = itermediate.length; jdx < jlen; ++jdx) {
      accumulator.push(resultSelector(item, itermediate[jdx]));
    }
  }

  return accumulator;
}