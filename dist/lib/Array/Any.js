"use strict";
Array.prototype.Any = function (callbackfn) {
    var match = false;
    callbackfn = callbackfn || (function () { return true; });
    for (var idx = 0; (idx < this.length) && (!match); ++idx) {
        match = callbackfn(this[idx]);
    }
    return match;
};
