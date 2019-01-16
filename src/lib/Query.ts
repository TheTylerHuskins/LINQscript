import { Queryable } from './Queryable';
import { IQueryable } from './IQueryable';

/**
 * The query function wraps an interable and returns an IQueryable.
 *
 * This method serves as the world interface to the queryable library.
 * @param source
 */
export function Query<T>(source: Iterable<T>): IQueryable<T> {
  return new Queryable(source);
}

export namespace Query {
  /**
   * The Range operator generates a sequence of integral numbers.
   *
   * MSDN: The Range operator allocates and returns an enumerable object that captures the arguments. An ArgumentOutOfRangeException is thrown if count is less than zero or if `start + count - 1` is larger than `Number.MAX_SAFE_INTEGER`. When the object returned by Range is enumerated, it yields count sequential integers starting with the value start.
   * @param start
   * @param count
   */
  export function Range(start: number, count: number): IQueryable<number> {
    if ((count < 0) || ((start + count + 1) > Number.MAX_SAFE_INTEGER)) {
      throw new Error('ArgumentOutOfRangeException');
    }

    return new Queryable(
      () => {
        // Start at -1 because the first call to next() increments
        let idx = -1;
        return {
          next: () => {
            // Done when idx hits the count
            const done = (idx >= count);
            if (!done) { ++idx; }
            return {
              done,
              index: idx,
              value: start + idx
            };
          }
        };
      }
    );
  }

  /**
   * The Repeat operator generates a sequence by repeating a value a given number of times.
   *
   * MSDN: The Repeat operator allocates and returns an enumerable object that captures the arguments. An ArgumentOutOfRangeException is thrown if the specified count is less than zero. When the object returned by Repeat is enumerated, it yields count occurrences of element.
   * @param count
   */
  export function Repeat<TResult>(element: TResult, count: number): IQueryable<TResult> {
    if (count < 0) { throw new Error('ArgumentOUtOfRangeException'); }
    return new Queryable(
      () => {
        const result = {
          done: false,
          index: 0,
          value: element
        };
        return {
          next: () => {
            if (result.index++ >= count) {
              result.done = true;
              result.value = undefined as any as TResult;
            }
            return result;
          }
        };
      }
    );
  }

  /**
   * The Empty operator returns an empty sequence of a given type.
   */
  export function Empty(): IQueryable<never> {
    return new Queryable([]);
  }
}
