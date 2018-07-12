"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("./Data");
var Example_Select = /** @class */ (function () {
    function Example_Select() {
    }
    Example_Select.prototype.Test = function () {
        var ageList = this.Example();
        for (var idx = 0; idx < ageList.length; ++idx) {
            if (ageList[idx] !== (idx + 1))
                return false;
        }
        return true;
    };
    Example_Select.prototype.Example = function () {
        var list = Data_1.Dog.StandardDogArray();
        // Select all ages
        return list.Select(function (pupper) { return pupper.Age; });
    };
    return Example_Select;
}());
exports.Example_Select = Example_Select;
