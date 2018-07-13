"use strict";
Array.prototype.Distinct = function () {
    var _this = this;
    return this.filter(function (value, index) { return _this.indexOf(value) === index; });
};
