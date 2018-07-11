
export enum DogBreed {
  AlaskanMalamute,
  Beagle,
  Chihuahua,
  Dachshund,
  Entlebucher,
  FrenchBulldog,
  GermanShepherd,
  Hokkaido,
  ItalianGreyhound,
  Jagdterrier,
  KaiKen,
  LabradorRetriever,
  MountainCur,
  Norrbottenspets,
  Otterhound,
  PembrokeWelshCorgi,
  RatTerrier,
  Schipperke,
  Vizsla,
  WorkingKelpie,
  Xoloitzcuintli,
  YorkshireTerrier
}

export class Dog {
  public static StandardDogArray(): Array<Dog> {
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
  }
  public constructor(public Name: string, public Age: number, public Breed: DogBreed) { }
}

export class DogOwner {
  public static StandardOwnerArray(): Array<DogOwner> {
    let dogs = Dog.StandardDogArray();
    return [
      new DogOwner("Betty", [dogs[0], dogs[1]]),
      new DogOwner("Mark", [dogs[2], dogs[3], dogs[4]]),
      new DogOwner("Derek", [dogs[5]])
    ]
  }
  public constructor(public Name: string, public Dogs: Array<Dog>) { }
}
