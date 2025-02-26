function checkWords(words) {
    const pattern = /^[^a-z]+$/
    if ((!(Array.isArray(words)) && (!(words instanceof Set))) || words.length === 0) {
        return false
    }
    for (let i = 0; i < words.length - 1; i++) {
        if (typeof words[i] !== 'string') {
            return false
        } else if (pattern.test(words[i])) {
            return false
        }
        for (let j = i + 1; j < words.length; j++) {
            if (words[i] === words[j]) {
                return false
            }
        }
    }
    return true
}


function checkPuzzle(emptyPuzzle) {
    let validInputs = /^[.012\n]+$/
    if ((typeof emptyPuzzle !== 'string') || (emptyPuzzle === "")) {
        return false
    }
    return validInputs.test(emptyPuzzle)
}

function splitPuzzle(emptyPuzzle) {
    let lines = emptyPuzzle.split('\n')
    let holder = []
    let result = []
    for (let i = 0 ; i < lines.length ; i++) {
        holder.push(...lines[i])
        result.push(holder)
        holder = []
    }
    return result
}

function validStarts(emptyPuzzle) {
    validPuzzle = checkPuzzle(emptyPuzzle)
    if (!validPuzzle) {
        return false
    }
    emptyPuzzle = splitPuzzle(emptyPuzzle)
    for (let i = 0; i < emptyPuzzle.length; i++) {
        for (let j = 0; j < emptyPuzzle[i].length; j++) {
            if (emptyPuzzle[i][j] === '1') {
                if ((emptyPuzzle[i][j+1] === '.') && (emptyPuzzle[i+1][j] === '.')) {
                    return false
                }
            } else if (emptyPuzzle[i][j] === '2') {
                if ((emptyPuzzle[i][j+1] === '.') || (emptyPuzzle[i+1][j] === '.')) {
                    return false
                }
            }
        }
    }
    return true
}

function checkLength(emptyPuzzle , words) {
    emptyPuzzle = splitPuzzle(emptyPuzzle)
    let puzzleCounter = 0
    let wordsCounter = 0
    for (let i = 0 ; i < emptyPuzzle.length ; i++) {
        for (let j = 0 ; j < emptyPuzzle[i].length ; j++) {
            if (emptyPuzzle[i][j] === '0') {
                puzzleCounter++
            } else if (emptyPuzzle[i][j] === '1') {
                puzzleCounter+=2
            } else if (emptyPuzzle[i][j] === '2') {
                puzzleCounter+=3
            }
        }
    }

    if (Array.isArray(words)) {
        for (let i = 0 ; i < words.length ; i++) {
            for (let j = 0 ; j < words[i].length ; j++) {
                wordsCounter++
            }
        }
    } else {
        for (let word of words) {
            for (let i = 0 ; i < word.length ; i++) {
                wordsCounter++
            }
        }
    }
    return puzzleCounter === wordsCounter
}


function validateAll(emptyPuzzle , words) {
    return checkWords(words) && checkPuzzle(emptyPuzzle) && validStarts(emptyPuzzle) && checkLength(emptyPuzzle , words)
}


function SetToArray(words) {
    let result = []
    if (words instanceof Set) {
        for (let word of words) {
            result.push(word)
        }
    } else {
        return words
    }
    return result
}


///////////////////////////////////


const crosswordSolver = (puzzle, words) => {
    if (!validateAll(puzzle, words)) {
        console.log('Error')
        return
    }  
    // Parse the puzzle into a 2D grid
    const grid = splitPuzzle(puzzle)

    // Step 1: Group words by length
    const wordsByLength = groupWordsByLength(words)

    // Step 2: Identify slots in the grid
    const slots = identifySlots(grid, wordsByLength)

    // Steps 3 & 4: Apply constraint propagation
    let modified = true;
    while (modified) {
        // Apply uniqueness constraints
        const result1 = applyUniqueLengthConstraint(slots, grid)
        const result2 = applyPatternConstraint(slots, grid)

        modified = result1 || result2
    }

    // Step 5: Apply backtracking for remaining slots
    const filledSlots = backtrackSolve(slots, grid)

    // If solution found, update the grid
    if (filledSlots) {
        filledSlots.forEach(slot => {
            if (slot.word) {
                placeWord(grid, slot, slot.word)
            }
        });
    }

    // Step 6: Convert the solution back to a string
    return gridToString(grid);
}

const groupWordsByLength = (words) => {
    const result = {}

    words.forEach(word => {
        const wordlen = word.length
        if (!result[wordlen]) {
            result[wordlen] = []
        }
        result[wordlen].push(word)
    })

    return result
}

const identifySlots = (grid, wordsByLength) => {
    const slots = []
    const height = grid.length
    const width = grid[0].length

    // Find horizontal slots
    for (let y = 0; y < height; y++) {
        let x = 0;
        while (x < width) {
            // Check if this is the start of a horizontal word
            if ((grid[y][x] === '1' || grid[y][x] === '2') && (x + 1 < width) && (grid[y][x + 1] === '0' || grid[y][x + 1] === '1' || grid[y][x + 1] === '2')) {
                // Found start of a horizontal word
                const start = [y, x]
                let length = 1
                let end = x

                // Find the end of this word
                while (end + 1 < width && (grid[y][end + 1] === '0' || grid[y][end + 1] === '1' || grid[y][end + 1] === '2')) {
                    end++
                    length++
                }
                let possibleWords;
                if (wordsByLength[length]) {
                    // If there are words of this length, make a copy of the array
                    possibleWords = [...wordsByLength[length]];
                } else {
                    // If there are no words of this length, use an empty array
                    possibleWords = [];
                }

                slots.push({
                    start,
                    end: [y, end],
                    direction: 'horizontal',
                    length,
                    possibleWords: possibleWords,
                    word: null
                });

                x = end + 1;
            } else {
                x++;
            }
        }
    }

    // Find vertical slots
    for (let x = 0; x < width; x++) {
        let y = 0
        while (y < height) {
            // Check if this is the start of a vertical word
            if ((grid[y][x] === '1' || grid[y][x] === '2') && (y + 1 < height) && (grid[y + 1][x] === '0' || grid[y + 1][x] === '1' || grid[y + 1][x] === '2')) {
                // Found start of a vertical word
                const start = [y, x]
                let length = 1
                let end = y

                // Find the end of this word
                while (end + 1 < height && (grid[end + 1][x] === '0' || grid[end + 1][x] === '1' || grid[end + 1][x] === '2')) {
                    end++;
                    length++;
                }
                let possibleWords;
                if (wordsByLength[length]) {
                    // If there are words of this length, make a copy of the array
                    possibleWords = [...wordsByLength[length]]
                } else {
                    // If there are no words of this length, use an empty array
                    possibleWords = [];
                }

                slots.push({
                    start,
                    end: [end, x],
                    direction: 'vertical',
                    length,
                    possibleWords: possibleWords,
                    word: null
                });

                y = end + 1;
            } else {
                y++;
            }
        }
    }

    return slots;
}

const applyUniqueLengthConstraint = (slots, grid) => {
    let modified = false;

    // Find slots with unique length that match a unique word
    slots.forEach(slot => {
        if (!slot.word && slot.possibleWords.length === 1) {
            const word = slot.possibleWords[0]

            // Place the word in the grid
            placeWord(grid, slot, word)

            // Mark this slot as filled
            slot.word = word;

            // Remove this word from all other slots' possible words
            slots.forEach(otherSlot => {
                if (otherSlot !== slot && !otherSlot.word) {
                    const index = otherSlot.possibleWords.indexOf(word);
                    if (index !== -1) {
                        otherSlot.possibleWords.splice(index, 1)
                    }
                }
            })

            modified = true;
        }
    })

    return modified
}

const applyPatternConstraint = (slots, grid) => {
    let modified = false

    slots.forEach(slot => {
        if (!slot.word && slot.possibleWords.length > 1) {
            // Get the current pattern from the grid
            const pattern = getCurrentPattern(grid, slot)

            // Filter possible words that match the pattern
            const matchingWords = slot.possibleWords.filter(word =>
                matchesPattern(word, pattern)
            )

            // If only one word matches, place it
            if (matchingWords.length === 1) {
                const word = matchingWords[0]
                placeWord(grid, slot, word)
                slot.word = word

                // Remove this word from all other slots' possible words
                slots.forEach(otherSlot => {
                    if (otherSlot !== slot && !otherSlot.word) {
                        const index = otherSlot.possibleWords.indexOf(word)
                        if (index !== -1) {
                            otherSlot.possibleWords.splice(index, 1)
                        }
                    }
                })

                modified = true
            } else {
                // Update possible words to only those matching the pattern
                slot.possibleWords = matchingWords
            }
        }
    })

    return modified
}

const getCurrentPattern = (grid, slot) => {
    const [startY, startX] = slot.start
    const pattern = []

    if (slot.direction === 'horizontal') {
        for (let i = 0; i < slot.length; i++) {
            pattern.push(grid[startY][startX + i])
        }
    } else {
        for (let i = 0; i < slot.length; i++) {
            pattern.push(grid[startY + i][startX])
        }
    }

    return pattern
}

const matchesPattern = (word, pattern) => {
    if (word.length !== pattern.length) {
        return false
    }
    for (let i = 0; i < word.length; i++) {
        // Skip if the pattern character is a number (not filled yet)
        if (pattern[i] === '0' || pattern[i] === '1' || pattern[i] === '2') {
            continue
        }
        // If there's a letter in the pattern, it must match the word
        if (pattern[i] !== word[i]) {
            return false
        }
    }

    return true
}

const placeWord = (grid, slot, word) => {
    const [startY, startX] = slot.start

    if (slot.direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            grid[startY][startX + i] = word[i]
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            grid[startY + i][startX] = word[i]
        }
    }
}

const backtrackSolve = (slots, grid) => {
    // Sort slots by number of possible words (min first)
    const unfilledSlots = slots.filter(slot => !slot.word)
        .sort((a, b) => a.possibleWords.length - b.possibleWords.length)

    if (unfilledSlots.length === 0) {
        return slots // All slots are filled
    }

    // Make a copy of the grid for backtracking
    const gridCopy = grid.map(row => [...row])

    if (backtrack(slots, unfilledSlots, 0, gridCopy)) {
        return slots
    } else {
        return null
    }

}

const backtrack = (allSlots, unfilledSlots, index, grid) => {
    // If we've filled all slots, we're done
    if (index >= unfilledSlots.length) return true

    const currentSlot = unfilledSlots[index]

    // Try each possible word
    for (const word of currentSlot.possibleWords) {
        // Check if we can place this word without conflicts
        if (canPlaceWord(grid, currentSlot, word)) {
            // Place the word temporarily
            placeWord(grid, currentSlot, word)
            currentSlot.word = word;

            // Remove this word from other slots' possible words
            const savedPossibilities = {}
            allSlots.forEach(slot => {
                if (!slot.word && slot !== currentSlot) {
                    savedPossibilities[`${slot.start[0]}-${slot.start[1]}-${slot.direction}`] = [...slot.possibleWords]
                    const index = slot.possibleWords.indexOf(word)
                    if (index !== -1) {
                        slot.possibleWords.splice(index, 1)
                    }
                }
            })

            // Continue with the next slot
            if (backtrack(allSlots, unfilledSlots, index + 1, grid)) {
                return true;
            }

            // Backtrack: remove the word and restore possible words
            currentSlot.word = null
            allSlots.forEach(slot => {
                if (!slot.word && slot !== currentSlot) {
                    const key = `${slot.start[0]}-${slot.start[1]}-${slot.direction}`
                    if (savedPossibilities[key]) {
                        slot.possibleWords = savedPossibilities[key]
                    }
                }
            })

            // Remove the word from the grid (restore grid state)
            const [startY, startX] = currentSlot.start;
            if (currentSlot.direction === 'horizontal') {
                for (let i = 0; i < currentSlot.length; i++) {
                    // Restore original grid value
                    const originalValue = puzzle.split('\n')[startY][startX + i]
                    grid[startY][startX + i] = originalValue
                }
            } else {
                for (let i = 0; i < currentSlot.length; i++) {
                    // Restore original grid value
                    const originalValue = puzzle.split('\n')[startY + i][startX]
                    grid[startY + i][startX] = originalValue
                }
            }
        }
    }

    return false // No solution found for this path
}

const canPlaceWord = (grid, slot, word) => {
    const [startY, startX] = slot.start;

    if (slot.direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            const cell = grid[startY][startX + i];
            // If the cell already has a letter (not a number), it must match
            if (!(cell === '0' || cell === '1' || cell === '2') && cell !== word[i]) {
                return false;
            }
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            const cell = grid[startY + i][startX];
            // If the cell already has a letter (not a number), it must match
            if (!(cell === '0' || cell === '1' || cell === '2') && cell !== word[i]) {
                return false;
            }
        }
    }

    return true;
}

const gridToString = (grid) => {
    return grid.map(row => row.join('')).join('\n')
}


odule.exports = { crosswordSolver }

