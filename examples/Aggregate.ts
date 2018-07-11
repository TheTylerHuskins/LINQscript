

export class Example_Aggregate {
  public Test(): boolean {

  }

  /**
   * Sums all the values in an array 1 to 5
   */
  public Example_Sum(): number {
    let list = [1, 2, 3, 4, 5];
    return list.Aggregate((a, i) => (a + i));
  }

  /**
   * Sums all the values in the array 1 to 5, starting with 10
   */
  public Example_SumInit(): number {
    let list = [1, 2, 3, 4, 5];
    return list.Aggregate((a, i) => (a + i), 10);
  }
}