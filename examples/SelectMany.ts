import { Dog, DogOwner } from "./Data";


export class Example_SelectMany {
  public Test(): boolean {
    // Todo
  }

  public Example_2Dto1D(): Array<Dog> {
    const list: Array<Array<Dog>> = [];
    list.push(Dog.StandardDogArray());
    list.push(Dog.StandardDogArray());

    // Alternates:
    // list.SelectMany(dogs => dogs);
    // list.SelectMany(dogs => dogs, (dogs, dog) => dog);
    return list.SelectMany();
  }

  /**
   * Transforms an array of owners into an array of dogs
   */
  public Example_Selector(): Array<Dog> {
    const list: Array<DogOwner> = DogOwner.StandardOwnerArray();

    // Alternates:
    // list.SelectMany(owner => owner.Dogs, (owner, dog) => dog);
    return list.SelectMany(owner => owner.Dogs);
  }

  /**
   * Transforms an array of owners into an array of Owner+Dog
   */
  public Example_ResultSelector(): Array<{ Owner: DogOwner, Dog: Dog }> {
    const list: Array<DogOwner> = DogOwner.StandardOwnerArray();

    return list.SelectMany(owner => owner.Dogs, (owner, dog) => {
      return { Owner: owner, Dog: dog };
    });
  }
}
