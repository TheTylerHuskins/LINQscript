export declare enum DogBreed {
    AlaskanMalamute = 0,
    Beagle = 1,
    Chihuahua = 2,
    Dachshund = 3,
    Entlebucher = 4,
    FrenchBulldog = 5,
    GermanShepherd = 6,
    Hokkaido = 7,
    ItalianGreyhound = 8,
    Jagdterrier = 9,
    KaiKen = 10,
    LabradorRetriever = 11,
    MountainCur = 12,
    Norrbottenspets = 13,
    Otterhound = 14,
    PembrokeWelshCorgi = 15,
    RatTerrier = 16,
    Schipperke = 17,
    Vizsla = 18,
    WorkingKelpie = 19,
    Xoloitzcuintli = 20,
    YorkshireTerrier = 21
}
export declare class Dog {
    Name: string;
    Age: number;
    Breed: DogBreed;
    static StandardDogArray(): Array<Dog>;
    constructor(Name: string, Age: number, Breed: DogBreed);
}
export declare class DogOwner {
    Name: string;
    Dogs: Array<Dog>;
    static StandardOwnerArray(): Array<DogOwner>;
    constructor(Name: string, Dogs: Array<Dog>);
}
