(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["LinqScriptTests"] = factory();
	else
		root["LinqScriptTests"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/test/Tests.ts");
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


/***/ }),

/***/ "./src/test/Tests.ts":
/*!***************************!*\
  !*** ./src/test/Tests.ts ***!
  \***************************/
/*! exports provided: Run */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Run", function() { return Run; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");

class LinqscriptTests {
    constructor() {
        this.SimpleNumberArray = [1, 2, 3, 4];
        this.ComplexNumberArray = [1, 4, 8, 10, 10, 16, 54, 82, 82, 99];
        this.OwnerArray = [
            {
                Name: 'Bob',
                Age: 34,
                Registered: false,
                Pets: []
            },
            {
                Name: 'Alice',
                Age: 27,
                Registered: false,
                Pets: ['Fluffy', 'Kitty', 'Gus']
            },
            {
                Name: 'Mike',
                Age: 59,
                Registered: true,
                Pets: ['Terror', 'Butch']
            },
            {
                Name: 'Cindy',
                Age: 8,
                Registered: false,
                Pets: ['Mr. Squawks']
            },
            {
                Name: 'Mark',
                Age: 44,
                Registered: true,
                Pets: []
            },
            {
                Name: 'Nancy',
                Age: 90,
                Registered: true,
                Pets: ['Tort']
            }
        ];
        this.PersonArray = [];
        this.CreatePerson('Bob', this.CreatePerson('Sally', this.CreatePerson('Jeff', this.CreatePerson('Heather'))), this.CreatePerson('Mark'));
        this.CreatePerson('Alice', this.CreatePerson('June', this.CreatePerson('Rigney', this.CreatePerson('Alice'))), this.CreatePerson('Steve'));
        this.SimpleNumberQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.SimpleNumberArray);
        this.ComplexNumberQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.ComplexNumberArray);
        this.OwnerQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.OwnerArray);
        this.PersonQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.PersonArray);
        this.OutputElement = document.getElementById('TestResults');
    }
    RunSuite() {
        this.Log('=== Testing Failure Modes ==');
        this.ReportTest('ReportTest Fail', false, 'This test should fail');
        this.ExecuteMatchTest('MatchTest Fail Length', this.SimpleNumberQuery, []);
        this.ExecuteMatchTest('MatchTest Fail Values', this.SimpleNumberQuery, [2, 3, 4, 5]);
        this.Log('=== End Testing Failure Modes ==');
        this.ReportTest('ReportTest Pass', true, undefined);
        this.StaticTests();
        this.OperationalTests();
        this.SelectTests();
        this.WhereTests();
        this.PartitioningTests();
        this.ConcatenationTest();
        this.OrderingTests();
        this.SetTests();
        this.EqualityTests();
        this.ChainTests();
    }
    OperationalTests() {
        this.ExecuteMatchTest('ToArray', this.SimpleNumberQuery, [1, 2, 3, 4]);
        this.ReportTest('Any', this.SimpleNumberQuery.Any(), undefined);
        this.ReportTest('Any Owner is 27', this.OwnerQuery.Any((o) => o.Age === 27), undefined);
    }
    StaticTests() {
        const emptyQuery = _index__WEBPACK_IMPORTED_MODULE_0__["Query"].Empty();
        const rangeQuery = _index__WEBPACK_IMPORTED_MODULE_0__["Query"].Range(1, 5);
        const repeatQuery = _index__WEBPACK_IMPORTED_MODULE_0__["Query"].Repeat('Hello', 3);
        this.ExecuteMatchTest('Empty', emptyQuery, []);
        this.ExecuteMatchTest('Range', rangeQuery, [1, 2, 3, 4, 5, 6]);
        this.ExecuteMatchTest('Repeat', repeatQuery, ['Hello', 'Hello', 'Hello']);
    }
    SelectTests() {
        this.ExecuteMatchTest('Select Number', this.SimpleNumberQuery.Select((item, index) => item + index), [1, 3, 5, 7]);
        this.ExecuteMatchTest('Select First Pet', this.OwnerQuery.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : undefined), [undefined, 'Fluffy', 'Terror', 'Mr. Squawks', undefined, 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets', this.OwnerQuery.SelectMany((owner) => owner.Pets), ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets, Select First letter', this.OwnerQuery.SelectMany((owner) => owner.Pets, (pname) => pname[0]), ['F', 'K', 'G', 'T', 'B', 'M', 'T']);
    }
    WhereTests() {
        this.ExecuteMatchTest('Where Number', this.SimpleNumberQuery.Where((item, index) => item === 4 || index === 0), [1, 4]);
        this.ExecuteMatchTest('Where Object', this.OwnerQuery.Where((owner) => owner.Age > 30), [this.OwnerArray[0], this.OwnerArray[2], this.OwnerArray[4], this.OwnerArray[5]]);
    }
    ChainTests() {
        const persons = this.PersonQuery.Select((p) => p);
        const parents = persons
            .Where((person) => person.Children.length > 0);
        const grandParents = parents
            .Where((person) => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(person.Children)
            .Any((child) => child.Children.length > 0));
        const greatGrandParents = grandParents
            .Where((person) => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(person.Children)
            .SelectMany((child) => child.Children)
            .Any((grandChild) => grandChild.Children.length > 0));
        const children = parents.SelectMany((p) => p.Children);
        const grandChildren = children.SelectMany((c) => c.Children);
        const greatGrandChildren = grandChildren.SelectMany((gc) => gc.Children);
        const nameLegacy = greatGrandParents.Where((p) => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(p.Children)
            .SelectMany((child) => child.Children)
            .SelectMany((grandchild) => grandchild.Children)
            .Any((ggc) => ggc.Name === p.Name));
        this.ExecuteMatchTest('Chain: Parents', parents.Select((p) => p.Name), ['Jeff', 'Sally', 'Bob', 'Rigney', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Grandparents', grandParents.Select((p) => p.Name), ['Sally', 'Bob', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Great Grandparents', greatGrandParents.Select((p) => p.Name), ['Bob', 'Alice']);
        this.ExecuteMatchTest('Chain: Children', children.Select((p) => p.Name), ['Heather', 'Jeff', 'Sally', 'Mark', 'Alice', 'Rigney', 'June', 'Steve']);
        this.ExecuteMatchTest('Chain: Grandchildren', grandChildren.Select((p) => p.Name), ['Heather', 'Jeff', 'Alice', 'Rigney']);
        this.ExecuteMatchTest('Chain: Great Grandchildren', greatGrandChildren.Select((p) => p.Name), ['Heather', 'Alice']);
        this.ExecuteMatchTest('Chain: Great-Grandchild Name Match', nameLegacy.Select((p) => p.Name), ['Alice']);
    }
    PartitioningTests() {
        this.ExecuteMatchTest('Skip', this.SimpleNumberQuery.Skip(2), [3, 4]);
        this.ExecuteMatchTest('Take', this.SimpleNumberQuery.Take(2), [1, 2]);
        this.ExecuteMatchTest('Skip-Take', this.SimpleNumberQuery.Skip(1)
            .Take(2), [2, 3]);
        this.ExecuteMatchTest('TakeWhile', this.OwnerQuery.TakeWhile((v) => v.Age > 10), [this.OwnerArray[0], this.OwnerArray[1], this.OwnerArray[2]]);
        this.ExecuteMatchTest('SkipWhile', this.OwnerQuery.SkipWhile((v) => v.Age > 10), [this.OwnerArray[3], this.OwnerArray[4], this.OwnerArray[5]]);
    }
    ConcatenationTest() {
        this.ExecuteMatchTest('Concat', this.SimpleNumberQuery.Concat([5, 6]), [1, 2, 3, 4, 5, 6]);
    }
    OrderingTests() {
        this.ExecuteMatchTest('Reverse', this.SimpleNumberQuery.Reverse(), [4, 3, 2, 1]);
    }
    SetTests() {
        this.ExecuteMatchTest('Distinct (default)', this.ComplexNumberQuery.Distinct(), [1, 4, 8, 10, 16, 54, 82, 99]);
        this.ExecuteMatchTest('Distinct (The only number in its 10\'s group)', this.ComplexNumberQuery.Distinct((a, b) => Math.floor(a / 10.0) === Math.floor(b / 10.0)), [1, 10, 54, 82, 99]);
        this.ExecuteMatchTest('Union', this.SimpleNumberQuery.Union(this.ComplexNumberQuery.AsIterable()), [1, 2, 3, 4, 8, 10, 16, 54, 82, 99]);
    }
    EqualityTests() {
        const query1 = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])([1, 2, 3, 4]);
        const query2 = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])([1, 2, 3, 4]);
        this.ReportTest('SequenceEqual', query1.SequenceEqual(query2.AsIterable()), undefined);
    }
    Log(msg, data) {
        this.OutputElement.innerText = this.OutputElement.innerText + '\r\n' + msg + (data ? ' :: ' + String(data) : '');
        if (data) {
            console.log(msg, data);
        }
        else {
            console.log(msg);
        }
    }
    ExecuteMatchTest(name, query, test) {
        let passed = true;
        const arr = query.ToArray();
        try {
            if (Array.isArray(test)) {
                passed = arr.length === test.length;
                for (let i = 0; i < test.length && passed; ++i) {
                    passed = arr[i] === test[i];
                }
            }
            else {
                passed = test(arr);
            }
        }
        catch (_a) {
            passed = false;
        }
        this.ReportTest(name, passed, arr);
    }
    ReportTest(name, passed, relevantData) {
        if (!passed) {
            this.Log(`[FAIL] ${name}`, relevantData);
        }
        else {
            this.Log(`[PASS] ${name}`);
        }
    }
    CreatePerson(name, ...children) {
        const p = { Name: name, Children: children };
        this.PersonArray.push(p);
        return p;
    }
}
function Run() {
    (new LinqscriptTests()).RunSuite();
    window.Query = _index__WEBPACK_IMPORTED_MODULE_0__["Query"];
    const example1 = `Query([4,10,34,100]).Select(a=>a*2).ToArray()`;
    const example2 = `Query(document.getElementsByTagName('head')).Take(1).SelectMany(head=>head.children).Where(elm=>elm instanceof HTMLScriptElement).Select(script=>script.src.replace('file:///','')).ToArray()`;
    console.info('');
    console.info('Query exposed to global scope. Example usage:');
    console.info(example1, eval(example1));
    console.info('Or, get script sources from <head>');
    console.info(example2, eval(example2));
    const example3 = `
  // Get the root node
  Query([document.getRootNode()])
  // Select all decendants
  .SelectManyRecursive(i => i.children)
  // Select all style properties
  .SelectMany(elm =>
    Query(Object.keys(elm.style))
    // Ignore numeric keys
    .Where(key => isNaN(Number(key)))
    // Ignore empty values
    .Where(key => elm.style[key] != '')
    .Select(key => ({ Tag: elm, Style: key, Value: elm.style[key] }))
    .AsIterable()
  ).ToArray();
  `;
    console.log(example3, eval(example3));
}


/***/ })

/******/ });
});
//# sourceMappingURL=LinqScriptTests.js.map