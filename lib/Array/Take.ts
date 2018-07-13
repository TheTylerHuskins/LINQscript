Array.prototype.Take = function <T>(amount: number): Array<T> {
    return this.slice(0, amount);
  };