import { IQueryable } from './IQueryable';
export declare function Query<T>(source: Iterable<T>): IQueryable<T>;
export declare namespace Query {
    function Range(start: number, count: number): IQueryable<number>;
    function Repeat<TResult>(element: TResult, count: number): IQueryable<TResult>;
    function Empty(): IQueryable<never>;
}
