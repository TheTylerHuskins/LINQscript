
/**
 * An iterator result that includes the index
 */
interface IteratorResultWithIndex<T> extends IteratorResult<T> {
  index: number;
}

/**
 * An iterator which returns a result with index
 */
interface IndexedIterator<T> extends Iterator<T> {
  next: () => IteratorResultWithIndex<T>
};


interface IndexedIteratorChain<T> { (): IndexedIterator<T> }