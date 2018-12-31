interface IteratorResultWithIndex<T> extends IteratorResult<T> {
    index: number;
}
interface IndexedIterator<T> extends Iterator<T> {
    next(): IteratorResultWithIndex<T>;
}
interface IndexedIteratorChain<T> {
    (): IndexedIterator<T>;
}
