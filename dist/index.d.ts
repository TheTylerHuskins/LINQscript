import { IQueryable } from "./lib/IQueryable";
export { IQueryable, IEqualityComparer, IGrouping, IQueryCallback, IQueryPredicate, IQuerySelector } from "./lib/IQueryable";
export declare function Query<T>(source: Iterable<T>): IQueryable<T>;
