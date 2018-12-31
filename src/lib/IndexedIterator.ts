
/**
 * An iterator result that includes the index
 */
interface IteratorResultWithIndex<T> extends IteratorResult<T> {
  /**
   * Index number of the item
   */
  index: number;
}

/**
 * An iterator which returns a result with index
 */
interface IndexedIterator<T> extends Iterator<T> {
  /**
   * Gets the next item
   */
  next(): IteratorResultWithIndex<T>;
}

/**
 * The Iterator call chain has three purposes
 *
 * 1: Capture state. The builder can capture information that will impact how iteration is performed.
 *
 * 2: Allow multiple iterators. Calling the builder multiple times will return independant iterators.
 *
 * 3: Enable chaining operations. The result of next() can me manipulated and returned in another next().
 *
 * IteratorBuilder() => Iterator{next() => {done, index, value}}
 *
 * @example Basic use
 * const iterator = iteratorBuilder();
 * let result = iterator.next();
 * while(!result.done){
 * console.log( result.index, result.value );
 * result = iterator.next();
 * }
 *
 * @example Independant
 * const iteratorA = iteratorBuilder();
 * const iteratorB = iteratorBuilder();
 * let result = iteratorA.next();
 * while(!result.done){
 * console.log( result.index, result.value );
 * result = iteratorA.next();
 * }
 * console.log(iteratorB.next()); // Will print the first item
 *
 * @example Capture state
 * const sourceArray = [1,2,3]
 * // Builder captures sourceArray
 * const iteratorBuilderB = ()=>{
 *   let idx = -1;
 *   // Iterator captures idx
 *   return {next:()=>{
 *     if(++idx>sourceArray.length){
 *       return {done:true};
 *     } else {
 *       return {done:false, index:idx, value:sourceArray[idx]};
 *     }
 *   }}
 * }
 *
 * @example Chain, multiply by two
 * const iteratorA:IndexedIterator<number> = iteratorBuilderA();
 * const iteratorBuilderB = ()=>{
 *   return {next:()=>{
 *     const r:IteratorResultWithIndex<number> = iteratorA.next;
 *     if(!r.done) { r.value *= 2; }
 *     return r;
 *   }}
 * }
 *
 */
interface IndexedIteratorChain<T> { (): IndexedIterator<T>; }
