import { IQueryable } from "./lib/IQueryable";
export { IQueryable, IEqualityCompararer, IGrouping, QueryCallback, QueryPredicate, QuerySelector } from "./lib/IQueryable";
export declare function Query<T>(source: Iterable<T>): IQueryable<T>;
