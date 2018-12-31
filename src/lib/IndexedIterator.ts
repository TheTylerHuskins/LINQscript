
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

interface IndexedIteratorChain<T> { (): IndexedIterator<T>; }
