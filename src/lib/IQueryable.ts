/**
 * Transforms an input item into an output item.
 * The input and output items can be different types.
 * 
 * @example dogs.Select( (dog, index) => String(index) + ':' + d.Name );
 * @example numbers.Select( n => n / 2 );
 */
export interface IQuerySelector<TSource, TResult> { (item: TSource, index: number): TResult };

/**
 * Callback function which takes an item and an index.
 * 
 * @example dogs.ForEach( (dog, index) => console.log(String(index) + ':' + d.Name) );
 */
export interface IQueryCallback<TSource> extends IQuerySelector<TSource, void> { };

/**
 * Function which tests an item for a condition.
 * 
 * @example dogs.Where( dog => dog.Name === 'Scruffy' );
 */
export interface IQueryPredicate<TSource> extends IQuerySelector<TSource, boolean> { };

/**
 * Standard predicates
 */
export class QueryPredicate {
  public static Always: IQueryPredicate<any> = () => true;
  public static Never: IQueryPredicate<any> = () => false;
  public static Truethy: IQueryPredicate<any> = (item) => !!item;
  public static Falsey: IQueryPredicate<any> = (item) => !item;
}

/**
 * Compares two items for equality
 */
export interface IEqualityComparer<T> { (a: T, b: T): boolean }

/**
 * Standard equality comparer
 */
export class EqualityComparer {
  public static Default: IEqualityComparer<any> = (a: any, b: any) => a === b;
}


export interface IGrouping<TKey, TElement> extends Array<TElement> {
  Key: TKey;
}

/**
 * The IQueryable interface strives to mirror the functionality provided by the .Net standard
 * query operator class 'System.Query.Sequence'
 * 
 * Note that much of the documentation has been taken from the link below, some has been adapted to better
 * describe implementation differences between C# and Javascript.
 * 
 * @see The .NET Standard Query Operators https://msdn.microsoft.com/en-us/library/bb394939.aspx
 */
export interface IQueryable<TSource> {

  /* == Nonstandard(LINQ) Operators */

  /**
   * Calls the callback function for each element in the sequence.
   * @param callback
   */
  ForEach(callback: IQueryCallback<TSource>): void;

  /**
   * Applies the selector on the root object and all children objects, and collects the results.
   * @param selector
   */
  SelectManyRecursive(selector: IQuerySelector<TSource, Iterable<TSource>>): IQueryable<TSource>

  /* == Restriction Operators == */

  /**
   * The Where operator filters a sequence based on a predicate.
   * 
   * MSDN: The Where operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the predicate argument is undefined.
   * @param predicate
   */
  Where(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /* == Projection Operators == */

  /**
   * The Select operator performs a projection over a sequence.
   * 
   * MSDN: The Select operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the selector argument is undefined.
   * @param selector
   */
  Select<TResult>(selector: IQuerySelector<TSource, TResult>): IQueryable<TResult>;

  /**
   * The SelectMany operator performs a one-to-many element projection over a sequence.
   * 
   * MSDN: The SelectMany operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the selector argument is undefined.
   * @param selector
   * @param resultSelector
   */
  SelectMany<TResult>(selector: IQuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
  SelectMany<TInner, TResult>(selector: IQuerySelector<TSource, Iterable<TInner>>, resultSelector: IQuerySelector<TInner, TResult>): IQueryable<TResult>;
  SelectMany(selector: IQuerySelector<any, Iterable<any>>, resultSelector?: IQuerySelector<any, any>): IQueryable<any>;

  /* == Partitioning Operators == */

  /**
   * The Take operator yields a given number of elements from a sequence and then skips the remainder of the sequence.
   * 
   * MSDN: The Take operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the count argument is undefined.
   * @param count
   */
  Take(count: number): IQueryable<TSource>;

  /**
   * The Skip operator skips a given number of elements from a sequence and then yields the remainder of the sequence.
   * 
   * MSDN: The Skip operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the count argument is undefined.
   * @param count
   */
  Skip(count: number): IQueryable<TSource>;

  /**
   * The TakeWhile operator yields elements from a sequence while a test is true and then skips the remainder of the sequence.
   * 
   * MSDN:The TakeWhile operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if either argument is undefined.
   * 
   * When the object returned by TakeWhile is enumerated, it enumerates the source sequence, testing each element using the predicate function and yielding the element if the result was true. The enumeration stops when the predicate function returns false or the end of the source sequence is reached. The first argument of the predicate function represents the element to test. The second argument, if present, represents the zero-based index of the element within the source sequence.
   * @param predicate
   */
  TakeWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /**
   * The SkipWhile operator skips elements from a sequence while a test is true and then yields the remainder of the sequence.
   * 
   * MSDN: The SkipWhile operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if either argument is undefined.
   * 
   *  When the object returned by SkipWhile is enumerated, it enumerates the source sequence, testing each element using the predicate function and skipping the element if the result was true. Once the predicate function returns false for an element, that element and the remaining elements are yielded with no further invocations of the predicate function. If the predicate function returns true for all elements in the sequence, no elements are yielded. The first argument of the predicate function represents the element to test. The second argument, if present, represents the zero-based index of the element within the source sequence.
   * @param predicate
   */
  SkipWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /* == Join Operators == */

  /**
   * The Join operator performs an inner join of two sequences based on matching keys extracted from the elements.
   * 
   * MSDN: When the object returned by Join is enumerated, it first enumerates the inner sequence and evaluates the innerKeySelector function once for each inner element, collecting the elements by their keys in a hash table. Once all inner elements and keys have been collected, the outer sequence is enumerated. For each outer element, the outerKeySelector function is evaluated and, if non-undefined, the resulting key is used to look up the corresponding inner elements in the hash table. For each matching inner element (if any), the resultSelector function is evaluated for the outer and inner element pair, and the resulting object is yielded.
   */
  Join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: IQuerySelector<TSource, TKey>,
    innerKeySelector: IQuerySelector<TInner, TKey>,
    resultSelector?: (outer: TSource, inner: TInner) => TResult,
    comparer?: IEqualityComparer<TKey>
  ): IQueryable<TResult>;
  // TODO: Join overloads

  // TODO: GroupJoin. Yeah. This sounds fun.

  /* == Concatenation Operator == */

  /**
   * The Concat operator concatenates two sequences.
   * 
   * MSDN:The Concat operator allocates and returns an enumerable object that captures the arguments passed to the operator. An `ArgumentUndefinedException` is thrown if the other argument is undefined.
   * 
   * When the object returned by Concat is enumerated, it enumerates the first sequence, yielding each element, and then it enumerates the second sequence, yielding each element.
   * @param other
   */
  Concat(other: Iterable<TSource>): IQueryable<TSource>

  /* == Ordering Operators == */

  // TODO: OrderBy and ThenBy and OrderByDescending and ThenByDescending
  // Honestly I have no idea how we are going to mirror ThenBy/Descending.
  // My question: How does ThenBy know what order OrderBy ordered by?!
  // Eg: OrderBy(A).ThenBy(B)
  // How does ThenBy not screw up the A ordering?

  /**
   * The Reverse operator reverses the elements of a sequence.
   * 
   * MSDN: When the object returned by Reverse is enumerated, it enumerates the source sequence, collecting all elements, and then yields the elements of the source sequence in reverse order.
   */
  Reverse(): IQueryable<TSource>;

  /* == Grouping Operators == */

  /**
   * The GroupBy operator groups the elements of a sequence.
   * 
   * MSDN: When the object returned by GroupBy is enumerated, it enumerates source and evaluates the keySelector and elementSelector (if present) functions once for each source element. Once all key and destination element pairs have been collected, a sequence of IGrouping<TKey, TElement> instances are yielded. Each IGrouping<TKey, TElement> instance represents a sequence of destination elements with a particular key value. The groupings are yielded in the order in which their key values first occurred in the source sequence, and destination elements within a grouping are yielded in the order in which their source elements occurred in the source sequence. When creating the groupings, key values are compared using the given comparer
   * @param keySelector
   * @param elementSelector
   * @param comparer
   */
  GroupBy<TKey, TElement>(
    keySelector: IQuerySelector<TSource, TKey>,
    elementSelector: IQuerySelector<TSource, TElement>,
    comparer?: IEqualityComparer<TKey>
  ): IQueryable<IGrouping<TKey, TElement>>;
  // TODO: GroupBy Overloads

  /* == Set Operators == */

  /**
   * The Distinct operator eliminates duplicate elements from a sequence.
   * 
   * MSDN: When the object returned by Distinct is enumerated, it enumerates the source sequence, yielding each element that has not previously been yielded. If a non-undefined comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param comparer
   */
  Distinct(comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Union operator produces the set union of two sequences.
   * 
   * MSDN: When the object returned by Union is enumerated, it enumerates the first and second sequences, in that order, yielding each element that has not previously been yielded. If a non-undefined comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param other
   * @param comparer
   */
  Union(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Intersect operator produces the set intersection of two sequences.
   * 
   * MSDN: When the object returned by Intersect is enumerated, it enumerates the first sequence, collecting all distinct elements of that sequence. It then enumerates the second sequence, marking those elements that occur in both sequences. It finally yields the marked elements in the order in which they were collected. If a non-undefined comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param other
   * @param comparer
   */
  Intersect(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Except operator produces the set difference between two sequences.
   * 
   * MSDN: When the object returned by Except is enumerated, it enumerates the first sequence, collecting all distinct elements of that sequence. It then enumerates the second sequence, removing those elements that were also contained in the first sequence. It finally yields the remaining elements in the order in which they were collected. If a non-undefined comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param other
   * @param comparer
   */
  Except(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /* == Conversion Operators == */

  /**
   * The ToArray operator creates an array from a sequence.
   */
  ToArray(): Array<TSource>;

  /**
   * The AsIterable operator returns its argument typed as Iterable<TSource>.
   */
  AsIterable(): Iterable<TSource>;

  /**
   * 
   * MSDN: The `ToMap` operator enumerates the source sequence and evaluates the keySelector and elementSelector functions for each element to produce that element's key and value. The resulting key and value pairs are returned in a `Map<TKey,TElement>`. If no elementSelector was specified, the value for each element is simply the element itself. An `"ArgumentUndefinedException"` is thrown if the source, keySelector, or elementSelector argument is undefined or if a key value produced by keySelector is undefined. An `"ArgumentException"` is thrown if keySelector produces a duplicate key value for two elements. In the resulting `Map`, key values are compared using the given comparer, or, if a undefined comparer was specified, using the default equality comparer, `===`.
   * @param keySelector
   * @param elementSelector
   * @param comparer
   */
  ToMap<TKey, TElement>(
    keySelector: IQuerySelector<TSource, TKey>,
    elementSelector?: IQuerySelector<TSource, TElement>,
    comparer?: IEqualityComparer<TKey>
  ): Map<TKey, TElement>;

  // TODO: ToLookup?

  /**
   * The OfType operator filters the elements of a sequence based on a type.
   * @param type
   */
  OfType(type: "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): IQueryable<TSource>;

  /**
   * The Cast operator casts the elements of a sequence to a given type.
   */
  Cast<TResult>(): IQueryable<TResult>;

  /* == Equality Operator == */

  /**
   * The SequenceEqual operator checks whether two sequences are equal.
   * 
   * MSDN: The SequenceEqual operator enumerates the two source sequences in parallel and compares corresponding elements. If a non-undefined comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used
   * @param other
   * @param comparer
   */
  SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): boolean

  /* == Element Operators == */

  /**
   * The First operator returns the first element of a sequence.
   * 
   * MSDN: The First operator enumerates the source sequence and returns the first element for which the predicate function returns true. If no predicate function is specified, the First operator simply returns the first element of the sequence.
   * 
   * An `ArgumentUndefinedException` is thrown if any argument is undefined. An InvalidOperationException is thrown if no element matches the predicate or if the source sequence is empty.
   * @param predicate
   */
  First(predicate?: IQueryPredicate<TSource>): TSource

  /**
   * The FirstOrDefault operator returns the first element of a sequence, or a default value if no element is found.
   * @param def
   * @param predicate
   */
  FirstOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined

  /**
   * The Last operator returns the last element of a sequence.
   * 
   * MSDN: The Last operator enumerates the source sequence and returns the last element for which the predicate function returned true. If no predicate function is specified, the Last operator simply returns the last element of the sequence.
   * 
   * An `ArgumentUndefinedException` is thrown if any argument is undefined. An InvalidOperationException is thrown if no element matches the predicate or if the source sequence is empty.
   * @param predicate
   */
  Last(predicate?: IQueryPredicate<TSource>): TSource;

  /**
   * The LastOrDefault operator returns the last element of a sequence, or a default value if no element is found.
   * 
   * MSDN: The LastOrDefault operator enumerates the source sequence and returns the last element for which the predicate function returned true. If no predicate function is specified, the LastOrDefault operator simply returns the last element of the sequence.
   * 
   * An `ArgumentUndefinedException` is thrown if any argument is undefined. If no element matches the predicate or if the source sequence is empty, the default value is returned.
   * @param def
   * @param predicate
   */
  LastOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined;

  /**
   * The Single operator returns the single element of a sequence.
   * 
   * MSDN: The Single operator enumerates the source sequence and returns the single element for which the predicate function returned true. If no predicate function is specified, the Single operator simply returns the single element of the sequence.
   * 
   * An `ArgumentUndefinedException` is thrown if any argument is undefined. An InvalidOperationException is thrown if the source sequence contains no matching element or more than one matching element.
   * @param predicate
   */
  Single(predicate?: IQueryPredicate<TSource>): TSource;

  /**
   * The SingleOrDefault operator returns the single element of a sequence, or a default value if no element is found.
   * 
   * MSDN: The SingleOrDefault operator enumerates the source sequence and returns the single element for which the predicate function returned true. If no predicate function is specified, the SingleOrDefault operator simply returns the single element of the sequence.
   * 
   * An `ArgumentUndefinedException` is thrown if any argument is undefined. An InvalidOperationException is thrown if the source sequence contains more than one matching element. If no element matches the predicate or if the source sequence is empty, the default value is returned.
   * @param def
   * @param predicate
   */
  SingleOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined;

  /**
   * The ElementAt operator returns the element at a given index in a sequence.
   * 
   * MSDN: The ElementAt operator first checks whether the source sequence is an array. If it is, the source array is used to obtain the element at the given index. Otherwise, the source sequence is enumerated until index elements have been skipped, and the element found at that position in the sequence is returned.
   * 
   * An ArgumentOutOfRangeException is thrown if the index is less than zero or greater than or equal to the number of elements in the sequence.
   * @param index
   */
  ElementAt(index: number): TSource;

  /**
   * The ElementAtOrDefault operator returns the element at a given index in a sequence, or a default value if the index is out of range.
   * 
   * MSDN: The ElementAt operator first checks whether the source sequence is an array. If it is, the source array is used to obtain the element at the given index. Otherwise, the source sequence is enumerated until index elements have been skipped, and the element found at that position in the sequence is returned. If the index is less than zero or greater than or equal to the number of elements in the sequence, the default value is returned.
   * @param index
   * @param def
   */
  ElementAtOrDefault(index: number, def?: TSource): TSource | undefined;

  /**
   * The DefaultIfEmpty operator supplies a default element for an empty sequence.
   * 
   * MSDN: The DefaultIfEmpty operator allocates and returns an enumerable object that captures the arguments passed to the operator.
   * 
   * When the object returned by DefaultIfEmpty is enumerated, it enumerates the source sequence and yields its elements. If the source sequence is empty, a single element with the given default value is yielded. If no default value argument is specified, undefined is yielded in place of an empty sequence.
   * @param def
   */
  DefaultIfEmpty(def?: TSource): IQueryable<TSource | undefined>

  /* == Generation Operators == */
  // @see Query function in index.ts

  /* == Quantifiers == */

  /**
   * The Any operator checks whether any element of a sequence satisfies a condition.
   * 
   * The Any operator enumerates the source sequence and returns true if any element satisfies the test given by the predicate.
   * If no predicate function is specified, the Any operator simply returns true if the source sequence contains any elements.
   */
  Any(predicate?: IQueryPredicate<TSource>): boolean;

  /**
   * The All operator checks whether all elements of a sequence satisfy a condition.
   * 
   * MSDN: The All operator enumerates the source sequence and returns true if no element fails the test given by the predicate.
   * 
   * The enumeration of the source sequence is terminated as soon as the result is known.
   * 
   * An `ArgumentUndefinedException` is thrown if the predicate argument is undefined.
   * 
   * The All operator returns true for an empty sequence. This is consistent with established predicate logic and other query languages such as SQL.
   * @param predicate
   */
  All(predicate: IQueryPredicate<TSource>): boolean;

  /**
   * The Contains operator checks whether a sequence contains a given element.
   * 
   * MSDN: The Contains operator first checks whether the source sequence is an array and if no comparer is given. If both are true, the `includes` method of the array is invoked to obtain the result. Otherwise, the source sequence is enumerated to determine if it contains an element with the given value. If a matching element is found, the enumeration of the source sequence is terminated at that point.
   * 
   * If a non-undefined comparer argument is supplied, it is used to compare the elements to the given value. Otherwise the default equality comparer, `===`, is used.
   * @param value
   * @param comparer
   */
  Contains(value: TSource, comparer?: IEqualityComparer<TSource>): boolean;

  /* == Aggregate Operators == */

  /**
   * The Count operator counts the number of elements in a sequence.
   * 
   * MSDN: The Count operator without a predicate first checks whether the source sequence is an array and if no comparer is given. If both are true, then the `length` method of the array is used to obtain the element count. Otherwise, the source sequence is enumerated to count the number of elements.
   * 
   * The Count operator with a predicate enumerates the source sequence and counts the number of elements for which the predicate function returns true.
   * @param predicate
   */
  Count(predicate?: IQueryPredicate<TSource>): number;

  /**
   * The Sum operator computes the sum of a sequence of numeric values.
   * 
   * MSDN: The Sum operator enumerates the source sequence, invokes the selector function for each element, and computes the sum of the resulting values. If no selector function is specified, the sum of the elements themselves is computed.
   * 
   * The Sum operator returns zero for an empty sequence. Furthermore, the operator does not include undefined values in the result.
   * @param selector
   */
  Sum(selector: IQuerySelector<TSource, number | undefined>): number;

  /**
   * The Min operator finds the minimum of a sequence.
   * 
   * MSDN: The Min operator enumerates the source sequence, invokes the selector function for each element, and finds the minimum of the resulting values. If no selector function is specified, the minimum of the elements themselves is computed.
   * 
   * The Min operator returns undefined for an empty sequence.
   * @param selector
   */
  Min<TResult>(selector: IQuerySelector<TSource, TResult>): TResult | undefined;


  /**
   * The Max operator finds the maximum of a sequence.
   * 
   * MSDN: The Max operator enumerates the source sequence, invokes the selector function for each element, and finds the maximum of the resulting values. If no selector function is specified, the maximum of the elements themselves is computed.
   * 
   * The Max operator returns undefined for an empty sequence.
   * @param selector
   */
  Max<TResult>(selector: IQuerySelector<TSource, TResult>): TResult | undefined;

  /**
  * The Average operator computes the average of a sequence of numeric values.
  * 
  * MSDN: The Average operator enumerates the source sequence, invokes the selector function for each element, and computes the average of the resulting values. If no selector function is specified, the average of the elements themselves is computed.
  * 
  * The Average operator returns undefined for an empty sequence. Furthermore, the operator does not include undefined values in the result.
  * @param selector
  */
  Average(selector: IQuerySelector<TSource, number | undefined>): number;

  /**
   * The Aggregate operator applies a function over a sequence.
   * 
   * MSDN: The Aggregate operators with a seed value start by assigning the seed value to an internal accumulator. They then enumerate the source sequence, repeatedly computing the next accumulator value by invoking the specified function with the current accumulator value as the first argument and the current sequence element as the second argument. The operator without a result selector returns the final accumulator value as the result. The operator with a result selector passes the final accumulator value to the supplied result selector and returns the resulting value. An `ArgumentUndefinedException` is thrown if the func argument is undefined.
   * 
   * The Aggregate operator without a seed value uses the first element of the source sequence as the seed value, but otherwise functions as described above. If the source sequence is empty, the Aggregate operator without a seed value throws an InvalidOperationException.
   * @param func
   * @param seed
   * @param selector
   */
  Aggregate<TAccumulate, TResult>(func: (accumulator: TAccumulate, element: TSource) => TAccumulate, seed?: TAccumulate, selector?: IQuerySelector<TAccumulate, TResult>): void;
}
