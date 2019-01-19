(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["LinqScript"] = factory();
	else
		root["LinqScript"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Query */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_Query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Query */ "./src/lib/Query.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return _lib_Query__WEBPACK_IMPORTED_MODULE_0__["Query"]; });




/***/ }),

/***/ "./src/lib/IQueryable.ts":
/*!*******************************!*\
  !*** ./src/lib/IQueryable.ts ***!
  \*******************************/
/*! exports provided: QueryPredicate, EqualityComparer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryPredicate", function() { return QueryPredicate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqualityComparer", function() { return EqualityComparer; });
let QueryPredicate = {
    Always: (() => true),
    Never: (() => false),
    Truethy: ((item) => !!item),
    Falsey: ((item) => !item)
};
let EqualityComparer = {
    Default: ((a, b) => a === b)
};


/***/ }),

/***/ "./src/lib/Query.ts":
/*!**************************!*\
  !*** ./src/lib/Query.ts ***!
  \**************************/
/*! exports provided: Query */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return Query; });
/* harmony import */ var _Queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Queryable */ "./src/lib/Queryable.ts");

function Query(source) {
    return new _Queryable__WEBPACK_IMPORTED_MODULE_0__["Queryable"](source);
}
(function (Query) {
    function Range(start, count) {
        if ((count < 0) || ((start + count + 1) > Number.MAX_SAFE_INTEGER)) {
            throw new Error('ArgumentOutOfRangeException');
        }
        return new _Queryable__WEBPACK_IMPORTED_MODULE_0__["Queryable"](() => {
            let idx = -1;
            return {
                next: () => {
                    const done = (idx >= count);
                    if (!done) {
                        ++idx;
                    }
                    return {
                        done,
                        index: idx,
                        value: start + idx
                    };
                }
            };
        });
    }
    Query.Range = Range;
    function Repeat(element, count) {
        if (count < 0) {
            throw new Error('ArgumentOUtOfRangeException');
        }
        return new _Queryable__WEBPACK_IMPORTED_MODULE_0__["Queryable"](() => {
            const result = {
                done: false,
                index: 0,
                value: element
            };
            return {
                next: () => {
                    if (result.index++ >= count) {
                        result.done = true;
                        result.value = undefined;
                    }
                    return result;
                }
            };
        });
    }
    Query.Repeat = Repeat;
    function Empty() {
        return new _Queryable__WEBPACK_IMPORTED_MODULE_0__["Queryable"]([]);
    }
    Query.Empty = Empty;
})(Query || (Query = {}));


/***/ }),

/***/ "./src/lib/Queryable.ts":
/*!******************************!*\
  !*** ./src/lib/Queryable.ts ***!
  \******************************/
/*! exports provided: Queryable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Queryable", function() { return Queryable; });
/* harmony import */ var _IQueryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IQueryable */ "./src/lib/IQueryable.ts");

const AssertArgument = (arg) => { if (arg == null) {
    throw new Error('ArgumentUndefinedException');
} };
const ThrowNotImplemented = () => { throw new Error('Method not implemented!'); };
class Queryable {
    constructor(source) {
        AssertArgument(source);
        if (typeof (source) === 'function') {
            this.IITer = source;
        }
        else {
            this.NativeSource = source;
            this.IITer = () => {
                const sourceIterator = source[Symbol.iterator]();
                let sourceIndex = 0;
                return {
                    next: () => {
                        const nextItem = sourceIterator.next();
                        if (!nextItem.done) {
                            nextItem.index = sourceIndex++;
                        }
                        return nextItem;
                    }
                };
            };
        }
    }
    static FromIterable(source) {
        return new Queryable(source);
    }
    static FromIterator(source) {
        return new Queryable(() => source);
    }
    ForEach(callback) {
        AssertArgument(callback);
        const source = this.IITer();
        for (let result = source.next(); !result.done; result = source.next()) {
            callback(result.value, result.index);
        }
    }
    SelectManyRecursive(selector) {
        AssertArgument(selector);
        const stack = [];
        const all = [];
        this.SelectMany(selector)
            .Reverse()
            .ForEach((child) => {
            stack.push(child);
        });
        while (stack.length > 0) {
            const item = stack.pop();
            all.push(item);
            Queryable.FromIterable(selector(item, -1))
                .Reverse()
                .ForEach((child) => {
                stack.push(child);
            });
        }
        return Queryable.FromIterable(all);
    }
    Memoize() {
        return new Queryable(this.ToArray());
    }
    Where(predicate) {
        AssertArgument(predicate);
        return this.FromNexter((source) => () => {
            let n;
            let passed = false;
            while (!passed && !(n = source.next()).done) {
                passed = predicate(n.value, n.index);
            }
            return n;
        });
    }
    Select(selector) {
        AssertArgument(selector);
        return this.FromNexter((source) => () => {
            const n = source.next();
            return {
                done: n.done,
                index: n.index,
                value: (n.done ? undefined : selector(n.value, n.index))
            };
        });
    }
    SelectMany(selector, resultSelector) {
        AssertArgument(selector);
        return this.FromNexter((source) => {
            let outerResult;
            let innerCollection;
            let innerResult = { done: true, value: undefined };
            let outputIndex = 0;
            return () => {
                do {
                    if (innerResult.done) {
                        if ((outerResult = source.next()).done) {
                            return {
                                done: true,
                                index: outputIndex,
                                value: undefined
                            };
                        }
                        innerCollection = selector(outerResult.value, outerResult.index)[Symbol.iterator]();
                    }
                } while ((innerResult = innerCollection.next()).done);
                ++outputIndex;
                return {
                    done: false,
                    index: outputIndex,
                    value: (resultSelector !== undefined ? resultSelector(innerResult.value, outputIndex) : innerResult.value)
                };
            };
        });
    }
    Take(count) {
        AssertArgument(count);
        return this.FromNexter((source) => {
            let remaining = count;
            let lastIndex = -1;
            return () => {
                if (remaining-- > 0) {
                    const n = source.next();
                    lastIndex = n.index;
                    if (n.done) {
                        remaining = 0;
                    }
                    return n;
                }
                return {
                    done: true,
                    index: lastIndex,
                    value: undefined
                };
            };
        });
    }
    Skip(count) {
        AssertArgument(count);
        return this.FromNexter((source) => {
            let remaining = count;
            return () => {
                for (; remaining > 0; --remaining) {
                    source.next();
                }
                return source.next();
            };
        });
    }
    TakeWhile(predicate) {
        AssertArgument(predicate);
        return this.FromNexter((source) => {
            let passed = true;
            let lastIndex = -1;
            return () => {
                if (passed) {
                    const n = source.next();
                    passed = !n.done && predicate(n.value, n.index);
                    if (passed) {
                        lastIndex = n.index;
                        return n;
                    }
                }
                return {
                    done: true,
                    index: lastIndex,
                    value: undefined
                };
            };
        });
    }
    SkipWhile(predicate) {
        AssertArgument(predicate);
        return this.FromNexter((source) => {
            let skipped = false;
            return () => {
                let n;
                do {
                    n = source.next();
                } while (!skipped && !n.done && predicate(n.value, n.index));
                skipped = true;
                return n;
            };
        });
    }
    Join(inner, outerKeySelector, innerKeySelector, resultSelector) {
        AssertArgument(inner);
        AssertArgument(outerKeySelector);
        AssertArgument(innerKeySelector);
        const resSel = resultSelector || ((o, i) => ({ Left: o, Right: i }));
        return this.FromNexter((outerIter) => {
            const innerMap = new Queryable(inner).ToMap(innerKeySelector, (item) => item);
            let joinIdx = 0;
            return () => {
                for (let outerNext = outerIter.next(); !outerNext.done; outerNext = outerIter.next()) {
                    const outerKey = outerKeySelector(outerNext.value, outerNext.index);
                    if ((outerKey === undefined) || (!innerMap.has(outerKey))) {
                        continue;
                    }
                    const innerValue = innerMap.get(outerKey);
                    return {
                        done: false,
                        index: joinIdx++,
                        value: resSel(outerNext.value, innerValue)
                    };
                }
                return { done: true, index: joinIdx, value: undefined };
            };
        });
    }
    Concat(other) {
        AssertArgument(other);
        return this.FromNexter((source) => {
            const otherIter = other[Symbol.iterator]();
            let concatIndex = -1;
            let sourceHas = true;
            let otherHas = true;
            return () => {
                let n;
                if (sourceHas) {
                    n = source.next();
                    sourceHas = !n.done;
                }
                if (!sourceHas && otherHas) {
                    n = otherIter.next();
                    otherHas = !n.done;
                }
                if ((sourceHas || otherHas) && n !== undefined) {
                    return { done: false, index: concatIndex++, value: n.value };
                }
                return { done: true, index: concatIndex, value: undefined };
            };
        });
    }
    Reverse() {
        return this.FromNexter((source) => {
            const elems = Queryable.FromIterator(source)
                .ToArray();
            const mxi = elems.length;
            let idx = 0;
            return () => {
                if (idx < mxi) {
                    idx++;
                    return { done: false, index: idx, value: elems[mxi - idx] };
                }
                return { done: true, index: idx, value: undefined };
            };
        });
    }
    GroupBy(keySelector, elementSelector) {
        AssertArgument(keySelector);
        const eSel = elementSelector || ((item) => item);
        const groupMap = new Map();
        this.ForEach((item, idx) => {
            const key = keySelector(item, idx);
            const element = eSel(item, idx);
            let group = groupMap.get(key);
            if (group === undefined) {
                groupMap.set(key, group = Object.assign([], { Key: key }));
            }
            group.push(element);
        });
        return new Queryable(groupMap.values());
    }
    Distinct(comparer) {
        const cmpFn = comparer !== undefined ? comparer : _IQueryable__WEBPACK_IMPORTED_MODULE_0__["EqualityComparer"].Default;
        return new Queryable(() => {
            const distinctValues = [];
            const collapsedQuery = (new Queryable(this.ToArray()));
            const collapsedIter = collapsedQuery.IITer();
            let n = collapsedIter.next();
            for (; !n.done; n = collapsedIter.next()) {
                const hasDupe = collapsedQuery
                    .TakeWhile((v, idx) => idx < n.index)
                    .Any((v, idx) => cmpFn(n.value, v));
                if (!hasDupe) {
                    distinctValues.push(n.value);
                }
            }
            return (new Queryable(distinctValues)).IITer();
        });
    }
    Union(other, comparer) {
        AssertArgument(other);
        const cmpFn = (comparer !== undefined ? comparer : _IQueryable__WEBPACK_IMPORTED_MODULE_0__["EqualityComparer"].Default);
        const seen = [];
        const seenQuery = Queryable.FromIterable(seen);
        return this.Concat(other)
            .Where((vCat) => {
            const dupe = seenQuery.Any((vSeen) => cmpFn(vSeen, vCat));
            if (!dupe) {
                seen.push(vCat);
            }
            return !dupe;
        });
    }
    Intersect(other, comparer) {
        const distinctOther = new Queryable(other)
            .Distinct(comparer)
            .Memoize();
        return this.Where((thisItem) => distinctOther.Contains(thisItem, comparer));
    }
    Except(other, comparer) {
        const distinctOther = new Queryable(other)
            .Distinct(comparer)
            .Memoize();
        return this.Where((thisItem) => !distinctOther.Contains(thisItem, comparer));
    }
    ToArray() {
        const arr = [];
        const source = this.IITer();
        for (let result = source.next(); !result.done; result = source.next()) {
            arr.push(result.value);
        }
        return arr;
    }
    AsIterable() {
        return { [Symbol.iterator]: () => this.IITer() };
    }
    ToMap(keySelector, elementSelector) {
        AssertArgument(keySelector);
        const eSelect = elementSelector || ((item) => item);
        const map = new Map();
        this.ForEach((item, idx) => {
            const key = keySelector(item, idx);
            AssertArgument(key);
            if (map.has(key)) {
                throw new Error('ArgumentException:Duplicate Key');
            }
            map.set(key, eSelect(item, idx));
        });
        return map;
    }
    OfType(type) {
        return this.Where((item) => (typeof (item) === type));
    }
    Cast() {
        return this.Select((v) => v);
    }
    SequenceEqual(other, comparer) {
        AssertArgument(other);
        const cmp = comparer || _IQueryable__WEBPACK_IMPORTED_MODULE_0__["EqualityComparer"].Default;
        const myIter = this.IITer();
        const otherIter = other[Symbol.iterator]();
        while (true) {
            const result1 = myIter.next();
            const result2 = otherIter.next();
            if (result1.done !== result2.done) {
                return false;
            }
            if (result1.done) {
                return true;
            }
            if (!cmp(result1.value, result2.value)) {
                return false;
            }
        }
    }
    First(predicate) {
        const predFn = (predicate !== undefined ? predicate : (() => true));
        const iiTer = this.IITer();
        let n = iiTer.next();
        for (; !n.done; n = iiTer.next()) {
            if (predFn(n.value, n.index)) {
                return n.value;
            }
        }
        throw new Error('InvalidOperationException');
    }
    FirstOrDefault(def, predicate) {
        const predFn = (predicate !== undefined ? predicate : (() => true));
        const iiTer = this.IITer();
        let n;
        let passed = false;
        do {
            if (!(n = iiTer.next()).done) {
                passed = predFn(n.value, n.index);
            }
        } while (!passed && !n.done);
        return n.done ? def : n.value;
    }
    Last(predicate) {
        return ThrowNotImplemented();
    }
    LastOrDefault(def, predicate) {
        return ThrowNotImplemented();
    }
    Single(predicate) {
        return ThrowNotImplemented();
    }
    SingleOrDefault(def, predicate) {
        return ThrowNotImplemented();
    }
    ElementAt(index) {
        return ThrowNotImplemented();
    }
    ElementAtOrDefault(index, def) {
        return ThrowNotImplemented();
    }
    DefaultIfEmpty(def) {
        return (this.Any() ? this : new Queryable([def]));
    }
    Any(predicate) {
        const predFn = (predicate !== undefined ? predicate : (() => true));
        if (Array.isArray(this.NativeSource)) {
            return this.NativeSource.some(predFn);
        }
        const source = this.IITer();
        let n;
        let passed = false;
        while (!passed && !(n = source.next()).done) {
            passed = predFn(n.value, n.index);
        }
        return passed;
    }
    All(predicate) {
        AssertArgument(predicate);
        return !this.Any((item, idx) => !predicate(item, idx));
    }
    Contains(value, comparer) {
        const cmp = comparer || _IQueryable__WEBPACK_IMPORTED_MODULE_0__["EqualityComparer"].Default;
        return this.Any((item) => cmp(value, item));
    }
    Count(predicate) {
        if ((this.NativeSource !== undefined) && (predicate === undefined)) {
            if (Array.isArray(this.NativeSource)) {
                return this.NativeSource.length;
            }
            else if (this.NativeSource instanceof Map) {
                return this.NativeSource.size;
            }
            else if (typeof (this.NativeSource) === 'string') {
                return this.NativeSource.length;
            }
        }
        const filtered = (predicate === undefined) ? this : this.Where(predicate);
        return filtered.Aggregate((acc, item, idx) => idx, -1) + 1;
    }
    Sum(selector) {
        if (!this.Any()) {
            return 0;
        }
        return this.Select(selector || (Number))
            .Aggregate((acc, item) => (acc + item));
    }
    Min(selector) {
        if (!this.Any()) {
            return undefined;
        }
        return this.Select(selector || ((v) => v))
            .Aggregate((acc, item) => ((acc < item) ? acc : item));
    }
    Max(selector) {
        if (!this.Any()) {
            return undefined;
        }
        return this.Select(selector || ((v) => v))
            .Aggregate((acc, item) => ((acc > item) ? acc : item));
    }
    Average(selector) {
        if (!this.Any()) {
            return undefined;
        }
        return this.Select(selector || (Number))
            .Aggregate((acc, item) => (acc + item), 0, (acc, idx) => acc / (idx + 1));
    }
    Aggregate(func, seed, selector) {
        AssertArgument(func);
        const finalConverter = selector || ((v) => v);
        const iter = this.IITer();
        let iterResult = iter.next();
        let idx = -1;
        let accumulator;
        if (seed !== undefined) {
            accumulator = seed;
        }
        else {
            if (iterResult.done) {
                throw new Error('InvalidOperationException');
            }
            accumulator = iterResult.value;
            ++idx;
            iterResult = iter.next();
        }
        while (!iterResult.done) {
            accumulator = func(accumulator, iterResult.value, ++idx);
            iterResult = iter.next();
        }
        return finalConverter(accumulator, idx);
    }
    FromNexter(buildNexter) {
        return new Queryable(() => {
            const internalIterator = this.IITer();
            const nexter = buildNexter(internalIterator);
            return { next: nexter };
        });
    }
}


/***/ })

/******/ });
});
//# sourceMappingURL=LinqScript.js.map