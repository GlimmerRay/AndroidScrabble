
export function makeNullGrid(width, height) {
    var board = []
    for (var row=0; row<height; row++) {
        board.push([])
        for (var col=0; col<width; col++) {
            board[row].push(null)
        }
    }
    return board
}

export function twoDArrayCopy(arr) {
    var arr_copy = []
    for (var row of arr) {
        arr_copy.push([...row])
    }
    return arr_copy
}