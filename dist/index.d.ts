interface IteratorResultWithIndex<T> extends IteratorResult<T> {
    index: number;
}
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
interface QueryNexter<TResult> {
    (): IteratorResultWithIndex<TResult>;
}
interface QueryNexterBuilder<TSource, TResult> {
    (internalIterator: IndexedIterator<TSource>): QueryNexter<TResult>;
}
interface IEqualityCompararer<TKey> {
    (outerKey: TKey, innerKey: TKey): boolean;
}
interface IGrouping<TKey, TElement> extends Array<TElement> {
    Key: TKey;
}
interface IQueryable<TSource> {
    ForEach(callback: QueryCallback<TSource>): void;
    Where(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    Select<TResult>(selector: QuerySelector<TSource, TResult>): IQueryable<TResult>;
    SelectMany<TResult>(selector: QuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
    SelectMany<TInner, TResult>(selector: QuerySelector<TSource, Iterable<TInner>>, resultSelector: QuerySelector<TInner, TResult>): IQueryable<TResult>;
    SelectMany(selector: QuerySelector<any, Iterable<any>>, resultSelector?: QuerySelector<any, any>): IQueryable<any>;
    Take(count: number): IQueryable<TSource>;
    Skip(count: number): IQueryable<TSource>;
    TakeWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    SkipWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: QuerySelector<TSource, TKey>, innerKeySelector: QuerySelector<TInner, TKey>, resultSelector: (outer: TSource, inner: TInner) => TResult, comparer: IEqualityCompararer<TKey>): IQueryable<TResult>;
    Concat(other: Iterable<TSource>): IQueryable<TSource>;
    Reverse(): IQueryable<TSource>;
    GroupBy<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): IQueryable<IGrouping<TKey, TElement>>;
    Distinct(comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Union(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Intersect(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Except(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    ToArray(): Array<TSource>;
    AsIterable(): Iterable<TSource>;
    ToMap<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): Map<TKey, TElement>;
    OfType(type: "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): IQueryable<TSource>;
    Any(predicate?: QueryPredicate<TSource>): boolean;
}
declare class Queryable<TSource> implements IQueryable<TSource> {
    private GetNewSourceIterator;
    constructor(source: Iterable<TSource> | IndexedIteratorChain<TSource>);
    ForEach(callback: QueryCallback<TSource>): void;
    Where(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    Select<TResult>(selector: QuerySelector<TSource, TResult>): IQueryable<TResult>;
    SelectMany<TResult>(selector: QuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
    SelectMany<TInner, TResult>(selector: QuerySelector<TSource, Iterable<TInner>>, resultSelector: QuerySelector<TInner, TResult>): IQueryable<TResult>;
    Take<TSource>(count: number): IQueryable<TSource>;
    Skip(count: number): IQueryable<TSource>;
    TakeWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    SkipWhile(predicate: QueryPredicate<TSource>): IQueryable<TSource>;
    Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: QuerySelector<TSource, TKey>, innerKeySelector: QuerySelector<TInner, TKey>, resultSelector: (outer: TSource, inner: TInner) => TResult, comparer: IEqualityCompararer<TKey>): IQueryable<TResult>;
    Concat(other: Iterable<TSource>): IQueryable<TSource>;
    Reverse(): IQueryable<TSource>;
    GroupBy<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): IQueryable<IGrouping<TKey, TElement>>;
    Distinct(comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Union(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Intersect(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Except(other: Iterable<TSource>, comparer: IEqualityCompararer<TSource>): IQueryable<TSource>;
    ToArray(): Array<TSource>;
    AsIterable(): Iterable<TSource>;
    ToMap<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer: IEqualityCompararer<TKey>): Map<TKey, TElement>;
    OfType(type: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function"): IQueryable<TSource>;
    Any(predicate?: QueryPredicate<TSource>): boolean;
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
