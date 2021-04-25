import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import RackSquare from './RackSquare.js';

// takes a set of letters to display
// and a function to call when a letter is pressed
const Rack = (props) => {

    function makeRack() {
        var rack = []
        for (var i=0; i<props.letters.length; i++) {
            rack.push(<RackSquare 
                        key={(i).toString()}
                        letter={props.letters[i]} 
                        index={i}
                        onPress={props.onPress}
                        focus={isFocus(i)}
                        isTurn={props.isTurn}>
                      </RackSquare>)
        }
        return rack
    }

    function isFocus(index) {
        if (props.focusIndex != null) {
            if (props.focusIndex == index) {
                return true
            }
        }
        return false
    }

    return (
        <>
            <View style={{flex: 1, alignItems: "center"}}>
                <View style={{flexDirection: "row"}}>
                    {makeRack()}
                </View>
            </View>
        </>
    )
}

export default Rack;