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
                        nextItem.index = sourceIndex++;
                        return nextItem;
                    }
                };
            };
        }
    }
    static From(source) {
        return new Queryable(source);
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
            let outerItem;
            let innerCollection;
            const getNextInnerItem = () => {
                let innerItem;
                if (outerItem === undefined) {
                    outerItem = source.next();
                    if (outerItem.done) {
                        return {
                            value: undefined,
                            done: true,
                            index: outerItem.index
                        };
                    }
                    innerCollection = selector(outerItem.value, outerItem.index)[Symbol.iterator]();
                }
                innerItem = innerCollection.next();
                if (innerItem.done) {
                    outerItem = undefined;
                    innerCollection = undefined;
                    return getNextInnerItem();
                }
                return {
                    value: (resultSelector ? resultSelector(innerItem.value, outerItem.index) : innerItem.value),
                    done: false,
                    index: outerItem.index
                };
            };
            return getNextInnerItem;
        });
    }
    Take(count) {
        return this.FromNexter((source) => {
            let remaining = count;
            let lastIndex = 0;
            return () => {
                if (remaining-- > 0) {
                    const n = source.next();
                    lastIndex = n.index;
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
        return NotImplemented();
    }
    TakeWhile(predicate) {
        return NotImplemented();
    }
    SkipWhile(predicate) {
        return NotImplemented();
    }
    Join(inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        return NotImplemented();
    }
    Concat(other) {
        return NotImplemented();
    }
    Reverse() {
        return NotImplemented();
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
        return NotImplemented();
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


/***/ })

/******/ });
});
//# sourceMappingURL=LinqScript.js.map