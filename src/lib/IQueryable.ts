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

  SelectManyRecursive(selector: IQuerySelector<TSource, Iterable<TSource>>): IQueryable<TSource>

  /* == Restriction Operators == */

  /**
   * The Where operator filters a sequence based on a predicate.
   * 
   * MSDN: The Where operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if the predicate argument is null.
   * @param predicate
   */
  Where(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /* == Projection Operators == */

  /**
   * The Select operator performs a projection over a sequence.
   * 
   * MSDN: The Select operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if the selector argument is null.
   * @param selector
   */
  Select<TResult>(selector: IQuerySelector<TSource, TResult>): IQueryable<TResult>;

  /**
   * The SelectMany operator performs a one-to-many element projection over a sequence.
   * 
   * MSDN: The SelectMany operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if the selector argument is null.
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
   * MSDN: The Take operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if the count argument is null.
   * @param count
   */
  Take(count: number): IQueryable<TSource>;

  /**
   * The Skip operator skips a given number of elements from a sequence and then yields the remainder of the sequence.
   * 
   * MSDN: The Skip operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if the count argument is null.
   * @param count
   */
  Skip(count: number): IQueryable<TSource>;

  /**
   * The TakeWhile operator yields elements from a sequence while a test is true and then skips the remainder of the sequence.
   * 
   * MSDN:The TakeWhile operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if either argument is null.
   * 
   * When the object returned by TakeWhile is enumerated, it enumerates the source sequence, testing each element using the predicate function and yielding the element if the result was true. The enumeration stops when the predicate function returns false or the end of the source sequence is reached. The first argument of the predicate function represents the element to test. The second argument, if present, represents the zero-based index of the element within the source sequence.
   * @param predicate
   */
  TakeWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /**
   * The SkipWhile operator skips elements from a sequence while a test is true and then yields the remainder of the sequence.
   * 
   * MSDN: The SkipWhile operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if either argument is null.
   * 
   *  When the object returned by SkipWhile is enumerated, it enumerates the source sequence, testing each element using the predicate function and skipping the element if the result was true. Once the predicate function returns false for an element, that element and the remaining elements are yielded with no further invocations of the predicate function. If the predicate function returns true for all elements in the sequence, no elements are yielded. The first argument of the predicate function represents the element to test. The second argument, if present, represents the zero-based index of the element within the source sequence.
   * @param predicate
   */
  SkipWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;

  /* == Join Operators == */

  /**
   * The Join operator performs an inner join of two sequences based on matching keys extracted from the elements.
   * 
   * MSDN: When the object returned by Join is enumerated, it first enumerates the inner sequence and evaluates the innerKeySelector function once for each inner element, collecting the elements by their keys in a hash table. Once all inner elements and keys have been collected, the outer sequence is enumerated. For each outer element, the outerKeySelector function is evaluated and, if non-null, the resulting key is used to look up the corresponding inner elements in the hash table. For each matching inner element (if any), the resultSelector function is evaluated for the outer and inner element pair, and the resulting object is yielded.
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
   * MSDN:The Concat operator allocates and returns an enumerable object that captures the arguments passed to the operator. An ArgumentNullException is thrown if either argument is null.
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
   * MSDN: When the object returned by Distinct is enumerated, it enumerates the source sequence, yielding each element that has not previously been yielded. If a non-null comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param comparer
   */
  Distinct(comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Union operator produces the set union of two sequences.
   * 
   * MSDN: When the object returned by Union is enumerated, it enumerates the first and second sequences, in that order, yielding each element that has not previously been yielded. If a non-null comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param other
   * @param comparer
   */
  Union(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Intersect operator produces the set intersection of two sequences.
   * 
   * MSDN: When the object returned by Intersect is enumerated, it enumerates the first sequence, collecting all distinct elements of that sequence. It then enumerates the second sequence, marking those elements that occur in both sequences. It finally yields the marked elements in the order in which they were collected. If a non-null comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
   * @param other
   * @param comparer
   */
  Intersect(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;

  /**
   * The Except operator produces the set difference between two sequences.
   * 
   * MSDN: When the object returned by Except is enumerated, it enumerates the first sequence, collecting all distinct elements of that sequence. It then enumerates the second sequence, removing those elements that were also contained in the first sequence. It finally yields the remaining elements in the order in which they were collected. If a non-null comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used.
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
   * MSDN: The `ToMap` operator enumerates the source sequence and evaluates the keySelector and elementSelector functions for each element to produce that element's key and value. The resulting key and value pairs are returned in a `Map<TKey,TElement>`. If no elementSelector was specified, the value for each element is simply the element itself. An `"ArgumentNullException"` is thrown if the source, keySelector, or elementSelector argument is null or if a key value produced by keySelector is null. An `"ArgumentException"` is thrown if keySelector produces a duplicate key value for two elements. In the resulting `Map`, key values are compared using the given comparer, or, if a null comparer was specified, using the default equality comparer, `===`.
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
   * MSDN: The SequenceEqual operator enumerates the two source sequences in parallel and compares corresponding elements. If a non-null comparer argument is supplied, it is used to compare the elements. Otherwise the default equality comparer, `===`, is used
   * @param other
   * @param comparer
   */
  SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): boolean

  /* == Element Operators == */

  /**
   * The First operator returns the first element of a sequence.
   * 
   * MSDN: The First operator enumerates the source sequence and returns the first element for which the predicate function returns true. If no predicate function is specified, the First operator simply returns the first element of the sequence.
   * An ArgumentNullException is thrown if any argument is null. An InvalidOperationException is thrown if no element matches the predicate or if the source sequence is empty.
   * @param predicate
   */
  First(predicate?: IQueryPredicate<TSource>): TSource

  /**
   * The FirstOrDefault operator returns the first element of a sequence, or a default value if no element is found.
   * @param def
   * @param predicate
   */
  FirstOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined

  // ||||||||||||||||||||||||||||||||||||| RESUME HERE ||||||||||||||||||||||||||||||||||| ~McGhee


  /* == Quantifiers == */

  /**
   * The Any operator checks whether any element of a sequence satisfies a condition.
   * 
   * The Any operator enumerates the source sequence and returns true if any element satisfies the test given by the predicate.
   * If no predicate function is specified, the Any operator simply returns true if the source sequence contains any elements.
   */
  Any(predicate?: IQueryPredicate<TSource>): boolean;
}
