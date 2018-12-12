"use strict";
/**
 *
 * Note: The source iterator is created on demand, successive calls produce new iterators.
 * Chained iterators will pass-through until the source iterator is hit
 *
 * const x = query.Select(a=>a.Name);
 *
 * const y = query.Select(a=>a.Age);
 *
 * Iterating x will not effect y.
 */
class Queryable {
    constructor(source) {
        if (typeof (source) == 'function') {
            // Source has already been setup
            this.GetNewIterator = source;
        }
        else {
            this.GetNewIterator = () => {
                // Get the source iterator
                const sourceIterator = source[Symbol.iterator]();
                let sourceIndex = 0;
                // Build the iterator function
                return () => {
                    // Get the next item
                    let nextItem = sourceIterator.next();
                    nextItem.index = sourceIndex++;
                    return nextItem;
                };
            };
        }
    }
    ToArray() {
        const arr = [];
        const getNext = this.GetNewIterator();
        let result;
        while (!(result = getNext()).done) {
            arr.push(result.value);
        }
        ;
        return arr;
    }
    ForEach(callback) {
        const getNext = this.GetNewIterator();
        let result;
        while (!(result = getNext()).done) {
            callback(result.value, result.index);
        }
        ;
    }
    Select(selector) {
        return new Queryable(() => {
            // Get a new iterator
            const getNext = this.GetNewIterator();
            // Return next-er
            return () => {
                // Get next
                const n = getNext();
                // Pass value through selector when not done
                const value = (n.done ? undefined : selector(n.value, n.index));
                return {
                    value: value,
                    done: n.done,
                    index: n.index
                };
            };
        });
    }
    SelectMany(selector) {
        return new Queryable(() => {
            const getNext = this.GetNewIterator();
            let outerItem;
            let innerCollection;
            const getNextInnerItem = () => {
                let innerItem;
                // Get next outer item?
                if (outerItem === undefined) {
                    outerItem = getNext();
                    // Hit the end of the outer items?
                    if (outerItem.done) {
                        return {
                            value: undefined,
                            done: true,
                            index: outerItem.index
                        };
                    }
                    // Get the inner collection
                    innerCollection = selector(outerItem.value, outerItem.index)[Symbol.iterator]();
                }
                // Get the next inner item
                innerItem = innerCollection.next();
                if (innerItem.done) {
                    // Hit the end of the inner items, get next outer item
                    outerItem = undefined;
                    innerCollection = undefined;
                    return getNextInnerItem();
                }
                // Return next inner item
                return {
                    value: innerItem.value,
                    done: false,
                    index: outerItem.index
                };
            };
            return getNextInnerItem;
        });
    }
    Where(predicate) {
        return new Queryable(() => {
            // Get new internal iterator
            const getNext = this.GetNewIterator();
            return () => {
                let n;
                let passed = false;
                // Search for a match or until done
                while (!passed && !(n = getNext()).done) {
                    passed = predicate(n.value, n.index);
                }
                ;
                return n;
            };
        });
    }
    Any(predicate) {
        predicate = predicate || (() => true);
        // Get new internal iterator
        const getNext = this.GetNewIterator();
        let n;
        let passed = false;
        // Search for a match or until done
        while (!passed && !(n = getNext()).done) {
            passed = predicate(n.value, n.index);
        }
        ;
        return passed;
    }
}
Array.prototype.ToArray = function () { return new Queryable(this).ToArray(); };
Array.prototype.ForEach = function (predicate) { return new Queryable(this).ForEach(predicate); };
Array.prototype.Select = function (selector) { return new Queryable(this).Select(selector); };
Array.prototype.SelectMany = function (selector) { return new Queryable(this).SelectMany(selector); };
Array.prototype.Where = function (predicate) { return new Queryable(this).Where(predicate); };
Array.prototype.Any = function (predicate) { return new Queryable(this).Any(predicate); };
class TestQueryable {
    constructor() {
        this.NumQuery = [1, 2, 3, 4];
        this.OwnerQuery = [
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
        this.PersonQuery = [];
        // Bob -> Sally -> Jeff -> Heather
        // Bob -> Mark
        this.CreatePerson('Bob', this.CreatePerson('Sally', this.CreatePerson('Jeff', this.CreatePerson('Heather'))), this.CreatePerson('Mark'));
        // Alice -> June -> Rigney -> Alice
        // June -> Steve
        this.CreatePerson('Alice', this.CreatePerson('June', this.CreatePerson('Rigney', this.CreatePerson('Alice'))), this.CreatePerson('Steve'));
    }
    RunSuite() {
        console.log('=== Testing Failure Modes ==');
        this.ReportTest('ReportTest Fail', false, 'This test should fail');
        this.ExecuteMatchTest('MatchTest Fail Length', this.NumQuery, []);
        this.ExecuteMatchTest('MatchTest Fail Values', this.NumQuery, [2, 3, 4, 5]);
        console.log('=== End Testing Failure Modes ==');
        this.ReportTest('ReportTest Pass', true, null);
        this.OperationalTests();
        this.SelectTests();
        this.WhereTests();
        this.ChainTests();
    }
    OperationalTests() {
        this.ExecuteMatchTest('ToArray', this.NumQuery, [1, 2, 3, 4]);
        this.ReportTest('Any', this.NumQuery.Any(), null);
        this.ReportTest('Any Owner is 27', this.OwnerQuery.Any(o => o.Age == 27), null);
    }
    SelectTests() {
        this.ExecuteMatchTest('Select Number', this.NumQuery.Select((item, index) => item + index), [1, 3, 5, 7]);
        this.ExecuteMatchTest('Select First Pet', this.OwnerQuery.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : null), [null, 'Fluffy', 'Terror', 'Mr. Squawks', null, 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets', this.OwnerQuery.SelectMany(owner => owner.Pets), ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']);
        this.ExecuteMatchTest('SelectMany All Pets, Select First letter', this.OwnerQuery.SelectMany(owner => owner.Pets).Select(pname => pname[0]), ['F', 'K', 'G', 'T', 'B', 'M', 'T']);
    }
    WhereTests() {
        this.ExecuteMatchTest('Where Number', this.NumQuery.Where((item, index) => item === 4 || index === 0), [1, 4]);
        this.ExecuteMatchTest('Where Object', this.OwnerQuery.Where((owner) => owner.Age > 30), [this.OwnerQuery[0], this.OwnerQuery[2], this.OwnerQuery[4], this.OwnerQuery[5]]);
    }
    ChainTests() {
        // Persons
        const persons = this.PersonQuery.Select(p => p);
        // Persons with children
        const parents = persons
            .Where(person => person.Children.length > 0);
        // Persons with grandchildren
        const grandParents = parents
            .Where(person => person.Children.Any(child => child.Children.length > 0));
        // Persons with great-grandchildren
        const greatGrandParents = grandParents
            .Where(person => person.Children
            .SelectMany(child => child.Children)
            .Any(grandChild => grandChild.Children.length > 0));
        // Where Any(p.Children.Children has Children)
        // Persons with parents
        const children = parents.SelectMany(p => p.Children);
        // Persons with grandparents
        const grandChildren = children.SelectMany(c => c.Children);
        // Persons with great grandparents
        const greatGrandChildren = grandChildren.SelectMany(gc => gc.Children);
        // Persons who have a greatgrandchild with the same name as them
        const nameLegacy = greatGrandParents.Where(p => p.Children.SelectMany(child => child.Children).SelectMany(grandchild => grandchild.Children).Any(ggc => ggc.Name === p.Name));
        // Where p.Name = p.Child.Child.Child.Name
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
        this.PersonQuery.push(p);
        return p;
    }
}
// Run suite
(new TestQueryable()).RunSuite();
