import React from 'react';
import {Text, TextInput} from 'react-native';
import styles from '../styles.js';
import {boardPoints} from '../Points.js';

var boardPointsColors = {
    'DL': 'blue',
    'TL': 'green',
    'DW': 'pink',
    'TW': 'orange'
}

const BoardSquare = (props) => {

    function onPress() {
        props.onPress(props.row, props.col)
    }

    var style = styles.square
    if (props.focus) {
        var style = {...style, borderColor: "chartreuse", borderWidth: 3}
    }
    if (props.inPlay) {
        var style = {...style, backgroundColor: "aqua"}
    }
    if (props.isEmpty && boardPoints[props.row][props.col] != null) {
        var style = {...style, 
                    color: boardPointsColors[boardPoints[props.row][props.col]],
                    fontSize: 20}
    }

    return (
        <Text style={style}
        onPress={onPress}>{props.letter}</Text>
    )
}

export default BoardSquare;