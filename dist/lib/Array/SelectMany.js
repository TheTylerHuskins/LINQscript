"use strict";
Array.prototype.SelectMany = function (collectionSelector, resultSelector) {
    var accumulator = [];
    if (this.length === 0) {
        return accumulator;
    }
    if (collectionSelector == undefined) {
        // Using signature:
        // - SelectMany<TResult>(this: Array<Array<TResult>>): Array<TResult>
        // Selector should return each item
        collectionSelector = function (i) { return i; };
    }
    if (resultSelector === undefined) {
        // Using signatures:
        // - SelectMany<TResult>(this: Array<T>, collectionSelector: (item: T) => Array<TResult>): Array<TResult>;
        // - SelectMany<TResult>(this: Array<Array<TResult>>): Array<TResult>
        // Selector should return the child
        resultSelector = function (i, c) { return c; };
    }
    for (var idx = 0, ilen = this.length; idx < ilen; ++idx) {
        var item = this[idx];
        var itermediate = collectionSelector(item);
        for (var jdx = 0, jlen = itermediate.length; jdx < jlen; ++jdx) {
            accumulator.push(resultSelector(item, itermediate[jdx]));
        }
    }
    return accumulator;
};
