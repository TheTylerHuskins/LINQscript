"use strict";
Array.prototype.Select = function (selector) {
    var accumulator = [];
    for (var idx = 0, ilen = this.length; idx < ilen; ++idx) {
        accumulator.push(selector(this[idx], idx));
    }
    return accumulator;
};
