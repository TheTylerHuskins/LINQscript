/**
 * An iterator result that includes the index
 */
interface IteratorResultWithIndex<T> extends IteratorResult<T> {
    index: number;
}
/**
 * An iterator which returns a result with index
 */
interface IndexedIterator<T> extends Iterator<T> {
    next: () => IteratorResultWithIndex<T>;
}
interface IndexedIteratorChain<T> {
    (): IndexedIterator<T>;
}
interface QuerySelector<TSource, TResult> {
    (item: TSource, index: number): TResult;
}
interface QueryCallback<TSource> extends QuerySelector<TSource, void> {
}
interface QueryPredicate<TSource> extends QuerySelector<TSource, boolean> {
}
/**
 * Calls next on the internal iterator and returns the transformed item
 */
interface QueryNexter<TResult> {
    (): IteratorResultWithIndex<TResult>;
}
interface QueryNexterBuilder<TSource, TResult> {
    (internalIterator: IndexedIterator<TSource>): QueryNexter<TResult>;
}
interface IQueryable<TSource> {
    /**
     * Iterate and store values into a new array.
     */
    ToArray(): Array<TSource>;
    /**
     * Calls the callback function for each element in the sequence.
     * @param callback
     */
    ForEach(callback: QueryCallback<TSource>): void;
    /**
     * The Select operator performs a projection over a sequence.
     * @param selector
     */
    Select<TResult>(selector: QuerySelector<TSource, TResult>): Queryable<TResult>;
    /**
     * The SelectMany operator performs a one-to-many element projection over a sequence.
     * @param selector
     * @param resultSelector
     */
    SelectMany<TResult>(selector: QuerySelector<TSource, Iterable<TResult>>): Queryable<TResult>;
    SelectMany<TInner, TResult>(selector: QuerySelector<TSource, Iterable<TInner>>, resultSelector: QuerySelector<TInner, TResult>): Queryable<TResult>;
    SelectMany(selector: QuerySelector<any, Iterable<any>>, resultSelector?: QuerySelector<any, any>): Queryable<any>;
    /**
     * The Where operator filters a sequence based on a predicate.
     * @param predicate
     */
    Where(predicate: QueryPredicate<TSource>): Queryable<TSource>;
    /**
     * The Any operator checks whether any element of a sequence satisfies a condition.
     *
     * The Any operator enumerates the source sequence and returns true if any element satisfies the test given by the predicate.
     * If no predicate function is specified, the Any operator simply returns true if the source sequence contains any elements.
     */
    Any(predicate?: QueryPredicate<TSource>): boolean;
}
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
declare class Queryable<TSource> implements IQueryable<TSource> {
    private GetNewSourceIterator;
    constructor(source: Iterable<TSource> | IndexedIteratorChain<TSource>);
    ToArray(): Array<TSource>;
    ForEach(callback: QueryCallback<TSource>): void;
    Select<TResult>(selector: QuerySelector<TSource, TResult>): Queryable<TResult>;
    SelectMany<TResult>(selector: QuerySelector<TSource, Iterable<TResult>>): Queryable<TResult>;
    SelectMany<TInner, TResult>(selector: QuerySelector<TSource, Iterable<TInner>>, resultSelector: QuerySelector<TInner, TResult>): Queryable<TResult>;
    Where(predicate: QueryPredicate<TSource>): Queryable<TSource>;
    Any(predicate?: QueryPredicate<TSource>): boolean;
    /**
     * Constructs a Queryable from the given Nexter Builder.
     * The internal iterator comes from GetNewIterator, and is captured.
     * @param next
     */
    private QueryableFromNexter;
}
interface Array<T> extends IQueryable<T> {
}
interface IOwner {
    Name: string;
    Age: number;
    Registered: boolean;
    Pets: Array<string>;
}
interface IPerson {
    Name: string;
    Children: Array<IPerson>;
}
declare class TestQueryable {
    private Numbers;
    private Owners;
    private Persons;
    constructor();
    RunSuite(): void;
    OperationalTests(): void;
    SelectTests(): void;
    WhereTests(): void;
    ChainTests(): void;
    private ExecuteMatchTest;
    private ReportTest;
    private CreatePerson;
}
