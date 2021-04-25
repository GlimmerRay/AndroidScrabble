import React, {useState} from 'react';
import {Text, View} from 'react-native';
import styles from '../styles.js';

const RackSquare = (props) => {
    // console.log('rack sq')
    // console.log(props)
    // console.log('rack sq')

    function onPress() {
        props.onPress(props.index)
    }

    var style = styles.square
    style = {...style, backgroundColor: "aqua"}
    if (props.focus) {
        var style = {...style, borderColor: "chartreuse", borderWidth: 3}
    }
    if (!props.isTurn) {
        style = {...style, backgroundColor: "#00AAAA"}
    }

    return (
        <Text style={style} 
            onPress={onPress}>{props.letter}</Text>
    )
}

export default RackSquare;