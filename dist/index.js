"use strict";
;
;
;
;
;
;
class Queryable {
    constructor(source) {
        if (typeof (source) == 'function') {
            this.GetNewSourceIterator = source;
        }
        else {
            this.GetNewSourceIterator = () => {
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
    ForEach(callback) {
        const source = this.GetNewSourceIterator();
        let result;
        while (!(result = source.next()).done) {
            callback(result.value, result.index);
        }
        ;
    }
    Where(predicate) {
        return this.QueryableFromNexter((source) => () => {
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
        return this.QueryableFromNexter((source) => () => {
            const n = source.next();
            return {
                value: (n.done ? undefined : selector(n.value, n.index)),
                done: n.done,
                index: n.index
            };
        });
    }
    SelectMany(selector, resultSelector) {
        return this.QueryableFromNexter((source) => {
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
        throw new Error("Method not implemented.");
    }
    Skip(count) {
        throw new Error("Method not implemented.");
    }
    TakeWhile(predicate) {
        throw new Error("Method not implemented.");
    }
    SkipWhile(predicate) {
        throw new Error("Method not implemented.");
    }
    Join(inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        throw new Error("Method not implemented.");
    }
    Concat(other) {
        throw new Error("Method not implemented.");
    }
    Reverse() {
        throw new Error("Method not implemented.");
    }
    GroupBy(keySelector, elementSelector, comparer) {
        throw new Error("Method not implemented.");
    }
    Distinct(comparer) {
        throw new Error("Method not implemented.");
    }
    Union(other, comparer) {
        throw new Error("Method not implemented.");
    }
    Intersect(other, comparer) {
        throw new Error("Method not implemented.");
    }
    Except(other, comparer) {
        throw new Error("Method not implemented.");
    }
    ToArray() {
        const arr = [];
        const source = this.GetNewSourceIterator();
        let result;
        while (!(result = source.next()).done) {
            arr.push(result.value);
        }
        ;
        return arr;
    }
    AsIterable() {
        throw new Error("Method not implemented.");
    }
    ToMap(keySelector, elementSelector, comparer) {
        throw new Error("Method not implemented.");
    }
    OfType(type) {
        throw new Error("Method not implemented.");
    }
    Any(predicate) {
        predicate = predicate || (() => true);
        const source = this.GetNewSourceIterator();
        let n;
        let passed = false;
        while (!passed && !(n = source.next()).done) {
            passed = predicate(n.value, n.index);
        }
        ;
        return passed;
    }
    QueryableFromNexter(buildNexter) {
        return new Queryable(() => {
            const internalIterator = this.GetNewSourceIterator();
            const nexter = buildNexter(internalIterator);
            return { next: nexter };
        });
    }
}
Array.prototype.ToArray = function () { return new Queryable(this).ToArray(); };
Array.prototype.ForEach = function (callback) { return new Queryable(this).ForEach(callback); };
Array.prototype.Select = function (selector) { return new Queryable(this).Select(selector); };
Array.prototype.SelectMany = function (selector, resultSelector) { return new Queryable(this).SelectMany(selector, resultSelector); };
Array.prototype.Where = function (predicate) { return new Queryable(this).Where(predicate); };
Array.prototype.Any = function (predicate) { return new Queryable(this).Any(predicate); };
class TestQueryable {
    constructor() {
        this.Numbers = [1, 2, 3, 4];
        this.Owners = [
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
        this.Persons = [];
        this.CreatePerson('Bob', this.CreatePerson('Sally', this.CreatePerson('Jeff', this.CreatePerson('Heather'))), this.CreatePerson('Mark'));
        this.CreatePerson('Alice', this.CreatePerson('June', this.CreatePerson('Rigney', this.CreatePerson('Alice'))), this.CreatePerson('Steve'));
    }
    RunSuite() {
        console.log('=== Testing Failure Modes ==');
        this.ReportTest('ReportTest Fail', false, 'This test should fail');
        this.ExecuteMatchTest('MatchTest Fail Length', this.Numbers, []);
        this.ExecuteMatchTest('MatchTest Fail Values', this.Numbers, [2, 3, 4, 5]);
        console.log('=== End Testing Failure Modes ==');
        this.ReportTest('ReportTest Pass', true, null);
        this.OperationalTests();
        this.SelectTests();
        this.WhereTests();
        this.ChainTests();
    }
    OperationalTests() {
        this.ExecuteMatchTest('ToArray', this.Numbers, [1, 2, 3, 4]);
        this.ReportTest('Any', this.Numbers.Any(), null);
        this.ReportTest('Any Owner is 27', this.Owners.Any(o => o.Age == 27), null);
    }
    SelectTests() {
        this.ExecuteMatchTest('Select Number', this.Numbers.Select((item, index) => item + index), [1, 3, 5, 7]);
        this.ExecuteMatchTest('Select First Pet', this.Owners.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : null), [null, 'Fluffy', 'Terror', 'Mr. Squawks', null, 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets', this.Owners.SelectMany(owner => owner.Pets), ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets, Select First letter', this.Owners.SelectMany(owner => owner.Pets, pname => pname[0]), ['F', 'K', 'G', 'T', 'B', 'M', 'T']);
    }
    WhereTests() {
        this.ExecuteMatchTest('Where Number', this.Numbers.Where((item, index) => item === 4 || index === 0), [1, 4]);
        this.ExecuteMatchTest('Where Object', this.Owners.Where((owner) => owner.Age > 30), [this.Owners[0], this.Owners[2], this.Owners[4], this.Owners[5]]);
    }
    ChainTests() {
        const persons = this.Persons.Select(p => p);
        const parents = persons
            .Where(person => person.Children.length > 0);
        const grandParents = parents
            .Where(person => person.Children.Any(child => child.Children.length > 0));
        const greatGrandParents = grandParents
            .Where(person => person.Children
            .SelectMany(child => child.Children)
            .Any(grandChild => grandChild.Children.length > 0));
        const children = parents.SelectMany(p => p.Children);
        const grandChildren = children.SelectMany(c => c.Children);
        const greatGrandChildren = grandChildren.SelectMany(gc => gc.Children);
        const nameLegacy = greatGrandParents.Where(p => p.Children.SelectMany(child => child.Children).SelectMany(grandchild => grandchild.Children).Any(ggc => ggc.Name === p.Name));
        this.ExecuteMatchTest('Chain: Parents', parents.Select(p => p.Name), ['Jeff', 'Sally', 'Bob', 'Rigney', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Grandparents', grandParents.Select(p => p.Name), ['Sally', 'Bob', 'June', 'Alice']);
        this.ExecuteMatchTest('Chain: Great Grandparents', greatGrandParents.Select(p => p.Name), ['Bob', 'Alice']);
        this.ExecuteMatchTest('Chain: Children', children.Select(p => p.Name), ['Heather', 'Jeff', 'Sally', 'Mark', 'Alice', 'Rigney', 'June', 'Steve']);
        this.ExecuteMatchTest('Chain: Grandchildren', grandChildren.Select(p => p.Name), ['Heather', 'Jeff', 'Alice', 'Rigney']);
        this.ExecuteMatchTest('Chain: Great Grandchildren', greatGrandChildren.Select(p => p.Name), ['Heather', 'Alice']);
        this.ExecuteMatchTest('Chain: Great-Grandchild Name Match', nameLegacy.Select(p => p.Name), ['Alice']);
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
            console.error('[FAIL] ' + name, relevantData);
        }
        else {
            console.info('[PASS] ' + name);
        }
    }
    CreatePerson(name, ...children) {
        const p = { Name: name, Children: children };
        this.Persons.push(p);
        return p;
    }
}
(new TestQueryable()).RunSuite();
