export interface IQuerySelector<TSource, TResult> {
    (item: TSource, index: number): TResult;
}
export interface IQueryCallback<TSource> extends IQuerySelector<TSource, void> {
}
export interface IQueryPredicate<TSource> extends IQuerySelector<TSource, boolean> {
}
export declare class QueryPredicate {
    static Always: IQueryPredicate<any>;
    static Never: IQueryPredicate<any>;
    static Truethy: IQueryPredicate<any>;
    static Falsey: IQueryPredicate<any>;
}
export interface IEqualityComparer<T> {
    (a: T, b: T): boolean;
}
export declare class EqualityComparer {
    static Default: IEqualityComparer<any>;
}
export interface IGrouping<TKey, TElement> extends Array<TElement> {
    Key: TKey;
}
export interface IQueryable<TSource> {
    ForEach(callback: IQueryCallback<TSource>): void;
    SelectManyRecursive(selector: IQuerySelector<TSource, Iterable<TSource>>): IQueryable<TSource>;
    Where(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;
    Select<TResult>(selector: IQuerySelector<TSource, TResult>): IQueryable<TResult>;
    SelectMany<TResult>(selector: IQuerySelector<TSource, Iterable<TResult>>): IQueryable<TResult>;
    SelectMany<TInner, TResult>(selector: IQuerySelector<TSource, Iterable<TInner>>, resultSelector: IQuerySelector<TInner, TResult>): IQueryable<TResult>;
    SelectMany(selector: IQuerySelector<any, Iterable<any>>, resultSelector?: IQuerySelector<any, any>): IQueryable<any>;
    Take(count: number): IQueryable<TSource>;
    Skip(count: number): IQueryable<TSource>;
    TakeWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;
    SkipWhile(predicate: IQueryPredicate<TSource>): IQueryable<TSource>;
    Join<TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: IQuerySelector<TSource, TKey>, innerKeySelector: IQuerySelector<TInner, TKey>, resultSelector?: (outer: TSource, inner: TInner) => TResult, comparer?: IEqualityComparer<TKey>): IQueryable<TResult>;
    Concat(other: Iterable<TSource>): IQueryable<TSource>;
    Reverse(): IQueryable<TSource>;
    GroupBy<TKey, TElement>(keySelector: IQuerySelector<TSource, TKey>, elementSelector: IQuerySelector<TSource, TElement>, comparer?: IEqualityComparer<TKey>): IQueryable<IGrouping<TKey, TElement>>;
    Distinct(comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;
    Union(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;
    Intersect(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;
    Except(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IQueryable<TSource>;
    ToArray(): Array<TSource>;
    AsIterable(): Iterable<TSource>;
    ToMap<TKey, TElement>(keySelector: IQuerySelector<TSource, TKey>, elementSelector?: IQuerySelector<TSource, TElement>, comparer?: IEqualityComparer<TKey>): Map<TKey, TElement>;
    OfType(type: "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): IQueryable<TSource>;
    Cast<TResult>(): IQueryable<TResult>;
    SequenceEqual(other: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): boolean;
    First(predicate?: IQueryPredicate<TSource>): TSource;
    FirstOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined;
    Last(predicate?: IQueryPredicate<TSource>): TSource;
    LastOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined;
    Single(predicate?: IQueryPredicate<TSource>): TSource;
    SingleOrDefault(def?: TSource, predicate?: IQueryPredicate<TSource>): TSource | undefined;
    ElementAt(index: number): TSource;
    ElementAtOrDefault(index: number, def?: TSource): TSource | undefined;
    DefaultIfEmpty(def?: TSource): IQueryable<TSource | undefined>;
    Any(predicate?: IQueryPredicate<TSource>): boolean;
    All(predicate: IQueryPredicate<TSource>): boolean;
    Contains(value: TSource, comparer?: IEqualityComparer<TSource>): boolean;
    Count(predicate?: IQueryPredicate<TSource>): number;
    Sum(selector: IQuerySelector<TSource, number | undefined>): number;
    Min<TResult>(selector: IQuerySelector<TSource, TResult>): TResult | undefined;
    Max<TResult>(selector: IQuerySelector<TSource, TResult>): TResult | undefined;
    Average(selector: IQuerySelector<TSource, number | undefined>): number;
    Aggregate<TAccumulate, TResult>(func: (accumulator: TAccumulate, element: TSource) => TAccumulate, seed?: TAccumulate, selector?: IQuerySelector<TAccumulate, TResult>): void;
}
