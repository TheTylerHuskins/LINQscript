Array.prototype.Distinct = function <T>(): Array<T> {
    return this.filter((value, index) => { return this.indexOf(value) === index; });
};