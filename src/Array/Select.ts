interface Array<T> {
  /**
   * Projects each element of a sequence into a new form by incorporating the element's index.
   * @param this A sequence of values to project.
   * @param selector A transform function to apply to each element.
   */
  Select<TResult>(this: Array<T>, selector: (item: T, index?: number) => TResult): Array<TResult>;
}



Array.prototype.Select = function <T, TResult>(this: Array<T>, selector: (item: T, index: number) => TResult): Array<TResult> {
  const accumulator: Array<TResult> = [];
  for (let idx = 0, ilen = this.length; idx < ilen; ++idx) {
    accumulator.push(selector(this[idx], idx));
  }
  return accumulator;
};

