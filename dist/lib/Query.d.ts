import { IQueryable } from "./IQueryable";
export declare function Query<T>(source: Iterable<T>): IQueryable<T>;
export declare namespace Query {
    function Range(start: number, count: number): IQueryable<number>;
    function Repeat(count: number): IQueryable<number>;
    function Empty(): IQueryable<never>;
}
