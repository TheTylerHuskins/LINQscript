import { Query, IQueryable } from '../index'


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

class LinqscriptTests {
  private NumberArray: Array<number>;
  private OwnerArray: Array<IOwner>;
  private PersonArray: Array<IPerson>;

  private NumberQuery: IQueryable<number>;
  private OwnerQuery: IQueryable<IOwner>;
  private PersonQuery: IQueryable<IPerson>;

  private OutputElement: HTMLPreElement;


  public constructor() {
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


    this.NumberQuery = Query(this.NumberArray);
    this.OwnerQuery = Query(this.OwnerArray);
    this.PersonQuery = Query(this.PersonArray);

    this.OutputElement = document.getElementById("TestResults") as HTMLPreElement;
  }

  public RunSuite(): void {
    this.Log('=== Testing Failure Modes ==')
    this.ReportTest('ReportTest Fail', false, 'This test should fail');
    this.ExecuteMatchTest('MatchTest Fail Length', this.NumberQuery, []);
    this.ExecuteMatchTest('MatchTest Fail Values', this.NumberQuery, [2, 3, 4, 5]);
    this.Log('=== End Testing Failure Modes ==')

    this.ReportTest('ReportTest Pass', true, null);

    this.OperationalTests();
    this.SelectTests();
    this.WhereTests();
    this.ChainTests();

  }

  public OperationalTests() {
    this.ExecuteMatchTest(
      'ToArray',
      this.NumberQuery,
      [1, 2, 3, 4]
    );
    this.ReportTest(
      'Any',
      this.NumberQuery.Any(),
      null
    );
    this.ReportTest(
      'Any Owner is 27',
      this.OwnerQuery.Any(o => o.Age == 27),
      null
    );
  }

  public SelectTests(): void {
    this.ExecuteMatchTest(
      'Select Number',
      this.NumberQuery.Select((item, index) => item + index),
      [1, 3, 5, 7]
    );

    this.ExecuteMatchTest(
      'Select First Pet',
      this.OwnerQuery.Select((owner) => owner.Pets.length > 0 ? owner.Pets[0] : null),
      [null, 'Fluffy', 'Terror', 'Mr. Squawks', null, 'Tort']
    );

    this.ExecuteMatchTest(
      'SelectMany All Pets',
      this.OwnerQuery.SelectMany(owner => owner.Pets),
      ['Fluffy', 'Kitty', 'Gus', 'Terror', 'Butch', 'Mr. Squawks', 'Tort']
    );

    this.ExecuteMatchTest(
      'SelectMany All Pets, Select First letter',
      this.OwnerQuery.SelectMany<string, any>(owner => owner.Pets, pname => pname[0]),
      ['F', 'K', 'G', 'T', 'B', 'M', 'T']
    );
  }

  public WhereTests(): void {
    this.ExecuteMatchTest(
      'Where Number',
      this.NumberQuery.Where((item, index) => item === 4 || index === 0),
      [1, 4]
    );
    this.ExecuteMatchTest(
      'Where Object',
      this.OwnerQuery.Where((owner) => owner.Age > 30),
      [this.OwnerArray[0], this.OwnerArray[2], this.OwnerArray[4], this.OwnerArray[5]]
    );
  }

  public ChainTests(): void {
    // Persons
    const persons = this.PersonQuery.Select(p => p);
    // Persons with children
    const parents = persons
      .Where(person => person.Children.length > 0);

    // Persons with grandchildren
    const grandParents = parents
      .Where(person => Query(person.Children).Any(child => child.Children.length > 0));

    // Persons with great-grandchildren
    const greatGrandParents = grandParents
      .Where(person => Query(person.Children)
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
      p => Query(p.Children).SelectMany(child => child.Children).SelectMany(grandchild => grandchild.Children).Any(ggc => ggc.Name === p.Name)
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

  private Log(msg: string, data?: any) {
    this.OutputElement.innerText = this.OutputElement.innerText + '\r\n' + msg + (data ? ' :: ' + String(data) : '');
    if (data) {
      console.log(msg, data);
    } else {
      console.log(msg);
    }
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
      this.Log('[FAIL] ' + name, relevantData);
    } else {
      this.Log('[PASS] ' + name)
    }
  }

  private CreatePerson(name: string, ...children: Array<IPerson>): IPerson {
    const p: IPerson = { Name: name, Children: children };
    this.PersonArray.push(p);
    return p;
  }

}

// Run suite
export function Run() {
  // Run the suite
  (new LinqscriptTests()).RunSuite();

  // Expose Query() for testing
  (window as any).Query = Query;

  const example1 = 'Query([4,10,34,100]).Select(a=>a*2).ToArray()';
  const example2 = "Query(document.getElementsByTagName('head')).Take(1).SelectMany(head=>head.children).Where(elm=>elm instanceof HTMLScriptElement).Select(script=>script.src.replace('file:///','')).ToArray()";
  console.info('');
  console.info('Query exposed to global scope. Example usage:');
  console.info(example1, eval(example1));
  console.info('Or, get script sources from <head>');
  console.info(example2, eval(example2));
};