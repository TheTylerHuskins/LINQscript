"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("./Data");
var Example_SelectMany = /** @class */ (function () {
    function Example_SelectMany() {
    }
    Example_SelectMany.prototype.Test = function () {
        // Todo
        return false;
    };
    Example_SelectMany.prototype.Example_2Dto1D = function () {
        var list = [];
        list.push(Data_1.Dog.StandardDogArray());
        list.push(Data_1.Dog.StandardDogArray());
        // Alternates:
        // list.SelectMany(dogs => dogs);
        // list.SelectMany(dogs => dogs, (dogs, dog) => dog);
        return list.SelectMany();
    };
    /**
     * Transforms an array of owners into an array of dogs
     */
    Example_SelectMany.prototype.Example_Selector = function () {
        var list = Data_1.DogOwner.StandardOwnerArray();
        // Alternates:
        // list.SelectMany(owner => owner.Dogs, (owner, dog) => dog);
        return list.SelectMany(function (owner) { return owner.Dogs; });
    };
    /**
     * Transforms an array of owners into an array of Owner+Dog
     */
    Example_SelectMany.prototype.Example_ResultSelector = function () {
        var list = Data_1.DogOwner.StandardOwnerArray();
        return list.SelectMany(function (owner) { return owner.Dogs; }, function (owner, dog) {
            return { Owner: owner, Dog: dog };
        });
    };
    return Example_SelectMany;
}());
exports.Example_SelectMany = Example_SelectMany;
