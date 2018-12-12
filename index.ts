
interface IteratorResultWithIndex<T> extends IteratorResult<T> {
  index: number;
}

interface IQueryable<TSource> {

  /**
   * Iterate and store values into a new array.
   */
  ToArray(): Array<TSource>;

  /**
   * Calls the callback function for each element in the sequence.
   * @param callback
   */
  ForEach(callback: (item: TSource, index: number) => void): void;

  /* Projection Operators */

  /**
   * The Select operator performs a projection over a sequence.
   * @param selector
   */
  Select<TResult>(selector: (item: TSource, index: number) => TResult): Queryable<TResult>;

  /**
   * The SelectMany operator performs a one-to-many element projection over a sequence.
   * @param selector
   * @param resultSelector
   */
  SelectMany<TResult>(selector: (item: TSource, index: number) => Iterable<TResult>): Queryable<TResult>;

  /* Restriction Operators */

  /**
   * The Where operator filters a sequence based on a predicate.
   * @param predicate
   */
  Where(predicate: (item: TSource, index: number) => boolean): Queryable<TSource>;

  /* Quantifiers */

  /**
   * The Any operator checks whether any element of a sequence satisfies a condition.
   * 
   * The Any operator enumerates the source sequence and returns true if any element satisfies the test given by the predicate.
   * If no predicate function is specified, the Any operator simply returns true if the source sequence contains any elements.
   */
  Any(predicate?: (item: TSource, index: number) => boolean): boolean;
}

type IteratorChain<T> = () => () => IteratorResultWithIndex<T>;

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
class Queryable<TSource> implements IQueryable<TSource>{

  private GetNewIterator: IteratorChain<TSource>;

  public constructor(source: Iterable<TSource> | IteratorChain<TSource>) {
    if (typeof (source) == 'function') {
      // Source has already been setup
      this.GetNewIterator = source;
    } else {
      this.GetNewIterator = () => {
        // Get the source iterator
        const sourceIterator: Iterator<TSource> = source[Symbol.iterator]();
        let sourceIndex: number = 0;

        // Build the iterator function
        return () => {
          // Get the next item
          let nextItem = sourceIterator.next() as IteratorResultWithIndex<TSource>;
          nextItem.index = sourceIndex++;
          return nextItem;
        };
      };
    }
  }

  public ToArray(): Array<TSource> {
    const arr: Array<TSource> = [];
    const getNext = this.GetNewIterator();

    let result: IteratorResult<TSource>;
    while (!(result = getNext()).done) {
      arr.push(result.value);
    };

    return arr;
  }

  public ForEach(callback: (item: TSource, index: number) => void): void {
    const getNext = this.GetNewIterator();
    let result: IteratorResultWithIndex<TSource>;
    while (!(result = getNext()).done) {
      callback(result.value, result.index);
    };
  }

  public Select<TResult>(selector: (item: TSource, index: number) => TResult): Queryable<TResult> {
    return new Queryable<TResult>(() => {
      // Get a new iterator
      const getNext = this.GetNewIterator();

      // Return next-er
      return () => {
        // Get next
        const n = getNext();
        // Pass value through selector when not done
        const value = (n.done ? undefined as any as TResult : selector(n.value, n.index));
        return {
          value: value,
          done: n.done,
          index: n.index
        };
      };
    });
  }

  public SelectMany<TResult>(selector: (item: TSource, index: number) => Iterable<TResult>): Queryable<TResult> {
    return new Queryable<TResult>(() => {
      const getNext = this.GetNewIterator();
      let outerItem: IteratorResultWithIndex<TSource> | undefined;
      let innerCollection: Iterator<TResult> | undefined;

      const getNextInnerItem = (): IteratorResultWithIndex<TResult> => {
        let innerItem: IteratorResult<TResult>;

        // Get next outer item?
        if (outerItem === undefined) {
          outerItem = getNext();

          // Hit the end of the outer items?
          if (outerItem.done) {
            return {
              value: undefined as any as TResult,
              done: true,
              index: outerItem.index
            };
          }

          // Get the inner collection
          innerCollection = selector(outerItem.value, outerItem.index)[Symbol.iterator]();
        }

        // Get the next inner item
        innerItem = innerCollection!.next();

        if (innerItem.done) {
          // Hit the end of the inner items, get next outer item
          outerItem = undefined;
          innerCollection = undefined;
          return getNextInnerItem();
        }

        // Return next inner item
        return {
          value: innerItem.value as TResult,
          done: false,
          index: outerItem.index
        };
      };

      return getNextInnerItem;
    }
    );
  }

  public Where(predicate: (item: TSource, index: number) => boolean): Queryable<TSource> {
    return new Queryable<TSource>(() => {
      // Get new internal iterator
      const getNext = this.GetNewIterator();
      return () => {
        let n: IteratorResultWithIndex<TSource>;
        let passed: boolean = false;
        // Search for a match or until done
        while (!passed && !(n = getNext()).done) {
          passed = predicate(n.value, n.index);
        };
        return n!;
      };
    });
  }

  public Any(predicate?: (item: TSource, index: number) => boolean): boolean {
    predicate = predicate || (() => true);
    // Get new internal iterator
    const getNext = this.GetNewIterator();

    let n: IteratorResultWithIndex<TSource>;
    let passed: boolean = false;
    // Search for a match or until done
    while (!passed && !(n = getNext()).done) {
      passed = predicate(n.value, n.index);
    };
    return passed;
  }

}

// Array extensions
interface Array<T> extends IQueryable<T> { }

Array.prototype.ToArray = function () { return new Queryable(this).ToArray(); }
Array.prototype.ForEach = function (predicate) { return new Queryable(this).ForEach(predicate); }
Array.prototype.Select = function (selector) { return new Queryable(this).Select(selector); }
Array.prototype.SelectMany = function (selector) { return new Queryable(this).SelectMany(selector); }
Array.prototype.Where = function (predicate) { return new Queryable(this).Where(predicate); }
Array.prototype.Any = function (predicate) { return new Queryable(this).Any(predicate); }

// ===================== TESTS =====================

interface IOwner {
  Name: string,
  Age: number,
  Registered: boolean,
  Pets: Array<string>
}

interface IPerson {
  Name: string,
  Children: Array<IPerson>
}
class TestQueryable {


  private Numbers: Array<number>;
  private Owners: Array<IOwner>;
  private Persons: Array<IPerson>;

  public constructor() {
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
    // Bob -> Sally -> Jeff -> Heather
    // Bob -> Mark
    this.CreatePerson('Bob',
      this.CreatePerson('Sally',
        this.CreatePerson('Jeff',
          this.CreatePerson('Heather')
        )
      ),
      this.CreatePerson('Mark')
    );

    // Alice -> June -> Rigney -> Alice
    // June -> Steve
    this.CreatePerson('Alice',
      this.CreatePerson('June',
        this.CreatePerson('Rigney',
          this.CreatePerson('Alice')
        )
      ),
      this.CreatePerson('Steve')
    );
  }

  public RunSuite(): void {
    console.log('=== Testing Failure Modes ==')
    this.ReportTest('ReportTest Fail', false, 'This test should fail');
    this.ExecuteMatchTest('MatchTest Fail Length', this.Numbers, []);
    this.ExecuteMatchTest('MatchTest Fail Values', this.Numbers, [2, 3, 4, 5]);
    console.log('=== End Testing Failure Modes ==')

    this.ReportTest('ReportTest Pass', true, null);

    this.OperationalTests();
    this.SelectTests();
    this.WhereTests();
    this.ChainTests();

  }

  public OperationalTests() {
    this.ExecuteMatchTest(
      'ToArray',
      this.Numbers,
      [1, 2, 3, 4]
    );
    this.ReportTest(
      'Any',
      this.Numbers.Any(),
      null
    );
    this.ReportTest(
      'Any Owner is 27',
      this.Owners.Any(o => o.Age == 27),
      null
    );
  }

  public SelectTests(): void {
    this.ExecuteMatchTest(
      'Select Number',
      this.Numbers.Select((item, index) => item + index),
      [1, 3, 5, 7]
    );

    this.ExecuteMatchTest(
      'Select First Pet',
      this.Owners.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : null),
      [null, 'Fluffy', 'Terror', 'Mr. Squawks', null, 'Tort']
    );

    this.ExecuteMatchTest(
      'SelectMany All Pets',
      this.Owners.SelectMany(owner => owner.Pets),
      ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']
    );

    this.ExecuteMatchTest(
      'SelectMany All Pets, Select First letter',
      this.Owners.SelectMany(owner => owner.Pets).Select(pname => pname[0]),
      ['F', 'K', 'G', 'T', 'B', 'M', 'T']
    );
  }

  public WhereTests(): void {
    this.ExecuteMatchTest(
      'Where Number',
      this.Numbers.Where((item, index) => item === 4 || index === 0),
      [1, 4]
    );
    this.ExecuteMatchTest(
      'Where Object',
      this.Owners.Where((owner) => owner.Age > 30),
      [this.Owners[0], this.Owners[2], this.Owners[4], this.Owners[5]]
    );
  }

  public ChainTests(): void {
    // Persons
    const persons = this.Persons.Select(p => p);
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
        .Any(grandChild => grandChild.Children.length > 0)
      );
    // Where Any(p.Children.Children has Children)

    // Persons with parents
    const children = parents.SelectMany(p => p.Children);

    // Persons with grandparents
    const grandChildren = children.SelectMany(c => c.Children);

    // Persons with great grandparents
    const greatGrandChildren = grandChildren.SelectMany(gc => gc.Children);

    // Persons who have a greatgrandchild with the same name as them
    const nameLegacy = greatGrandParents.Where(
      p => p.Children.SelectMany(child => child.Children).SelectMany(grandchild => grandchild.Children).Any(ggc => ggc.Name === p.Name)
    );
    // Where p.Name = p.Child.Child.Child.Name

    this.ExecuteMatchTest(
      'Chain: Parents',
      parents.Select(p => p.Name),
      ['Jeff', 'Sally', 'Bob', 'Rigney', 'June', 'Alice']
    );

    this.ExecuteMatchTest(
      'Chain: Grandparents',
      grandParents.Select(p => p.Name),
      ['Sally', 'Bob', 'June', 'Alice']
    );

    this.ExecuteMatchTest(
      'Chain: Great Grandparents',
      greatGrandParents.Select(p => p.Name),
      ['Bob', 'Alice']
    );

    this.ExecuteMatchTest(
      'Chain: Children',
      children.Select(p => p.Name),
      ['Heather', 'Jeff', 'Sally', 'Mark', 'Alice', 'Rigney', 'June', 'Steve']
    );

    this.ExecuteMatchTest(
      'Chain: Grandchildren',
      grandChildren.Select(p => p.Name),
      ['Heather', 'Jeff', 'Alice', 'Rigney']
    );

    this.ExecuteMatchTest(
      'Chain: Great Grandchildren',
      greatGrandChildren.Select(p => p.Name),
      ['Heather', 'Alice']
    );
    this.ExecuteMatchTest(
      'Chain: Great-Grandchild Name Match',
      nameLegacy.Select(p => p.Name),
      ['Alice']
    );
  }

  private ExecuteMatchTest<T>(name: string, query: IQueryable<T>, test: ((arr: Array<T>) => boolean) | Array<T>) {
    let passed = true;
    const arr: Array<T> = query.ToArray();
    try {
      if (Array.isArray(test)) {
        passed = arr.length === test.length;
        for (let i = 0; i < test.length && passed; ++i) {
          passed = arr[i] === test[i];
        }
      } else {
        passed = test(arr);
      }
    } catch {
      passed = false;
    }
    this.ReportTest(name, passed, arr);
  }

  private ReportTest(name: string, passed: boolean, relevantData: any) {
    if (!passed) {
      console.error('[FAIL] ' + name, relevantData);
    } else {
      console.info('[PASS] ' + name)
    }
  }

  private CreatePerson(name: string, ...children: Array<IPerson>): IPerson {
    const p: IPerson = { Name: name, Children: children };
    this.Persons.push(p);
    return p;
  }

}

// Run suite
(new TestQueryable()).RunSuite();
