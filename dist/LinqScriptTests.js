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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return Query; });
/* harmony import */ var _lib_Queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Queryable */ "./src/lib/Queryable.ts");

function Query(source) {
    return new _lib_Queryable__WEBPACK_IMPORTED_MODULE_0__["Queryable"](source);
}
;


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
const NotImplemented = () => { throw new Error("Method not implemented."); };
class Queryable {
    constructor(source) {
        if (typeof (source) == 'function') {
            this.IITer = source;
        }
        else {
            this.IITer = () => {
                const sourceIterator = source[Symbol.iterator]();
                let sourceIndex = 0;
                return {
                    next: () => {
                        let nextItem = sourceIterator.next();
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
        const source = this.IITer();
        let result;
        while (!(result = source.next()).done) {
            callback(result.value, result.index);
        }
        ;
    }
    Where(predicate) {
        return this.FromNexter((source) => () => {
            let n;
            let passed = false;
            while (!passed && !(n = source.next()).done) {
                passed = predicate(n.value, n.index);
            }
            ;
            return n;
        });
    }
    Select(selector) {
        return this.FromNexter((source) => () => {
            const n = source.next();
            return {
                value: (n.done ? undefined : selector(n.value, n.index)),
                done: n.done,
                index: n.index
            };
        });
    }
    SelectMany(selector, resultSelector) {
        return this.FromNexter((source) => {
            let outerResult;
            let innerCollection;
            let innerResult = { done: true, value: undefined };
            return () => {
                do {
                    if (innerResult.done) {
                        if ((outerResult = source.next()).done) {
                            return {
                                value: undefined,
                                done: true,
                                index: outerResult.index
                            };
                        }
                        innerCollection = selector(outerResult.value, outerResult.index)[Symbol.iterator]();
                    }
                } while ((innerResult = innerCollection.next()).done);
                return {
                    value: (resultSelector ? resultSelector(innerResult.value, outerResult.index) : innerResult.value),
                    done: false,
                    index: outerResult.index
                };
            };
        });
    }
    Take(count) {
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
        return this.FromNexter((source) => {
            let remaining = count;
            return () => {
                while (remaining > 0) {
                    source.next();
                    --remaining;
                }
                ;
                return source.next();
            };
        });
    }
    TakeWhile(predicate) {
        return this.FromNexter((source) => {
            let passed = true;
            let lastIndex = -1;
            return () => {
                if (passed) {
                    const n = source.next();
                    passed = !n.done && predicate(n.value, n.index);
                    if (passed) {
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
    Join(inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        return NotImplemented();
    }
    Concat(other) {
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
                if (sourceHas || otherHas) {
                    return { done: false, index: concatIndex++, value: n.value };
                }
                return { done: true, index: concatIndex, value: undefined };
            };
        });
    }
    Reverse() {
        return this.FromNexter((source) => {
            let elems = Queryable.FromIterator(source).ToArray();
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
    GroupBy(keySelector, elementSelector, comparer) {
        return NotImplemented();
    }
    Distinct(comparer) {
        return NotImplemented();
    }
    Union(other, comparer) {
        return NotImplemented();
    }
    Intersect(other, comparer) {
        return NotImplemented();
    }
    Except(other, comparer) {
        return NotImplemented();
    }
    ToArray() {
        const arr = [];
        const source = this.IITer();
        let result;
        while (!(result = source.next()).done) {
            arr.push(result.value);
        }
        ;
        return arr;
    }
    AsIterable() {
        return { [Symbol.iterator]: () => this.IITer() };
    }
    ToMap(keySelector, elementSelector, comparer) {
        return NotImplemented();
    }
    OfType(type) {
        return NotImplemented();
    }
    Cast() {
        return NotImplemented();
    }
    SequenceEqual(other, comparer) {
        return NotImplemented();
    }
    First(predicate) {
        predicate = predicate || ((element) => true);
        const iiTer = this.IITer();
        let n;
        let passed = false;
        do {
            if (!(n = iiTer.next()).done) {
                passed = predicate(n.value, n.index);
            }
        } while (!passed && !n.done);
        if (n.done) {
            throw new Error("InvalidOperationException");
        }
        return n.value;
    }
    FirstOrDefault(def, predicate) {
        predicate = predicate || ((element) => true);
        const iiTer = this.IITer();
        let n;
        let passed = false;
        do {
            if (!(n = iiTer.next()).done) {
                passed = predicate(n.value, n.index);
            }
        } while (!passed && !n.done);
        return n.done ? def : n.value;
    }
    Any(predicate) {
        predicate = predicate || (() => true);
        const source = this.IITer();
        let n;
        let passed = false;
        while (!passed && !(n = source.next()).done) {
            passed = predicate(n.value, n.index);
        }
        ;
        return passed;
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
        this.NumberArray = [1, 2, 3, 4];
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
            },
        ];
        this.PersonArray = [];
        this.CreatePerson('Bob', this.CreatePerson('Sally', this.CreatePerson('Jeff', this.CreatePerson('Heather'))), this.CreatePerson('Mark'));
        this.CreatePerson('Alice', this.CreatePerson('June', this.CreatePerson('Rigney', this.CreatePerson('Alice'))), this.CreatePerson('Steve'));
        this.NumberQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.NumberArray);
        this.OwnerQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.OwnerArray);
        this.PersonQuery = Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(this.PersonArray);
        this.OutputElement = document.getElementById("TestResults");
    }
    RunSuite() {
        this.Log('=== Testing Failure Modes ==');
        this.ReportTest('ReportTest Fail', false, 'This test should fail');
        this.ExecuteMatchTest('MatchTest Fail Length', this.NumberQuery, []);
        this.ExecuteMatchTest('MatchTest Fail Values', this.NumberQuery, [2, 3, 4, 5]);
        this.Log('=== End Testing Failure Modes ==');
        this.ReportTest('ReportTest Pass', true, null);
        this.OperationalTests();
        this.SelectTests();
        this.WhereTests();
        this.ChainTests();
        this.PartitioningTests();
        this.ConcatenationTest();
        this.OrderingTests();
    }
    OperationalTests() {
        this.ExecuteMatchTest('ToArray', this.NumberQuery, [1, 2, 3, 4]);
        this.ReportTest('Any', this.NumberQuery.Any(), null);
        this.ReportTest('Any Owner is 27', this.OwnerQuery.Any(o => o.Age == 27), null);
    }
    SelectTests() {
        this.ExecuteMatchTest('Select Number', this.NumberQuery.Select((item, index) => item + index), [1, 3, 5, 7]);
        this.ExecuteMatchTest('Select First Pet', this.OwnerQuery.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : null), [null, 'Fluffy', 'Terror', 'Mr. Squawks', null, 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets', this.OwnerQuery.SelectMany(owner => owner.Pets), ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets, Select First letter', this.OwnerQuery.SelectMany(owner => owner.Pets, pname => pname[0]), ['F', 'K', 'G', 'T', 'B', 'M', 'T']);
    }
    WhereTests() {
        this.ExecuteMatchTest('Where Number', this.NumberQuery.Where((item, index) => item === 4 || index === 0), [1, 4]);
        this.ExecuteMatchTest('Where Object', this.OwnerQuery.Where((owner) => owner.Age > 30), [this.OwnerArray[0], this.OwnerArray[2], this.OwnerArray[4], this.OwnerArray[5]]);
    }
    ChainTests() {
        const persons = this.PersonQuery.Select(p => p);
        const parents = persons
            .Where(person => person.Children.length > 0);
        const grandParents = parents
            .Where(person => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(person.Children).Any(child => child.Children.length > 0));
        const greatGrandParents = grandParents
            .Where(person => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(person.Children)
            .SelectMany(child => child.Children)
            .Any(grandChild => grandChild.Children.length > 0));
        const children = parents.SelectMany(p => p.Children);
        const grandChildren = children.SelectMany(c => c.Children);
        const greatGrandChildren = grandChildren.SelectMany(gc => gc.Children);
        const nameLegacy = greatGrandParents.Where(p => Object(_index__WEBPACK_IMPORTED_MODULE_0__["Query"])(p.Children).SelectMany(child => child.Children).SelectMany(grandchild => grandchild.Children).Any(ggc => ggc.Name === p.Name));
        this.ExecuteMatchTest('Chain: Parents', parents.Select(p => p.Name), ['Jeff', 'Sally', 'Bob', 'Rigney', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Grandparents', grandParents.Select(p => p.Name), ['Sally', 'Bob', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Great Grandparents', greatGrandParents.Select(p => p.Name), ['Bob', 'Alice']);
        this.ExecuteMatchTest('Chain: Children', children.Select(p => p.Name), ['Heather', 'Jeff', 'Sally', 'Mark', 'Alice', 'Rigney', 'June', 'Steve']);
        this.ExecuteMatchTest('Chain: Grandchildren', grandChildren.Select(p => p.Name), ['Heather', 'Jeff', 'Alice', 'Rigney']);
        this.ExecuteMatchTest('Chain: Great Grandchildren', greatGrandChildren.Select(p => p.Name), ['Heather', 'Alice']);
        this.ExecuteMatchTest('Chain: Great-Grandchild Name Match', nameLegacy.Select(p => p.Name), ['Alice']);
    }
    PartitioningTests() {
        this.ExecuteMatchTest('Skip', this.NumberQuery.Skip(2), [3, 4]);
        this.ExecuteMatchTest('Take', this.NumberQuery.Take(2), [1, 2]);
        this.ExecuteMatchTest('Skip-Take', this.NumberQuery.Skip(1).Take(2), [2, 3]);
        this.ExecuteMatchTest('TakeWhile', this.OwnerQuery.TakeWhile((v) => v.Age > 10), [this.OwnerArray[0], this.OwnerArray[1], this.OwnerArray[2]]);
        this.ExecuteMatchTest('SkipWhile', this.OwnerQuery.SkipWhile((v) => v.Age > 10), [this.OwnerArray[3], this.OwnerArray[4], this.OwnerArray[5]]);
    }
    ConcatenationTest() {
        this.ExecuteMatchTest('Concat', this.NumberQuery.Concat([5, 6]), [1, 2, 3, 4, 5, 6]);
    }
    OrderingTests() {
        this.ExecuteMatchTest('Reverse', this.NumberQuery.Reverse(), [4, 3, 2, 1]);
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
            this.Log('[FAIL] ' + name, relevantData);
        }
        else {
            this.Log('[PASS] ' + name);
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
    const example1 = 'Query([4,10,34,100]).Select(a=>a*2).ToArray()';
    const example2 = "Query(document.getElementsByTagName('head')).Take(1).SelectMany(head=>head.children).Where(elm=>elm instanceof HTMLScriptElement).Select(script=>script.src.replace('file:///','')).ToArray()";
    console.info('');
    console.info('Query exposed to global scope. Example usage:');
    console.info(example1, eval(example1));
    console.info('Or, get script sources from <head>');
    console.info(example2, eval(example2));
}
;


/***/ })

/******/ });
});
//# sourceMappingURL=LinqScriptTests.js.map