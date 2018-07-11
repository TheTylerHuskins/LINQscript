

Array.prototype.Aggregate = function <T, TAccumulate, TResult>(
  this: Array<T>,
  func: (accumulator: TAccumulate, item: T) => TAccumulate,
  seed?: TAccumulate,
  resultSelector?: (accumulator: TAccumulate) => TResult
): TResult | undefined {

  if (resultSelector === undefined) {
    // Using signatures:
    // - Aggregate(this: Array<T>, func: (accumulator: T, item: T) => T): T | undefined;
    // - Aggregate<TAccumulate>(this: Array<T>, func: (accumulator: TAccumulate, item: T) => TAccumulate, seed: TAccumulate): TAccumulate;
    // Result selector just return the accumulator
    resultSelector = acc => acc as any;
  }

  let accumulator: TAccumulate | undefined = seed;

  if (this.length > 0) {
    let idx = 0;

    if (accumulator === undefined) {
      // Using signature
      // - Aggregate(this: Array<T>, func: (accumulator: T, item: T) => T): T | undefined;
      // If no seed is given, seed is first value in array
      accumulator = this[idx++] as any;
    }

    for (let ilen = this.length; idx < ilen; ++idx) {
      accumulator = func(accumulator, this[idx]);
    }
  }

  return resultSelector(accumulator);
}