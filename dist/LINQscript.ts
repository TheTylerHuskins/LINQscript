
interface Array<T> {
  Distinct(): Array<T>;
  First(): T;
  FirstOrDefault(DefaultValue: T): T;
  Where(callbackfn: (value: T, index: number, array: Array<T>) => any, thisArg?: any): Array<T>;
  Any(callbackfn?: (item: T) => boolean): boolean;
  Take(amount: number): Array<T>;
}

/**
 * Remove Duplicates from the array
 */
Array.prototype.Distinct = function <T>(): Array<T> {
  return this.filter((value, index) => { return this.indexOf(value) === index; });
};

/**
 * Returns the first item in the array
 */
Array.prototype.First = function <T>(): T {
  return this[0];
};

/**
 * Returns the first item in the array 
 * OR
 * the specified default value if the array is empty
 */
Array.prototype.FirstOrDefault = function <T>(DefaultValue: T): T {
  return this.length > 0 ? this[0] : DefaultValue;
};

/**
 * Returns a subset of the array that meets the conditions in the callback funtion
 */
Array.prototype.Where = Array.prototype.filter;

/**
 * returns true if any of the elements in the array meet the callbackfn,
 * if no callbackfn is given it returns true if their are elements in the array
 */
Array.prototype.Any = function <T>(callbackfn?: (item: T) => boolean): boolean {
  let match = false;
  callbackfn = callbackfn || (() => true);
  for (let idx = 0; (idx < this.length) && (!match); ++idx) {
    match = callbackfn(this[idx]);
  }
  return match;
};

/**
 * takes from the start of the array the number of elements specified
 */
Array.prototype.Take = function <T>(amount: number): Array<T> {
  return this.slice(0, amount);
};
