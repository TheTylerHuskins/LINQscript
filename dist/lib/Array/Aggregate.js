"use strict";
Array.prototype.Aggregate = function (func, seed, resultSelector) {
    if (resultSelector === undefined) {
        // Using signatures:
        // - Aggregate(this: Array<T>, func: (accumulator: T, item: T) => T): T | undefined;
        // - Aggregate<TAccumulate>(this: Array<T>, func: (accumulator: TAccumulate, item: T) => TAccumulate, seed: TAccumulate): TAccumulate;
        // Result selector just return the accumulator
        resultSelector = function (acc) { return acc; };
    }
    var accumulator = seed;
    if (this.length > 0) {
        var idx = 0;
        if (accumulator === undefined) {
            // Using signature
            // - Aggregate(this: Array<T>, func: (accumulator: T, item: T) => T): T | undefined;
            // If no seed is given, seed is first value in array
            accumulator = this[idx++];
        }
        for (var ilen = this.length; idx < ilen; ++idx) {
            accumulator = func(accumulator, this[idx]);
        }
    }
    return resultSelector(accumulator);
};
