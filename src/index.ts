import { IQueryable } from "./lib/IQueryable";
import { Queryable } from "./lib/Queryable";

export { IQueryable, IEqualityComparer, IGrouping, IQueryCallback, IQueryPredicate, IQuerySelector } from "./lib/IQueryable";


export function Query<T>(source: Iterable<T>): IQueryable<T> {
  return new Queryable(source);
};