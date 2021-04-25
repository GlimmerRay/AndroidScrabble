var letterCounts = {
    'A': 4, 'B': 1, 'C': 1, 'D': 1, 'E': 4,
    'F': 2, 'G': 1, 'H': 2, 'I': 4, 'J': 1,
    'K': 1, 'L': 2, 'M': 1, 'N': 2, 'O': 4,
    'P': 1, 'Q': 0, 'R': 2, 'S': 2, 'T': 2,
    'U': 1, 'V': 1, 'W': 1, 'X': 0, 'Y': 1,
    'Z': 0
}

export class Bag {
    constructor(itemCounts) {
        this.items = this.makeArray(itemCounts)
    }

    draw() {
        if (this.items.length == 0) {
            return null
        } else {
            var randomIndex = Math.floor(Math.random()*this.items.length)
            return this.items.splice(randomIndex, 1)[0]
        }
    }

    drawMany(howMany) {
        var items = []
        for (var i=0; i<howMany; i++) {
            var item = this.draw()
            if (item == null) {
                return items
            } else {
                items.push(item)
            }
        }
        return items
    }

    makeArray(itemCounts) {
        var items = []
        for (var [item, count] of Object.entries(itemCounts)) {
            for (var i=0; i<count; i++) {
                items.push(item)
            }
        }
        return items
    }
}

// var bag = new Bag(letterCounts)

// for (var i=0; i<30; i++) {
//     console.log(bag.items)
//     console.log(bag.draw())
// }