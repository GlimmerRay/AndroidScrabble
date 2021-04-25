import React, {useState, useEffect, useRef} from 'react';
import {View, Button} from 'react-native';
import Board from './Board.js';
import Rack from './Rack.js';
import styles from '../styles.js';
import {IndexGroup, Index} from '../IndexGroup.js';
import lettersArray from '../LetterCounts.js';
import {makeNullGrid, twoDArrayCopy} from '../utils.js';
import {letterPoints, boardPoints} from '../Points.js';
import wordIsValidEnglish from '../ScrabbleScraper.js';

const Game = (props) => {

    const [bag, setBag] = useState(lettersArray)
    const [rack, setRack] = useState([null, null, null, null, null, null, null])
    const [board, setBoard] = useState(makeNullGrid(9,9))
    const [play, setPlay] = useState(new IndexGroup([]))
    const [history, setHistory] = useState(makeNullGrid(9,9))
    const [historyIndices, setHistoryIndices] = useState(new IndexGroup([]))
    const [isFocus, setIsFocus] = useState(false)
    const [focusLocation, setFocusLocation] = useState(null)
    const [focusIndex, setFocusIndex] = useState(null)
    const [focusLetter, setFocusLetter] = useState(null)
    const [isFirstTurn, setIsFirstTurn] = useState(true)
    const [socket, setSocket] = useState(null)
    const [isTurn, setIsTurn] = useState(null)

    useEffect(() => draw(7), []) 
    useEffect(() => socketSetup(), [])

    function socketSetup() {
        s = new WebSocket('ws://10.0.2.2:8888')
        s.onmessage = (e) => {
            data = JSON.parse(e.data)
            console.log(data, '1')
            if (data.message_type === 'bag') {
                setBag(data.data)
            } else if (data.message_type === 'turn') {
                setIsTurn(data.data)
                setIsFirstTurn(data.data)
                console.log(data.data, '2')
            } else if (data.message_type == 'board_and_bag') {
                setBoard(data.data.board)
                setBag(data.data.bag)
                setHistory(data.data.board)
                setHistoryIndices(historyIndicesFromBoard(data.data.board))
            }
            else if (data.message_type == 'send bag') {
                s.send(JSON.stringify(bag))
            }
        }

        s.onerror = (e) => {

        };
        setSocket(s)
    }

    function onBoardPress(row, col) {
        if (!isTurn) {
            return
        }
        // click on an empty board cell
        if (isFocus && board[row][col] == null) { 
            moveFocusLetterToBoard(row, col)
        // click on a nonempty board cell which is in play
        } else if (board[row][col] != null && history[row][col] == null) {
            setFocus('board', new Index(row, col))
        }
    }
    
    function onRackPress(index) {
        if (!isTurn) {
            return
        }
        // click on an empty rack cell
        if (isFocus && rack[index] == null) {
            moveFocusLetterToRack(index)
        // click on a nonempty rack cell
        } else if (rack[index] != null) {
            setFocus('rack', index)
        }
    }

    function setFocus(boardOrRack, index) {
        setIsFocus(true)
        if (boardOrRack == 'board') {
            setFocusLocation('board')
            setFocusIndex(new Index(index.row, index.col))
            setFocusLetter(board[index.row][index.col])
        } else if (boardOrRack == 'rack') {
            setFocusLocation('rack')
            setFocusIndex(index)
            setFocusLetter(rack[index])
        }
    }

    function moveFocusLetterToBoard(row, col) {
        setBoard((prevBoard) => {
            var newBoard = [...prevBoard]
            newBoard[row][col] = focusLetter
            return newBoard
        })
        blankOutFocus()
        removeFocus()
        updatePlay(row, col)
    }

    function moveFocusLetterToRack(index) {
        if (focusLocation == 'board') {
            removeFocusFromPlay()
        }
        setRack((prevRack) => {
            var newRack = [...prevRack]
            newRack[index] = focusLetter
            return newRack
        })
        blankOutFocus()
        removeFocus()
    }

    function removeFocus() {
        setIsFocus(false)
        setFocusLetter(null)
        setFocusLocation(null)
        setFocusIndex(null)
    }

    function blankOutFocus() {
        if (focusLocation == 'board') {
            setBoard((prevBoard) => {
                var newBoard = [...prevBoard]
                const [row, col] = [focusIndex.row, focusIndex.col]
                newBoard[row][col] = null
                return newBoard
            })
        } else if (focusLocation == 'rack') {
            setRack((prevRack) => {
                var newRack = [...prevRack]
                newRack[focusIndex] = null
                return newRack
            })
        }
    }

    function removeFocusFromPlay() {
        setPlay((prevPlay) => {
            var newPlay = play.copy()
            newPlay.removeIndex(focusIndex)
            return newPlay
        })
    }

    function addToPlay(row, col) {
        setPlay((prevPlay) => {
            var newPlay = prevPlay.copy()
            newPlay.addIndex(new Index(row, col))
            return newPlay
        })
    }

    function updatePlay(row, col) {
        if (focusLocation == 'rack') {
            addToPlay(row, col)
        } else if (focusLocation == 'board') {
            removeFocusFromPlay()
            addToPlay(row, col)
        }
    }

    function indexGroupToWord(indexGroup) {
        var word = []
        for (var index of indexGroup.sort().indices) {
            var letter = board[index.row][index.col]
            word.push(letter)
        }
        return word.join('')
    }

    function indexGroupToPoints(indexGroup) {
        var wordMultiple = 1
        var wordPoints = 0
        for (var index of indexGroup.indices) {
            if (boardPoints[index.row][index.col] == 'DW' && history[index.row][index.col] == null) {
                wordMultiple *= 2
                wordPoints += letterPoints[board[index.row][index.col]]
            } else if (boardPoints[index.row][index.col] == 'TW' && history[index.row][index.col] == null) {
                wordMultiple *= 3
                wordPoints += letterPoints[board[index.row][index.col]]
            } else if (boardPoints[index.row][index.col] == 'DL' && history[index.row][index.col] == null) {
                wordPoints += 2*letterPoints[board[index.row][index.col]]
            } else if (boardPoints[index.row][index.col] == 'TL' && history[index.row][index.col] == null) {
                wordPoints += 3*letterPoints[board[index.row][index.col]]
            } else {
                wordPoints += letterPoints[board[index.row][index.col]]
            }
        }
        wordPoints = wordPoints * wordMultiple
        return wordPoints
    }

    function getPlayedWords(lines) {
        var words = []
        for (var line of lines) {
            var word = indexGroupToWord(line)
            words.push(word)
        }
        return words
    }

    function getPlayedPoints(lines) {
        var points = 0
        for (var line of lines) {
            points += indexGroupToPoints(line)
        }
        return points
    }

    function draw(numLetters) {
        var drawnLetters = bag.slice(0,7) // get the letters
        setBag((prevBag) => { // remove them from bag
            var newBag = [...prevBag]
            newBag.splice(0,numLetters)
            return newBag
        })
        setRack((prevRack) => { // put them on rack
            var newRack = [...prevRack]
            for (var i=0; i<newRack.length; i++) {
                if (newRack[i] == null) {
                    newRack[i] = drawnLetters.splice(0, 1)[0]
                }
            }
            return newRack
        })
    }

    function refillRack() {
        var nullCount = rack.filter((x) => x == null).length
        draw(nullCount)
    }

    async function playIsValidEnglish() {
        var lines = play.getLines(historyIndices)
        const words = getPlayedWords(lines)
        for (const word of words) {
            var wordIsValid = await wordIsValidEnglish(word)
            if (!wordIsValid) {
                return false
            }
        }
        return true
    }

    function playIsValidForm() {
        if (play.length == 0) {
            return false
        } else if (play.isALine() && playHasNoGaps() && isFirstTurn) {
            return true
        } else if (play.isALine() && playHasNoGaps() && playTouchesHistory()) {
            return true
        } else {
            return false
        }
    }

    function playHasNoGaps() {
        var interp = play.interpolate()
        for (var index of interp.indices) {
            if (board[index.row][index.col] == null) {
                return false
            }
        }
        return true
    }

    function playTouchesHistory() {
        for (var n of play.neighbors([9,9])) {
            if (history[n.row][n.col] != null) {
                return true
            }
        }
        return false
    }

    function sendData() {
        var payload = {
            'bag': bag,
            'board': board
        }
        socket.send(JSON.stringify(payload))
    }

    function historyIndicesFromBoard(board) {
        var historyIndices = new IndexGroup([])
        for (var row=0; row<9; row++) {
            for (var col=0; col<9; col++) {
                if (board[row][col] != null) {
                    var index = new Index(row, col)
                    historyIndices.addIndex(index)
                }
            }
        }
        return historyIndices
    }

    async function submitPlay() {
        if (!isTurn) {
            return
        }
        var validEnglish = await playIsValidEnglish()
        if (playIsValidForm() && validEnglish) {
            setHistory(twoDArrayCopy(board))
            setHistoryIndices((prevHistoryIndices) => {
                return prevHistoryIndices.joinIndexGroup(play)
            })
            setPlay(new IndexGroup([]))
            if (isFirstTurn) {
                setIsFirstTurn(false)
            }
            refillRack()
            sendData()
        } else {
            console.log('play is invalid')
        }
    }

    return (
        <View>
            <Board 
                letters={board}
                onPress={onBoardPress}
                focusIndex={focusLocation == 'board' ? focusIndex : null}
                boardPoints={boardPoints}
                play={play}>
            </Board>
            <View style={styles.container}>
                <View style={{marginBottom: 40}}>
                    <Button title='Submit' onPress={submitPlay}></Button>
                </View>
            </View>
            <Rack 
                letters={rack}
                onPress={onRackPress}
                focusIndex={focusLocation == 'rack' ? focusIndex : null}
                isTurn={isTurn}>
            </Rack>
        </View>
    )
}

export default Game;