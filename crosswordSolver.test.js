const { crosswordSolver } = require('./crosswordSolver')

describe('Crossword Solver Tests', () => {
  // Basic test case from the original example
  test('Basic crossword test 1', () => {
    const puzzle = '2001\n0..0\n1000\n0..0'
    const words = ['casa', 'alan', 'ciao', 'anta']
    const expected = 'casa\ni..l\nanta\no..n'
    
    // Redirect console.log to capture the output
    const originalLog = console.log
    let output = ''
    console.log = (message) => {
      output = message
    }
    
    crosswordSolver(puzzle, words);
    console.log = originalLog;
    
    expect(output).toBe(expected);
  })

  // Larger crossword test
  test('Larger summer-themed crossword', () => {
    const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
    
    const words = [
      'sun',
      'sunglasses',
      'suncream',
      'swimming',
      'bikini',
      'beach',
      'icecream',
      'tan',
      'deckchair',
      'sand',
      'seaside',
      'sandals',
    ]
    
    const expected = `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = ''
    console.log = (message) => {
      output = message;
    }
    
    crosswordSolver(puzzle, words);
    console.log = originalLog;
    
    expect(output).toBe(expected);
  })

  // Food-themed crossword
  test('Food-themed crossword', () => {
    const puzzle = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`
    
    const words = [
      'popcorn',
      'fruit',
      'flour',
      'chicken',
      'eggs',
      'vegetables',
      'pasta',
      'pork',
      'steak',
      'cheese',
    ]
    
    const expected = `..p.f..v...
flour..eggs
..p.u..g...
..chicken..
..o.t..t...
pork..pasta
..n.s..b...
....t..l...
..cheese...
....a..s...
....k......`
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = ''
    console.log = (message) => {
      output = message
    }
    
    crosswordSolver(puzzle, words)
    console.log = originalLog
    
    expect(output).toBe(expected)
  })

  // Test with reversed words (order shouldn't matter)
  test('Crossword with reversed word order', () => {
    const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
    
    const words = [
      'sun',
      'sunglasses',
      'suncream',
      'swimming',
      'bikini',
      'beach',
      'icecream',
      'tan',
      'deckchair',
      'sand',
      'seaside',
      'sandals',
    ].reverse()
    
    const expected = `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`
    
    // Redirect console.log to capture the output
    const originalLog = console.log
    let output = ''
    console.log = (message) => {
      output = message
    };
    
    crosswordSolver(puzzle, words)
    console.log = originalLog
    
    expect(output).toBe(expected)
  })

  // Error handling tests
  test('Error: Mismatch between number of input words and puzzle starting cells', () => {
    const puzzle = '2001\n0..0\n2000\n0..0'
    const words = ['casa', 'alan', 'ciao', 'anta']
    
    // Redirect console.log to capture the output
    const originalLog = console.log
    let output = ''
    console.log = (message) => {
      output = message
    }
    
    expect(() => {
      crosswordSolver(puzzle, words)
      console.log = originalLog
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog
  })

  test('Error: Starting words higher than 2', () => {
    const puzzle = '0001\n0..0\n3000\n0..0';
    const words = ['casa', 'alan', 'ciao', 'anta'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: Word repetition', () => {
    const puzzle = '2001\n0..0\n1000\n0..0';
    const words = ['casa', 'casa', 'ciao', 'anta'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: Empty puzzle', () => {
    const puzzle = '';
    const words = ['casa', 'alan', 'ciao', 'anta'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: Wrong format - puzzle is not a string', () => {
    const puzzle = 123;
    const words = ['casa', 'alan', 'ciao', 'anta'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: Wrong format - words is not an array', () => {
    const puzzle = '2001\n0..0\n1000\n0..0';
    const words = 123;
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: Multiple solutions', () => {
    const puzzle = '2000\n0...\n0...\n0...';
    const words = ['abba', 'assa'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  test('Error: No solution', () => {
    const puzzle = '2001\n0..0\n1000\n0..0';
    const words = ['aaab', 'aaac', 'aaad', 'aaae'];
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    let output = '';
    console.log = (message) => {
      output = message;
    };
    
    expect(() => {
      crosswordSolver(puzzle, words);
      console.log = originalLog;
    }).toThrow();
    
    // Restore console.log
    console.log = originalLog;
  });

  // Performance test
  test('Performance test - solution found within reasonable time', () => {
    const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;
    
    const words = [
      'sun',
      'sunglasses',
      'suncream',
      'swimming',
      'bikini',
      'beach',
      'icecream',
      'tan',
      'deckchair',
      'sand',
      'seaside',
      'sandals',
    ];
    
    // Measure execution time
    const startTime = new Date().getTime();
    
    // Redirect console.log to capture the output
    const originalLog = console.log;
    console.log = () => {};
    
    crosswordSolver(puzzle, words);
    
    // Restore console.log
    console.log = originalLog;
    
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    
    // Expect execution time to be less than 5 seconds (adjust as needed)
    expect(executionTime).toBeLessThan(5000);
  });
});
