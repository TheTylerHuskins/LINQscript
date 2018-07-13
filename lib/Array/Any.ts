Array.prototype.Any = function <T>(callbackfn?: (item: T) => boolean): boolean {
    let match = false;
    callbackfn = callbackfn || (() => true);
    for (let idx = 0; (idx < this.length) && (!match); ++idx) {
        match = callbackfn(this[idx]);
    }
    return match;
};