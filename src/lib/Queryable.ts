import { IQueryable, IEqualityComparer, IGrouping, IQueryCallback, IQueryPredicate, IQuerySelector, EqualityComparer } from './IQueryable';

/**
 * Calls next on the internal iterator and returns the transformed item
 */
interface IQueryNexter<TResult> { (): IteratorResultWithIndex<TResult>; }

/**
 * Builds a Nexter using the given iterator
 */
interface IQueryNexterBuilder<TSource, TResult> { (internalIterator: IndexedIterator<TSource>): IQueryNexter<TResult>; }

// tslint:disable-next-line:no-null-keyword triple-equals
const AssertArgument = (arg: any) => { if (arg == null) { throw new Error('ArgumentUndefinedException'); } };

const ThrowNotImplemented = () => { throw new Error('Method not implemented!'); };

/**
 *
 * Note: The source iterator is created on demand, successive calls produce new iterators.
 * Chained iterators will pass-through until the source iterator is hit
 *
 * const x = query.Select(a=>a.Name);
 *
 * const y = query.Select(a=>a.Age);
 *
 * Iterating x will not effect y.
 */
export class Queryable<TSource> implements IQueryable<TSource>{
  /**
   * Builds a Queryable from an iterable source
   * @param source
   */
  public static FromIterable<T>(source: Iterable<T>): IQueryable<T> {
    return new Queryable(source);
  }

  /**
   * Builds a Queryable from an iterator
   * @param source
   */
  public static FromIterator<T>(source: IndexedIterator<T>): IQueryable<T> {
    return new Queryable(() => source);
  }

  /**
   * Returns a new source(internal) iterator
   */
  private readonly IITer: IndexedIteratorChain<TSource>;

  /**
   * If set, the source of this queryable is a native datastructure
   */
  private readonly NativeSource?: Array<any> | Map<any, any> | string;

  public constructor(source: Iterable<TSource> | IndexedIteratorChain<TSource>) {
    AssertArgument(source);

    if (typeof (source) === 'function') {
      // Source has already been setup
      this.IITer = source;
    } else {
      this.NativeSource = source as any;
      this.IITer = () => {
        // Get the source iterator
        const sourceIterator: Iterator<TSource> = source[Symbol.iterator]();
        let sourceIndex: number = 0;

        // Build the iterator
        return {
          next: () => {
            // Get the next item
            const nextItem = sourceIterator.next() as IteratorResultWithIndex<TSource>;
            if (!nextItem.done) { nextItem.index = sourceIndex++; }
            return nextItem;
          }
        };

      };
    }
  }

  public ForEach(callback: IQueryCallback<TSource>): void {
    AssertArgument(callback);

    const source = this.IITer();

    for (let result = source.next(); !result.done; result = source.next()) {
      callback(result.value, result.index);
    }
  }

  public SelectManyRecursive(selector: IQuerySelector<TSource, Iterable<TSource>>): IQueryable<TSource> {
    AssertArgument(selector);

    const stack: Array<TSource> = [];
    const all: Array<TSource> = [];

    this.SelectMany(selector)
      .Reverse()
      .ForEach((child) => {
        stack.push(child);
      });

    while (stack.length > 0) {
      const item = stack.pop() as TSource;
      all.push(item);
      Queryable.FromIterable(selector(item, -1))
        .Reverse()
        .ForEach((child) => {
          stack.push(child);
        });
    }

    return Queryable.FromIterable(all);
  }

  public Memoize(): IQueryable<TSource> {
    return new Queryable(this.ToArray());
  }

  public Where(predicate: IQueryPredicate<TSource>): IQueryable<TSource> {
    AssertArgument(predicate);

    return this.FromNexter<TSource>((source) =>
      () => {

        let n: IteratorResultWithIndex<TSource> | undefined;
        let passed: boolean = false;

        // Search for a match or until done
        while (!passed && !(n = source.next()).done) {
          passed = predicate(n.value, n.index);
        }
        return n as IteratorResultWithIndex<TSource>;
      }
    );
  }

  public Select<TResult>(selector: IQuerySelector<TSource, TResult>): IQueryable<TResult> {
    AssertArgument(selector);

    // Return selection iterator
    return this.FromNexter<TResult>((source) =>
      () => {
        // Get next
        const n = source.next();
        return {
          // Pass value through selector when not done
          done: n.done,
          index: n.index,
          value: (n.done ? undefined as any as TResult : selector(n.value, n.index))
        };
      }
    );
  }

  public SelectMany<TResult>(selector: IQuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
  public SelectMany<TInner, TResult>(selector: IQuerySelector<TSource, Iterable<TInner>>, resultSelector
    : IQuerySelector<TInner, TResult>): IQueryable<TResult>;
  public SelectMany(selector: IQuerySelector<any, Iterable<any>>, resultSelector?: IQuerySelector<any, any>)
    : IQueryable<any> {
    AssertArgument(selector);

    return this.FromNexter((source) => {
      let outerResult: IteratorResultWithIndex<TSource>;
      let innerCollection: Iterator<any>;
      // Setup for first loop
      let innerResult: IteratorResult<any> = { done: true, value: undefined };
      let outputIndex = 0;

      return (): IteratorResultWithIndex<any> => {
        do {
          // Inner done?
          if (innerResult.done) {
            // Get next outer
            if ((outerResult = source.next()).done) {
              // Outer done.
              return {
                done: true,
                index: outputIndex,
                value: undefined
              };
            }
            // Get the inner collection
            innerCollection = selector(outerResult.value, outerResult.index)[Symbol.iterator]();
          }
          // Get next inner
        } while ((innerResult = innerCollection.next()).done);
        ++outputIndex;

        // Return inner
        return {
          done: false,
          index: outputIndex,
          value: (resultSelector !== undefined ? resultSelector(innerResult.value, outputIndex) : innerResult.value)
        };
      };
    });
  }

  public Take(count: number): IQueryable<TSource> {
    AssertArgument(count);

    return this.FromNexter<TSource>((source) => {
      let remaining = count;
      let lastIndex = -1;
      return () => {
        // More to take?
        if (remaining-- > 0) {
          // Get next
          const n = source.next();
          lastIndex = n.index;
          if (n.done) { remaining = 0; }
          return n;
        }

        // Took as many as can be taken
        return {
          done: true,
          index: lastIndex,
          value: undefined as any as TSource
        };
      };
    });
  }

  public Skip(count: number): IQueryable<TSource> {
    AssertArgument(count);

    return this.FromNexter<TSource>((source) => {
      let remaining = count;
      return () => {
        // Next until no more to skip
        for (; remaining > 0; --remaining) { source.next(); }
        return source.next();
      };
    });
  }

  public TakeWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource> {
    AssertArgument(predicate);

    return this.FromNexter<TSource>((source) => {
      let passed = true;
      let lastIndex = -1;
      return () => {
        if (passed) {
          const n = source.next();
          passed = !n.done && predicate(n.value, n.index);
          if (passed) {
            lastIndex = n.index;
            return n;
          }
        }
        // Took as many as can be taken
        return {
          done: true,
          index: lastIndex,
          value: undefined as any as TSource
        };
      };
    });
  }

  public SkipWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource> {
    AssertArgument(predicate);

    return this.FromNexter<TSource>((source) => {
      let skipped = false;
      return () => {
        // Next until failure or done
        let n: IteratorResultWithIndex<TSource>;
        do { n = source.next(); } while (!skipped && !n.done && predicate(n.value, n.index));
        skipped = true;
        return n;
      };
    });
  }

  public Join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: IQuerySelector<TSource, TKey>,
    innerKeySelector: IQuerySelector<TInner, TKey>,
    resultSelector?: (outer: TSource, inner: TInner) => TResult
  ): IQueryable<TResult> {
    AssertArgument(inner);
    AssertArgument(outerKeySelector);
    AssertArgument(innerKeySelector);

    // Ensure result selector
    const resSel = resultSelector || ((o, i) => ({ Left: o, Right: i } as any as TResult));

    return this.FromNexter((outerIter) => {
      // Convert the inner to a map
      const innerMap = new Queryable(inner).ToMap(innerKeySelector, (item) => item);

      let joinIdx: number = 0;

      return () => {

        for (let outerNext = outerIter.next(); !outerNext.done; outerNext = outerIter.next()) {
          // Get the outer key
          const outerKey = outerKeySelector(outerNext.value, outerNext.index);

          // Skip if no outer key or outer key is not in the inner map
          if ((outerKey === undefined) || (!innerMap.has(outerKey))) { continue; }

          // tslint:disable-next-line:no-non-null-assertion
          const innerValue = innerMap.get(outerKey)!;

          // Found match
          return {
            done: false,
            index: joinIdx++,
            value: resSel(outerNext.value, innerValue)
          };
        }

        // All done
        return { done: true, index: joinIdx, value: undefined as any as TResult };
      };
    });
  }

  public Concat(other: Iterable<TSource>): IQueryable<TSource> {
    AssertArgument(other);

    return this.FromNexter<TSource>((source) => {
      const otherIter = other[Symbol.iterator]();
      let concatIndex = -1;
      let sourceHas = true;
      let otherHas = true;
      return () => {
        let n: IteratorResult<TSource> | undefined;
        if (sourceHas) {
          n = source.next();
          sourceHas = !n.done;
        }
        if (!sourceHas && otherHas) {
          n = otherIter.next();
          otherHas = !n.done;
        }
        if ((sourceHas || otherHas) && n !== undefined) {
          return { done: false, index: concatIndex++, value: n.value };
        }
        return { done: true, index: concatIndex, value: undefined as any as TSource };
      };
    });
  }

  public Reverse(): IQueryable<TSource> {
    return this.FromNexter<TSource>((source) => {
      // Collect
      const elems: Array<TSource> = Queryable.FromIterator(source)
        .ToArray();

      // Loop/next
      const mxi = elems.length;
      let idx = 0;
      return () => {
        if (idx < mxi) { idx++; return { done: false, index: idx, value: elems[mxi - idx] }; }
        return { done: true, index: idx, value: undefined as any as TSource };
      };
    });
  }

  public GroupBy<TKey, TElement>(
    keySelector: IQuerySelector<TSource, TKey>,
    elementSelector?: IQuerySelector<TSource, TElement>
  ): IQueryable<IGrouping<TKey, TElement>> {
    AssertArgument(keySelector);

    // Ensure element selector
    const eSel: IQuerySelector<TSource, TElement> = elementSelector || ((item) => item as any as TElement);

    const groupMap = new Map<TKey, IGrouping<TKey, TElement>>();

    this.ForEach((item, idx) => {
      const key = keySelector(item, idx);
      const element = eSel(item, idx);
      let group = groupMap.get(key);
      if (group === undefined) {
        // tslint:disable-next-line:prefer-object-spread
        groupMap.set(key, group = Object.assign([], { Key: key }));
      }
      group.push(element);
    });

    return new Queryable(groupMap.values());
  }

  public Distinct(comparer?: IEqualityComparer<TSource>): IQueryable<TSource> {
    const cmpFn = comparer !== undefined ? comparer : EqualityComparer.Default;
    return new Queryable(() => {
      const distinctValues: Array<TSource> = [];

      // Reduce/Collapse the query chain up until this point.
      // This avoids re-querying the call chain before Distinct during the while( TakeWhile ) loops
      const collapsedQuery = (new Queryable(this.ToArray()));
      const collapsedIter = collapsedQuery.IITer();

      // Examine each value for uniqueness
      let n = collapsedIter.next();
      for (; !n.done; n = collapsedIter.next()) {
        // Has dupe if, index before this and comparer says true
        const hasDupe = collapsedQuery
          .TakeWhile((v, idx) => idx < n.index)
          .Any((v, idx) => cmpFn(n.value, v));
        if (!hasDupe) { distinctValues.push(n.value); }
      }

      // Return nexter for the distinct values
      return (new Queryable(distinctValues)).IITer();
    });
  }

  public Union(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource> {
    AssertArgument(other);
    const cmpFn = (comparer !== undefined ? comparer : EqualityComparer.Default);

    const seen: Array<TSource> = [];
    const seenQuery = Queryable.FromIterable(seen);

    return this.Concat(other)
      .Where((vCat) => {
        // Has this value not been seen?
        const dupe = seenQuery.Any((vSeen) => cmpFn(vSeen, vCat));
        if (!dupe) { seen.push(vCat); }
        return !dupe;
      });

  }

  public Intersect(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): IQueryable<TSource> {
    // Get the distinct values from other
    const distinctOther = new Queryable(other)
      .Distinct(comparer)
      .Memoize();

    // Return any item in this that is also in other
    return this.Where((thisItem) => distinctOther.Contains(thisItem, comparer));
  }

  public Except(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource> {
    // Get the distinct values from other
    const distinctOther = new Queryable(other)
      .Distinct(comparer)
      .Memoize();

    // Return any item in this, except those also in other
    return this.Where((thisItem) => !distinctOther.Contains(thisItem, comparer));
  }

  public ToArray(): Array<TSource> {
    const arr: Array<TSource> = [];
    const source = this.IITer();

    for (let result = source.next(); !result.done; result = source.next()) {
      arr.push(result.value);
    }

    return arr;
  }

  public AsIterable(): Iterable<TSource> {
    return { [Symbol.iterator]: () => this.IITer() };
  }

  public ToMap<TKey, TElement>(
    keySelector: IQuerySelector<TSource, TKey>,
    elementSelector?: IQuerySelector<TSource, TElement>
  ): Map<TKey, TElement> {
    AssertArgument(keySelector);
    // Ensure element selector
    const eSelect: IQuerySelector<TSource, TElement> = elementSelector || ((item) => item as any as TElement);

    // Create the map
    const map = new Map<TKey, TElement>();

    this.ForEach((item, idx) => {
      // Get the key
      const key = keySelector(item, idx);

      // Ensure the key is not undefined
      AssertArgument(key);

      // Ensure unique key
      if (map.has(key)) { throw new Error('ArgumentException:Duplicate Key'); }

      // Add to map
      map.set(key, eSelect(item, idx));
    });
    return map;
  }

  public OfType(
    type: 'string' | 'number' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
  ): IQueryable<TSource> {
    return this.Where((item) => (typeof (item) === type));
  }

  public Cast<TResult>(): IQueryable<TResult> {
    return this.Select((v) => v as any as TResult);
  }

  public SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): boolean {
    AssertArgument(other);

    // Use default comparer if one is not given
    const cmp = comparer || EqualityComparer.Default;

    // Get both iterators
    const myIter = this.IITer();
    const otherIter = other[Symbol.iterator]();
    while (true) {
      const result1 = myIter.next();
      const result2 = otherIter.next();

      // Has one finished before the other?
      if (result1.done !== result2.done) {
        return false;
      }

      // Has the end of both been reached?
      if (result1.done) {
        return true;
      }

      // Check if the two values match
      if (!cmp(result1.value, result2.value)) { return false; }
    }
  }

  public First(predicate?: IQueryPredicate<TSource>): TSource {
    const predFn = (predicate !== undefined ? predicate : (() => true));
    // Get new iter
    const iiTer = this.IITer();
    let n = iiTer.next();
    for (; !n.done; n = iiTer.next()) {
      if (predFn(n.value, n.index)) {
        return n.value;
      }
    }

    throw new Error('InvalidOperationException');
  }

  public FirstOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined {
    const predFn = (predicate !== undefined ? predicate : (() => true));
    // Get new iter
    const iiTer = this.IITer();
    let n: IteratorResultWithIndex<TSource>;
    let passed = false;
    do {
      if (!(n = iiTer.next()).done) {
        passed = predFn(n.value, n.index);
      }
    } while (!passed && !n.done);

    return n.done ? def : n.value;
  }

  public Last(predicate?: IQueryPredicate<TSource> | undefined): TSource {
    return ThrowNotImplemented();
  }

  public LastOrDefault(
    def?: TSource | undefined,
    predicate?: IQueryPredicate<TSource> | undefined
  ): TSource | undefined {
    return ThrowNotImplemented();
  }

  public Single(predicate?: IQueryPredicate<TSource> | undefined): TSource {
    return ThrowNotImplemented();
  }

  public SingleOrDefault(
    def?: TSource | undefined,
    predicate?: IQueryPredicate<TSource> | undefined
  ): TSource | undefined {
    return ThrowNotImplemented();
  }

  public ElementAt(index: number): TSource {
    return ThrowNotImplemented();
  }

  public ElementAtOrDefault(index: number, def?: TSource | undefined): TSource | undefined {
    return ThrowNotImplemented();
  }

  public DefaultIfEmpty(def?: TSource): IQueryable<TSource | undefined> {
    return (this.Any() ? this : new Queryable([def]));
  }

  public Any(predicate?: IQueryPredicate<TSource>): boolean {
    const predFn = (predicate !== undefined ? predicate : (() => true));

    if (Array.isArray(this.NativeSource)) {
      return this.NativeSource.some(predFn);
    }

    // Get new internal iterator
    const source = this.IITer();

    let n: IteratorResultWithIndex<TSource>;
    let passed: boolean = false;
    // Search for a match or until done
    while (!passed && !(n = source.next()).done) {
      passed = predFn(n.value, n.index);
    }
    return passed;
  }

  public All(predicate: IQueryPredicate<TSource>): boolean {
    AssertArgument(predicate);
    // False if any element passes the anti-predicate
    // True if no element passes the anti-predicate
    return !this.Any((item, idx) => !predicate(item, idx));
  }

  public Contains(value: TSource, comparer?: IEqualityComparer<TSource> | undefined): boolean {
    const cmp = comparer || EqualityComparer.Default;
    return this.Any((item) => cmp(value, item));
  }

  public Count(predicate?: IQueryPredicate<TSource> | undefined): number {
    if ((this.NativeSource !== undefined) && (predicate === undefined)) {
      if (Array.isArray(this.NativeSource)) {
        return this.NativeSource.length;
      } else if (this.NativeSource instanceof Map) {
        return this.NativeSource.size;
      } else if (typeof (this.NativeSource) === 'string') {
        return this.NativeSource.length;
      }
    }
    const filtered = (predicate === undefined) ? this : this.Where(predicate);

    return filtered.Aggregate<number, number>((acc, item, idx) => idx, -1) + 1;
  }

  public Sum(selector?: IQuerySelector<TSource, number>): number {
    if (!this.Any()) { return 0; }

    return this.Select(selector || (Number))
      .Aggregate<number, number>((acc, item) => (acc + item));
  }

  public Min<TResult>(selector?: IQuerySelector<TSource, TResult>): TResult | undefined {
    if (!this.Any()) { return undefined; }

    return this.Select(selector || ((v) => v as any as TResult))
      .Aggregate((acc, item) => ((acc < item) ? acc : item));
  }

  public Max<TResult>(selector?: IQuerySelector<TSource, TResult>): TResult | undefined {
    if (!this.Any()) { return undefined; }

    return this.Select(selector || ((v) => v as any as TResult))
      .Aggregate((acc, item) => ((acc > item) ? acc : item));
  }

  public Average(selector?: IQuerySelector<TSource, number>): number | undefined {
    if (!this.Any()) { return undefined; }

    return this.Select(selector || (Number))
      .Aggregate(
        (acc, item) => (acc + item),
        0,
        (acc, idx) => acc / (idx + 1)
      );
  }

  public Aggregate<TAccumulate, TResult>(
    func: (accumulator: TAccumulate, element: TSource, index: number) => TAccumulate,
    seed?: TAccumulate | undefined,
    selector?: IQuerySelector<TAccumulate, TResult> | undefined
  ): TResult {
    AssertArgument(func);

    // Ensure the selector
    const finalConverter: IQuerySelector<TAccumulate, TResult> = selector || ((v) => v as any as TResult);

    // Get the source iterator
    const iter: IndexedIterator<TSource> = this.IITer();

    // Get the first value
    let iterResult: IteratorResultWithIndex<TSource> = iter.next();
    let idx = -1;

    // Create the accumulator
    let accumulator: TAccumulate | undefined;
    if (seed !== undefined) {
      // Seed is defined
      accumulator = seed;
    } else {
      // If the source sequence is empty, and no seed, invalid operation
      if (iterResult.done) { throw new Error('InvalidOperationException'); }

      // Start with the first element
      accumulator = iterResult.value as any as TAccumulate;

      // Move iterator to second element
      ++idx;
      iterResult = iter.next();
    }

    // Accumulate
    while (!iterResult.done) {
      accumulator = func(accumulator, iterResult.value, ++idx);
      iterResult = iter.next();
    }

    return finalConverter(accumulator, idx);
  }

  /**
   * Constructs a Queryable from the given Nexter Builder.
   * The internal iterator comes from GetNewIterator, and is captured.
   * @param next
   */
  private FromNexter<TResult>(buildNexter: IQueryNexterBuilder<TSource, TResult>): Queryable<TResult> {
    return new Queryable<TResult>(
      () => {
        // Get a new iterator
        const internalIterator = this.IITer();

        // Build nexter
        const nexter = buildNexter(internalIterator);

        return { next: nexter };
      }
    );
  }

}
