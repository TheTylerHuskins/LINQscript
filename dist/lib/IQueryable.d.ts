export interface QuerySelector<TSource, TResult> {
    (item: TSource, index: number): TResult;
}
export interface QueryCallback<TSource> extends QuerySelector<TSource, void> {
}
export interface QueryPredicate<TSource> extends QuerySelector<TSource, boolean> {
}
export interface QueryNexter<TResult> {
    (): IteratorResultWithIndex<TResult>;
}
export interface QueryNexterBuilder<TSource, TResult> {
    (internalIterator: IndexedIterator<TSource>): QueryNexter<TResult>;
}
export interface IEqualityCompararer<TKey> {
    (outerKey: TKey, innerKey: TKey): boolean;
}
export interface IGrouping<TKey, TElement> extends Array<TElement> {
    Key: TKey;
}
export interface IQueryable<TSource> {
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
    Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: QuerySelector<TSource, TKey>, innerKeySelector: QuerySelector<TInner, TKey>, resultSelector?: (outer: TSource, inner: TInner) => TResult, comparer?: IEqualityCompararer<TKey>): IQueryable<TResult>;
    Concat(other: Iterable<TSource>): IQueryable<TSource>;
    Reverse(): IQueryable<TSource>;
    GroupBy<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector: QuerySelector<TSource, TElement>, comparer?: IEqualityCompararer<TKey>): IQueryable<IGrouping<TKey, TElement>>;
    Distinct(comparer?: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Union(other: Iterable<TSource>, comparer?: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Intersect(other: Iterable<TSource>, comparer?: IEqualityCompararer<TSource>): IQueryable<TSource>;
    Except(other: Iterable<TSource>, comparer?: IEqualityCompararer<TSource>): IQueryable<TSource>;
    ToArray(): Array<TSource>;
    AsIterable(): Iterable<TSource>;
    ToMap<TKey, TElement>(keySelector: QuerySelector<TSource, TKey>, elementSelector?: QuerySelector<TSource, TElement>, comparer?: IEqualityCompararer<TKey>): Map<TKey, TElement>;
    OfType(type: "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): IQueryable<TSource>;
    Cast<TResult>(): IQueryable<TResult>;
    SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityCompararer<TSource>): boolean;
    First(predicate?: QueryPredicate<TSource>): TSource;
    FirstOrDefault(def?: TSource, predicate?: QueryPredicate<TSource>): TSource | undefined;
    Any(predicate?: QueryPredicate<TSource>): boolean;
}
