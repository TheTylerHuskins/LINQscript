import { IQueryable, IEqualityComparer, IGrouping, IQueryCallback, IQueryPredicate, IQuerySelector, EqualityComparer } from "./IQueryable";


/**
 * Calls next on the internal iterator and returns the transformed item
 */
interface QueryNexter<TResult> { (): IteratorResultWithIndex<TResult> };

/**
 * Builds a Nexter using the given iterator
 */
interface QueryNexterBuilder<TSource, TResult> { (internalIterator: IndexedIterator<TSource>): QueryNexter<TResult> };

const AssertArgument = (arg: any) => { if (arg == null) { throw new Error("ArgumentNullException"); } };

const ThrowNotImplemented = () => { throw new Error("Method not implemented.") };

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
   * Returns a new source(internal) iterator
   */
  private IITer: IndexedIteratorChain<TSource>;

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

  public constructor(source: Iterable<TSource> | IndexedIteratorChain<TSource>) {
    AssertArgument(source);

    if (typeof (source) == 'function') {
      // Source has already been setup
      this.IITer = source;
    } else {
      this.IITer = () => {
        // Get the source iterator
        const sourceIterator: Iterator<TSource> = source[Symbol.iterator]();
        let sourceIndex: number = 0;

        // Build the iterator
        return {
          next: () => {
            // Get the next item
            let nextItem = sourceIterator.next() as IteratorResultWithIndex<TSource>;
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
    };
  }

  public SelectManyRecursive(selector: IQuerySelector<TSource, Iterable<TSource>>): IQueryable<TSource> {
    AssertArgument(selector);

    const stack: Array<TSource> = [];
    const all: Array<TSource> = [];

    this.SelectMany(selector).Reverse().ForEach(child => {
      stack.push(child);
    });

    while (stack.length > 0) {
      const item = stack.pop()!;
      all.push(item);
      Queryable.FromIterable(selector(item, -1))
        .Reverse()
        .ForEach(child => {
          stack.push(child);
        });
    }

    return Queryable.FromIterable(all);
  }

  public Where(predicate: IQueryPredicate<TSource>): IQueryable<TSource> {
    AssertArgument(predicate);

    return this.FromNexter<TSource>((source) =>
      () => {

        let n: IteratorResultWithIndex<TSource>;
        let passed: boolean = false;

        // Search for a match or until done
        while (!passed && !(n = source.next()).done) {
          passed = predicate(n.value, n.index);
        };
        return n!;
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
          value: (n.done ? undefined as any as TResult : selector(n.value, n.index)),
          done: n.done,
          index: n.index
        };
      }
    );
  }

  public SelectMany<TResult>(selector: IQuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
  public SelectMany<TInner, TResult>(selector: IQuerySelector<TSource, Iterable<TInner>>, resultSelector: IQuerySelector<TInner, TResult>): IQueryable<TResult>;
  public SelectMany(selector: IQuerySelector<any, Iterable<any>>, resultSelector?: IQuerySelector<any, any>): IQueryable<any> {
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
                value: undefined,
                done: true,
                index: outputIndex
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
          value: (resultSelector ? resultSelector(innerResult.value, outputIndex) : innerResult.value),
          done: false,
          index: outputIndex
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
        }
      }
    });
  }

  public Skip(count: number): IQueryable<TSource> {
    AssertArgument(count);

    return this.FromNexter<TSource>((source) => {
      let remaining = count;
      return () => {
        // Next until no more to skip
        for (; remaining > 0; --remaining) { source.next(); };
        return source.next();
      }
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
          if (passed) { return n; }
        }
        // Took as many as can be taken
        return {
          done: true,
          index: lastIndex,
          value: undefined as any as TSource
        }
      }
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
      }
    });
  }

  public Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: IQuerySelector<TSource, TKey>, innerKeySelector: IQuerySelector<TInner, TKey>, resultSelector: (outer: TSource, inner: TInner) => TResult, comparer: IEqualityComparer<TKey>): IQueryable<TResult> {
    return ThrowNotImplemented();
  }

  public Concat(other: Iterable<TSource>): IQueryable<TSource> {
    AssertArgument(other);

    return this.FromNexter<TSource>((source) => {
      const otherIter = other[Symbol.iterator]();
      let concatIndex = -1;
      let sourceHas = true;
      let otherHas = true;
      return () => {
        let n: IteratorResult<TSource>;
        if (sourceHas) {
          n = source.next();
          sourceHas = !n.done;
        }
        if (!sourceHas && otherHas) {
          n = otherIter.next();
          otherHas = !n.done;
        }
        if (sourceHas || otherHas) {
          return { done: false, index: concatIndex++, value: n!.value };
        }
        return { done: true, index: concatIndex, value: undefined as any as TSource };
      }
    });
  }

  public Reverse(): IQueryable<TSource> {
    return this.FromNexter<TSource>((source) => {
      // Collect
      let elems: Array<TSource> = Queryable.FromIterator(source).ToArray();

      // Loop/next
      const mxi = elems.length;
      let idx = 0;
      return () => {
        if (idx < mxi) { idx++; return { done: false, index: idx, value: elems[mxi - idx] } }
        return { done: true, index: idx, value: undefined as any as TSource };
      };
    });
  }

  public GroupBy<TKey, TElement>(keySelector: IQuerySelector<TSource, TKey>, elementSelector: IQuerySelector<TSource, TElement>, comparer: IEqualityComparer<TKey>): IQueryable<IGrouping<TKey, TElement>> {
    return ThrowNotImplemented();
  }

  public Distinct(comparer: IEqualityComparer<TSource>): IQueryable<TSource> {
    comparer = comparer || EqualityComparer.Default;
    return new Queryable(() => {
      const distinctValues: Array<TSource> = [];

      // Reduce/Collapse the query chain up until this point.
      // This avoids re-querying the call chain before Distinct
      // during the while( TakeWhile ) loops
      const collapsedQuery = (new Queryable(this.ToArray()));
      const collapsedIter = collapsedQuery.IITer();

      // Examine each value for uniqueness
      let n = collapsedIter.next();
      for (; !n.done; n = collapsedIter.next()) {
        // Has dupe if, index before this and comparer says true
        const hasDupe = collapsedQuery
          .TakeWhile((v, idx) => idx < n.index)
          .Any((v, idx) => comparer(n.value, v));
        if (!hasDupe) { distinctValues.push(n.value); }
      };

      // Return nexter for the distinct values
      return (new Queryable(distinctValues)).IITer();
    });
  }

  public Union(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): IQueryable<TSource> {
    AssertArgument(other);
    comparer = comparer || EqualityComparer.Default;

    const seen: Array<TSource> = [];
    const seenQuery = Queryable.FromIterable(seen);

    return this.Concat(other).Where((vCat) => {
      // Has this value not been seen?
      const dupe = seenQuery.Any((vSeen) => comparer(vSeen, vCat));
      if (!dupe) { seen.push(vCat); }
      return !dupe;
    });

  }

  public Intersect(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): IQueryable<TSource> {
    return ThrowNotImplemented();
  }

  public Except(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): IQueryable<TSource> {
    return ThrowNotImplemented();
  }

  public ToArray(): Array<TSource> {
    const arr: Array<TSource> = [];
    const source = this.IITer();

    for (let result = source.next(); !result.done; result = source.next()) {
      arr.push(result.value);
    };

    return arr;
  }

  public AsIterable(): Iterable<TSource> {
    return { [Symbol.iterator]: () => this.IITer() };
  }

  public ToMap<TKey, TElement>(keySelector: IQuerySelector<TSource, TKey>, elementSelector: IQuerySelector<TSource, TElement>, comparer: IEqualityComparer<TKey>): Map<TKey, TElement> {
    return ThrowNotImplemented();
  }

  public OfType(type: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function"): IQueryable<TSource> {
    return ThrowNotImplemented();
  }

  public Cast<TResult>(): IQueryable<TResult> {
    return ThrowNotImplemented();
  }

  public SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): boolean {
    return ThrowNotImplemented();
  }

  public First(predicate?: IQueryPredicate<TSource>): TSource {
    predicate = predicate || ((element) => true);
    // Get new iter
    const iiTer = this.IITer();
    let n = iiTer.next();
    for (; !n.done; n = iiTer.next()) {
      if (predicate(n.value, n.index)) {
        return n.value;
      }
    }

    throw new Error("InvalidOperationException");
  }

  public FirstOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined {
    predicate = predicate || ((element) => true);
    // Get new iter
    const iiTer = this.IITer();
    let n: IteratorResultWithIndex<TSource>;
    let passed = false;
    do {
      if (!(n = iiTer.next()).done) {
        passed = predicate(n.value, n.index);
      }
    } while (!passed && !n.done);

    return n.done ? def : n.value;
  }

  public Any(predicate?: IQueryPredicate<TSource>): boolean {
    predicate = predicate || (() => true);
    // Get new internal iterator
    const source = this.IITer();

    let n: IteratorResultWithIndex<TSource>;
    let passed: boolean = false;
    // Search for a match or until done
    while (!passed && !(n = source.next()).done) {
      passed = predicate(n.value, n.index);
    };
    return passed;
  }


  /**
   * Constructs a Queryable from the given Nexter Builder.
   * The internal iterator comes from GetNewIterator, and is captured.
   * @param next
   */
  private FromNexter<TResult>(buildNexter: QueryNexterBuilder<TSource, TResult>): Queryable<TResult> {
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