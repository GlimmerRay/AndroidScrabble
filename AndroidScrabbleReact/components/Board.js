import React, {useState} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import styles from '../styles.js';
import BoardSquare from './BoardSquare.js';
import {Index} from '../IndexGroup.js';


const Board = (props) => {

    function makeBoard() {
        var board = []
        for (var row=0; row<props.letters.length; row++) {
            for (var col=0; col<props.letters[0].length; col++) {
                var key = row.toString() + col.toString()
                var letter = props.letters[row][col]
                var boardPoints = props.boardPoints[row][col]
                board.push(<BoardSquare 
                    key={key} 
                    letter={letter != null ? letter : boardPoints}
                    isEmpty={letter ? false : true}
                    row={row} 
                    col={col}
                    onPress={props.onPress}
                    focus={isFocus(row, col)}
                    inPlay={inPlay(row, col)}>
                </BoardSquare>)
            }
        }
        return board
    }

    function isFocus(row, col) {
        if (props.focusIndex != null) {
            if (props.focusIndex.row == row & props.focusIndex.col == col) {
                return true
            }
        }
        return false
    }

    function inPlay(row, col) {
        if (props.play.contains(new Index(row, col))) {
            return true
        }
        return false
    }

    return (
        <>
        <View style={styles.container}>
            {makeBoard()}
            {/* <View style={{marginBottom: 40}}>
                <Button title="Submit"></Button>
            </View> */}
        </View>
        </>
    )
}

export default Board;