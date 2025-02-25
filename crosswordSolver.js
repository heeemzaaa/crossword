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


