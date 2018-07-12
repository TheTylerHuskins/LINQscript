"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DogBreed;
(function (DogBreed) {
    DogBreed[DogBreed["AlaskanMalamute"] = 0] = "AlaskanMalamute";
    DogBreed[DogBreed["Beagle"] = 1] = "Beagle";
    DogBreed[DogBreed["Chihuahua"] = 2] = "Chihuahua";
    DogBreed[DogBreed["Dachshund"] = 3] = "Dachshund";
    DogBreed[DogBreed["Entlebucher"] = 4] = "Entlebucher";
    DogBreed[DogBreed["FrenchBulldog"] = 5] = "FrenchBulldog";
    DogBreed[DogBreed["GermanShepherd"] = 6] = "GermanShepherd";
    DogBreed[DogBreed["Hokkaido"] = 7] = "Hokkaido";
    DogBreed[DogBreed["ItalianGreyhound"] = 8] = "ItalianGreyhound";
    DogBreed[DogBreed["Jagdterrier"] = 9] = "Jagdterrier";
    DogBreed[DogBreed["KaiKen"] = 10] = "KaiKen";
    DogBreed[DogBreed["LabradorRetriever"] = 11] = "LabradorRetriever";
    DogBreed[DogBreed["MountainCur"] = 12] = "MountainCur";
    DogBreed[DogBreed["Norrbottenspets"] = 13] = "Norrbottenspets";
    DogBreed[DogBreed["Otterhound"] = 14] = "Otterhound";
    DogBreed[DogBreed["PembrokeWelshCorgi"] = 15] = "PembrokeWelshCorgi";
    DogBreed[DogBreed["RatTerrier"] = 16] = "RatTerrier";
    DogBreed[DogBreed["Schipperke"] = 17] = "Schipperke";
    DogBreed[DogBreed["Vizsla"] = 18] = "Vizsla";
    DogBreed[DogBreed["WorkingKelpie"] = 19] = "WorkingKelpie";
    DogBreed[DogBreed["Xoloitzcuintli"] = 20] = "Xoloitzcuintli";
    DogBreed[DogBreed["YorkshireTerrier"] = 21] = "YorkshireTerrier";
})(DogBreed = exports.DogBreed || (exports.DogBreed = {}));
var Dog = /** @class */ (function () {
    function Dog(Name, Age, Breed) {
        this.Name = Name;
        this.Age = Age;
        this.Breed = Breed;
    }
    Dog.StandardDogArray = function () {
        return [
            new Dog("Alpha", 1, DogBreed.AlaskanMalamute),
            new Dog("Beta", 2, DogBreed.Beagle),
            new Dog("Gamma", 3, DogBreed.Chihuahua),
            new Dog("Delta", 4, DogBreed.Dachshund),
            new Dog("Epsilon", 5, DogBreed.Entlebucher),
            new Dog("Zeta", 6, DogBreed.FrenchBulldog),
            new Dog("Eta", 7, DogBreed.GermanShepherd),
            new Dog("Theta", 8, DogBreed.Hokkaido),
            new Dog("Iota", 9, DogBreed.ItalianGreyhound),
            new Dog("Kappa", 10, DogBreed.Jagdterrier),
            new Dog("Lambda", 11, DogBreed.KaiKen),
            new Dog("Mu", 12, DogBreed.LabradorRetriever),
            new Dog("Nu", 13, DogBreed.MountainCur),
            new Dog("Xi", 14, DogBreed.Norrbottenspets),
            new Dog("Omicron", 15, DogBreed.Otterhound),
            new Dog("Pi", 16, DogBreed.PembrokeWelshCorgi),
            new Dog("Rho", 17, DogBreed.RatTerrier),
            new Dog("Sigma", 18, DogBreed.Schipperke),
            new Dog("Tau", 19, DogBreed.Vizsla),
            new Dog("Upsilon", 20, DogBreed.WorkingKelpie),
            new Dog("Phi", 21, DogBreed.Xoloitzcuintli),
            new Dog("Chi", 22, DogBreed.YorkshireTerrier)
        ];
    };
    return Dog;
}());
exports.Dog = Dog;
var DogOwner = /** @class */ (function () {
    function DogOwner(Name, Dogs) {
        this.Name = Name;
        this.Dogs = Dogs;
    }
    DogOwner.StandardOwnerArray = function () {
        var dogs = Dog.StandardDogArray();
        return [
            new DogOwner("Betty", [dogs[0], dogs[1]]),
            new DogOwner("Mark", [dogs[2], dogs[3], dogs[4]]),
            new DogOwner("Derek", [dogs[5]])
        ];
    };
    return DogOwner;
}());
exports.DogOwner = DogOwner;
