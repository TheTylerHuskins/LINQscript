
Array.prototype.Select = function <T, TResult>(this: Array<T>, selector: (item: T, index: number) => TResult): Array<TResult> {
  const accumulator: Array<TResult> = [];
  for (let idx = 0, ilen = this.length; idx < ilen; ++idx) {
    accumulator.push(selector(this[idx], idx));
  }
  return accumulator;
};

