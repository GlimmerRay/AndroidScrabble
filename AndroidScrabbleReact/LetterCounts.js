var letterCounts = {
    'A': 4, 'B': 1, 'C': 1, 'D': 1, 'E': 4,
    'F': 2, 'G': 1, 'H': 2, 'I': 4, 'J': 0,
    'K': 1, 'L': 2, 'M': 1, 'N': 2, 'O': 4,
    'P': 1, 'Q': 0, 'R': 2, 'S': 2, 'T': 2,
    'U': 1, 'V': 0, 'W': 1, 'X': 0, 'Y': 0,
    'Z': 0
}

function makeArrayFromCounts(itemCounts) {
    var items = []
    for (var [item, count] of Object.entries(itemCounts)) {
        for (var i=0; i<count; i++) {
            items.push(item)
        }
    }
    return items
}

function shuffle(arr) {
    var i = arr.length
    while (i > 0) {
        randomIndex = Math.floor(Math.random()*i)
        randomValue = arr[randomIndex]
        arr[randomIndex] = arr[i-1]
        arr[i-1] = randomValue
        i = i - 1
    }
}

var lettersArray = makeArrayFromCounts(letterCounts)
shuffle(lettersArray)
export default lettersArray