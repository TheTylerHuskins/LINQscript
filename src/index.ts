import { IQueryable } from "./lib/IQueryable";
import { Queryable } from "./lib/Queryable";

export { IQueryable, IEqualityCompararer, IGrouping, QueryCallback, QueryPredicate, QuerySelector } from "./lib/IQueryable";


export function Query<T>(source: Iterable<T>): IQueryable<T> {
  return new Queryable(source);
};