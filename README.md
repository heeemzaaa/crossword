# Crossword Puzzle Solver

## Overview

This project is a crossword puzzle solver built in JavaScript. It validates crossword inputs and solves them using **Constraint Propagation** and **Backtracking** algorithms.

## Features

- Validates word list and puzzle structure.
- Identifies valid word slots in the puzzle.
- Uses **Constraint Propagation** to narrow down possible words.
- Uses **Backtracking** to find a complete solution.
- Ensures an efficient and correct solution.

## Puzzle Validation

### 1. Validating Word List

The `checkWords(words)` function ensures:

- `words` is an array of unique, lowercase strings.
- Words contain only alphabetic characters.
- No duplicates exist.

### 2. Validating Puzzle Structure

The `checkPuzzle(emptyPuzzle)` function ensures:

- The puzzle is a valid string representation.
- Contains only valid characters: `0`, `1`, `2`, `.` and `\n`.

### 3. Validating Start Positions

The `validStarts(emptyPuzzle)` function ensures:

- `1` starts one word (horizontal **or** vertical).
- `2` starts two words (horizontal **and** vertical).
- Invalid placements are rejected.

### 4. Validating Word Lengths

The `checkLength(emptyPuzzle, words)` function ensures:

- The total number of letter slots matches the total length of words provided.

### 5. Final Validation

The `validateAll(emptyPuzzle, words)` function runs all validation checks before solving the puzzle.

## Solving the Puzzle

### 1. Identifying Word Slots

The `identifySlots(grid, wordsByLength)` function scans the grid for horizontal and vertical word slots.

### 2. Constraint Propagation

This technique eliminates impossible words before attempting backtracking.

- **Unique-Length Constraint**: If a slot has only one possible word, it is placed immediately.
- **Pattern Matching Constraint**: Words that don't match existing letters are eliminated.

### 3. Backtracking

If constraint propagation is insufficient, backtracking is used to:

- Try placing each remaining possible word.
- Remove words and backtrack if conflicts arise.
- Recursively search until a solution is found.

## Visual Representation

### Example Puzzle Input

```
.1.
102
.0.
```

### Example Animated Solution


## Running the Solver

To use the solver, call:

```javascript
const solution = crosswordSolver(puzzle, words);
console.log(solution);
```

## Future Improvements

- Support for larger grids.
- Optimized constraint propagation.
- Interactive UI for visualization.

## Conclusion

This project demonstrates how **constraint propagation** and **backtracking** can efficiently solve crossword puzzles, ensuring correctness and performance.

---


