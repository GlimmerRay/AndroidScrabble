
export class Index {
    constructor(row, col) {
        this.row = row
        this.col = col
    }

    neighbors(bounds) {
        var _neighbors = [this.getRightNeighbor(),
                          this.getLeftNeighbor(),
                          this.getTopNeighbor(),
                          this.getBottomNeighbor()]
        _neighbors = _neighbors.filter((index) => {
            return ((index.row >= 0 && index.row < bounds[0]) &&
                    (index.col >= 0 && index.col < bounds[1]))
        })
        return _neighbors
    }

    getRightNeighbor() {
        return new Index(this.row, this.col+1)
    }

    getLeftNeighbor() {
        return new Index(this.row, this.col-1)
    }

    getTopNeighbor() {
        return new Index(this.row-1, this.col)
    }

    getBottomNeighbor() {
        return new Index(this.row+1, this.col)
    }

    copy() {
        return new Index(this.row, this.col)
    }
}

export class Connection {
    constructor(direction, startIndex) {
        this.direction = direction
        this.startIndex = startIndex
    }
}

export class IndexGroup {
    constructor(indices) {
        this.indices = indices
    }

    isALine() {
        if (this.length() == 0) {return false}
        if (this.length() == 1) {return true}
        var [rows, cols] = [new Set(), new Set()]
        for (var index of this.indices) {
            rows.add(index.row)
            cols.add(index.col)
        }
        if (rows.size != 1 && cols.size != 1) {
            return false
        }
        return true
    }

    removeIndex(indexToRemove) {
        this.indices = this.indices.filter((index) => {
            return !(index.row == indexToRemove.row && index.col == indexToRemove.col)
        })
    }

    addIndex(indexToAdd) {
        this.indices.push(indexToAdd)
    }

    interpolate() {
        if (!this.isALine()) {throw 'Can only interpolate IndexGroup if it is a line.'}
        var interp = []
        var [min, max] = [this.min(), this.max()]
        if (this.isARow()) {
            var row = this.indices[0].row
            for (var col=min.col; col<=max.col; col++) {
                interp.push(new Index(row, col))
            }
        } else if (this.isACol) {
            var col = this.indices[0].col
            for (var row=min.row; row<=max.row; row++) {
                interp.push(new Index(row, col))
            }
        }
        return new IndexGroup(interp)
    }

    min() {
        if (!this.isALine()) {throw 'Can only get min of IndexGroup if it is a line.'}
        var min = this.indices[0]
        if (this.isARow()) {
            for (var i=0; i<this.length(); i++) {
                if (this.indices[i].col < min.col) {
                    min = this.indices[i]
                }
            }
        } else if (this.isACol()) {
            for (var i=0; i<this.length(); i++) {
                if (this.indices[i].row < min.row) {
                    min = this.indices[i]
                }
            }
        }
        return min
    }

    max() {
        if (!this.isALine()) {throw 'Can only get max of IndexGroup if it is a line.'}
        var max = this.indices[0]
        if (this.isARow()) {
            for (var i=0; i<this.length(); i++) {
                if (this.indices[i].col > max.col) {
                    max = this.indices[i]
                }
            }
        } else if (this.isACol()) {
            for (var i=0; i<this.length(); i++) {
                if (this.indices[i].row > max.row) {
                    max = this.indices[i]
                }
            }
        }
        return max
        
    }

    isARow() {
        if (!this.isALine()) {throw 'Can only check is a row of IndexGroup if it is a line.'}
        if (this.length() == 1) {
            return true
        } else if (this.indices[0].row == this.indices[1].row) {
            return true
        } else {
            return false
        }
    }

    isACol() {
        if (!this.isALine()) {throw 'Can only check is a row of IndexGroup if it is a line.'}
        if (this.length() == 1) {
            return true
        } else if (this.indices[0].col == this.indices[1].col) {
            return true
        } else {
            return false
        }
    }

    copy() {
        var _copy = []
        for (var index of this.indices) {_copy.push(index.copy())}
        return new IndexGroup(_copy)
    }

    neighbors(bounds) {
        var _neighbors = new Set([])
        for (var index of this.indices) {
            for (var neighbor of index.neighbors(bounds=bounds)) {
                if (!this.contains(neighbor)) {
                    _neighbors.add(neighbor)
                }
           }
        }
        return _neighbors
    }

    contains(index) {
        for (var _index of this.indices) {
            if (_index.row == index.row && _index.col == index.col) {
                return true
            }
        }
        return false
    }

    joinIndexGroup(other) {
        var jointGroup = new IndexGroup([])
        for (var index of this.indices) {
            jointGroup.addIndex(index)
        }
        for (var index of other.indices) {
            jointGroup.addIndex(index)
        }
        return jointGroup
    }

    getLines(otherIndexGroup) {

        if (otherIndexGroup.length() == 0) {
            return [this]
        }

        var lines = []
        var jointGroup = this.joinIndexGroup(otherIndexGroup)

        if (this.isARow()) {
            if (this.length() > 1) {
                lines.push(jointGroup.getContiguousSegment('row', this.min()))
            }
            for (var index of this.indices) {
                if (otherIndexGroup.contains(index.getTopNeighbor()) ||
                otherIndexGroup.contains(index.getBottomNeighbor())) {
                    lines.push(jointGroup.getContiguousSegment('col', index))
                }
            }
        } 
        if (this.isACol()) {
            if (this.length() > 1) {
                lines.push(jointGroup.getContiguousSegment('col', this.min()))
            }
            for (var index of this.indices) {
                if (otherIndexGroup.contains(index.getLeftNeighbor()) ||
                otherIndexGroup.contains(index.getRightNeighbor())) {
                    lines.push(jointGroup.getContiguousSegment('row', index))                    
                }
            }
        }
        return lines
    }

    hasGaps() {
        for (var index of this.interpolate().indices) {
            if (!this.contains(index)) {
                return false
            }
        }
        return true
    }

    getContiguousSegment(direction, startIndex) {
        var line = []
        if (direction == 'row') {
            line.push(startIndex)
            var indexToLeft = startIndex.getLeftNeighbor()
            while (this.contains(indexToLeft)) {
                line.push(indexToLeft)
                indexToLeft = indexToLeft.getLeftNeighbor()
            }
            var indexToRight = startIndex.getRightNeighbor()
            while(this.contains(indexToRight)) {
                line.push(indexToRight)
                indexToRight = indexToRight.getRightNeighbor()

            }
        }
        if (direction == 'col') {
            line.push(startIndex)
            var indexAbove = startIndex.getTopNeighbor()
            while (this.contains(indexAbove)) {
                line.push(indexAbove)
                indexAbove = indexAbove.getTopNeighbor()
            }
            var indexBelow = startIndex.getBottomNeighbor()
            while(this.contains(indexBelow)) {
                line.push(indexBelow)
                indexBelow = indexBelow.getBottomNeighbor()
            }
        }
        return new IndexGroup(line)
    }

    sort() {
        if (!this.isALine()) {throw 'Can only sort an IndexGroup if it is a line.'}
        if (this.length() == 1) {
            return this
        }
        var sorted = []
        if (this.isARow()) {
            var _next = (index) => {return index.getRightNeighbor()}
        } else if (this.isACol()) {
            var _next = (index) => {return index.getBottomNeighbor()}
        }
        var firstIndex = this.min()
        sorted.push(firstIndex)
        var nextIndex = _next(firstIndex)
        while (this.contains(nextIndex)) {
            sorted.push(nextIndex)
            nextIndex = _next(nextIndex)
        }
        return new IndexGroup(sorted)
    }

    length() {
        return this.indices.length
    }
}

// var one = new Index(0,0)
// var two = new Index(0,1)
// var three = new Index(0,2)
// var groupOne = new IndexGroup([one, two, three])


// var four = new Index(1,0)
// var five = new Index(2,0)
// var six = new Index(0,3)
// var groupTwo = new IndexGroup([four, five, six])

// // console.log(groupOne.joinIndexGroup(groupTwo))
// console.log(groupOne.getConnections(groupTwo))
// console.log(groupOne.getLines(groupTwo))