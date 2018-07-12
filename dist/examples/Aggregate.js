"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Example_Aggregate = /** @class */ (function () {
    function Example_Aggregate() {
    }
    Example_Aggregate.prototype.Test = function () {
        // Todo
        return false;
    };
    /**
     * Sums all the values in an array 1 to 5
     */
    Example_Aggregate.prototype.Example_Sum = function () {
        var list = [1, 2, 3, 4, 5];
        return list.Aggregate(function (a, i) { return (a + i); });
    };
    /**
     * Sums all the values in the array 1 to 5, starting with 10
     */
    Example_Aggregate.prototype.Example_SumInit = function () {
        var list = [1, 2, 3, 4, 5];
        return list.Aggregate(function (a, i) { return (a + i); }, 10);
    };
    return Example_Aggregate;
}());
exports.Example_Aggregate = Example_Aggregate;
