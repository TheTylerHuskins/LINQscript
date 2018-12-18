import { IQueryable, IEqualityCompararer, IGrouping, QueryCallback, QueryNexterBuilder, QueryPredicate, QuerySelector } from "./IQueryable";


const NotImplemented = () => { throw new Error("Method not implemented.") };

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

  public static From<T>(source: Iterable<T>): IQueryable<T> {
    return new Queryable(source);
  }

  public constructor(source: Iterable<TSource> | IndexedIteratorChain<TSource>) {
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
            nextItem.index = sourceIndex++;
            return nextItem;
          }
        };

      };
    }
  }

  public ForEach(callback: QueryCallback<TSource>): void {
    const source = this.IITer();
    let result: IteratorResultWithIndex<TSource>;
    while (!(result = source.next()).done) {
      callback(result.value, result.index);
    };
  }

  public Where(predicate: QueryPredicate<TSource>): IQueryable<TSource> {
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

  public Select<TResult>(selector: QuerySelector<TSource, TResult>): IQueryable<TResult> {
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

  public SelectMany<TResult>(selector: QuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
  public SelectMany<TInner, TResult>(selector: QuerySelector<TSource, Iterable<TInner>>, resultSelector: QuerySelector<TInner, TResult>): IQueryable<TResult>;
  public SelectMany(selector: QuerySelector<any, Iterable<any>>, resultSelector?: QuerySelector<any, any>): IQueryable<any> {
    return this.FromNexter((source) => {
      let outerResult: IteratorResultWithIndex<TSource>;
      let innerCollection: Iterator<any>;
      // Setup for first loop
      let innerResult: IteratorResult<any> = { done: true, value: undefined };

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
                index: outerResult.index
              };
            }
            // Get the inner collection
            innerCollection = selector(outerResult.value, outerResult.index)[Symbol.iterator]();
          }
          // Get next inner
        } while ((innerResult = innerCollection.next()).done);

        // Return inner
        return {
          value: (resultSelector ? resultSelector(innerResult.value, outerResult.index) : innerResult.value),
          done: false,
          index: outerResult.index
        };
      };
    });
  }

  public Take(count: number): IQueryable<TSource> {
    // Return selection iterator
    return this.FromNexter<TSource>((source) => {
      let remaining = count;
      let lastIndex = 0;
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

  Skip(count: number): IQueryable<TSource> {
    return NotImplemented();
  }

  TakeWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  SkipWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: QuerySelector<TSource, TKey>, innerKeySelector: QuerySelector<TInner, TKey>, resultSelector: (outer: TSource, inner: TInner) => TResult, comparer: IEqualityCompararer<TKey>): IQueryable<TResult> {
    return NotImplemented();
  }

  Concat(other: Iterable<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  Reverse(): IQueryable<TSource> {
    return NotImplemented();
  }

  GroupBy<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): IQueryable<IGrouping<TKey, TElement>> {
    return NotImplemented();
  }

  Distinct(comparer: IEqualityCompararer<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  Union(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  Intersect(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  Except(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource> {
    return NotImplemented();
  }

  public ToArray(): Array<TSource> {
    const arr: Array<TSource> = [];
    const source = this.IITer();

    let result: IteratorResult<TSource>;
    while (!(result = source.next()).done) {
      arr.push(result.value);
    };

    return arr;
  }

  AsIterable(): Iterable<TSource> {
    return { [Symbol.iterator]: () => this.IITer() };
  }

  ToMap<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): Map<TKey, TElement> {
    return NotImplemented();
  }

  OfType(type: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function"): IQueryable<TSource> {
    return NotImplemented();
  }

  Cast<TResult>(): IQueryable<TResult> {
    return NotImplemented();
  }

  SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityCompararer<TSource>): boolean {
    return NotImplemented();
  }

  First(predicate?: QueryPredicate<TSource>): TSource {
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

    if (n.done) { throw new Error("InvalidOperationException"); }
    return n.value;
  }

  FirstOrDefault(def?: TSource, predicate?: QueryPredicate<TSource>): TSource | undefined {
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

  public Any(predicate?: QueryPredicate<TSource>): boolean {
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