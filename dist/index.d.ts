interface IteratorResultWithIndex<T> extends IteratorResult<T> {
    index: number;
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
    ForEach(callback: (item: TSource, index: number) => void): void;
    /**
     * The Select operator performs a projection over a sequence.
     * @param selector
     */
    Select<TResult>(selector: (item: TSource, index: number) => TResult): Queryable<TResult>;
    /**
     * The SelectMany operator performs a one-to-many element projection over a sequence.
     * @param selector
     * @param resultSelector
     */
    SelectMany<TResult>(selector: (item: TSource, index: number) => Iterable<TResult>): Queryable<TResult>;
    /**
     * The Where operator filters a sequence based on a predicate.
     * @param predicate
     */
    Where(predicate: (item: TSource, index: number) => boolean): Queryable<TSource>;
    /**
     * The Any operator checks whether any element of a sequence satisfies a condition.
     *
     * The Any operator enumerates the source sequence and returns true if any element satisfies the test given by the predicate.
     * If no predicate function is specified, the Any operator simply returns true if the source sequence contains any elements.
     */
    Any(predicate?: (item: TSource, index: number) => boolean): boolean;
}
declare type IteratorChain<T> = () => () => IteratorResultWithIndex<T>;
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
    private GetNewIterator;
    constructor(source: Iterable<TSource> | IteratorChain<TSource>);
    ToArray(): Array<TSource>;
    ForEach(callback: (item: TSource, index: number) => void): void;
    Select<TResult>(selector: (item: TSource, index: number) => TResult): Queryable<TResult>;
    SelectMany<TResult>(selector: (item: TSource, index: number) => Iterable<TResult>): Queryable<TResult>;
    Where(predicate: (item: TSource, index: number) => boolean): Queryable<TSource>;
    Any(predicate?: (item: TSource, index: number) => boolean): boolean;
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
    private NumQuery;
    private OwnerQuery;
    private PersonQuery;
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
