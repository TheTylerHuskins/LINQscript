import { Dog } from "./Dog";


export class Example_Select {
  public Test(): boolean {

    let ageList = this.Example();
    for (let idx = 0; idx < ageList.length; ++idx) {
      if (ageList[idx] !== (idx + 1)) return false
    }
    return true;

  }

  public Example(): Array<number> {
    const list: Array<Dog> = Dog.StandardDogArray();

    // Select all ages
    return list.Select((pupper) => pupper.Age);
  }
}
