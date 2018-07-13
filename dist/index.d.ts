interface Array<T> {
    /**
     * Applies an accumulator function over a sequence.
     * Returns undefined when array length is zero.
     * @param this Sequence to aggrigate over.
     * @param func An accumulator function to be invoked on each element.
     */
    Aggregate(this: Array<T>, func: (accumulator: T, item: T) => T): T | undefined;
    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
     * @param this Sequence to aggrigate over.
     * @param func An accumulator function to be invoked on each element.
     * @param seed The initial accumulator value.
     */
    Aggregate<TAccumulate>(this: Array<T>, func: (accumulator: TAccumulate, item: T) => TAccumulate, seed: TAccumulate): TAccumulate;
    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
     * @param this Sequence to aggrigate over.
     * @param func An accumulator function to be invoked on each element.
     * @param seed The initial accumulator value.
     * @param resultSelector A function to transform the final accumulator value into the result value.
     */
    Aggregate<TAccumulate, TResult>(this: Array<T>, func: (accumulator: TAccumulate, item: T) => TAccumulate, seed: TAccumulate, resultSelector: (accumulator?: TAccumulate) => TResult): TResult;
    /**
     * Projects each element of a sequence into a new form by incorporating the element's index.
     * @param this A sequence of values to project.
     * @param selector A transform function to apply to each element.
     */
    Select<TResult>(this: Array<T>, selector: (item: T, index?: number) => TResult): Array<TResult>;
    /**
     * Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.
     * @param this A sequence of values to project.
     * @param collectionSelector A transform function to apply to each element.
     * @param resultSelector A transform function to apply to each element of the intermediate sequence.
     */
    SelectMany<TIntermediate, TResult>(this: Array<T>, collectionSelector: (item: T) => Array<TIntermediate>, resultSelector: (item: T, child: TIntermediate) => TResult): Array<TResult>;
    /**
   * Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.
   * @param this A sequence of values to project.
   * @param collectionSelector A transform function to apply to each element.
   */
    SelectMany<TResult>(this: Array<T>, collectionSelector: (item: T) => Array<TResult>): Array<TResult>;
    /**
   * Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.
   * @param this A sequence of values to project.
   */
    SelectMany<TResult>(this: Array<Array<TResult>>): Array<TResult>;
    /**
     * Creates a copy of the array with elements from the first element to the amount specified.
     * @param amount amount of elements to select
     */
    Take(amount: number): Array<T>;
    /**
     * Returns the distinct elements of the array
     */
    Distinct(): Array<T>;
    /**
     * returns true if any of the elements in the array meet the callbackfn,
     * if no callbackfn is given it returns true if their are elements in the array
     * @param callbackfn
     */
    Any(callbackfn?: (item: T) => boolean): boolean;
}
