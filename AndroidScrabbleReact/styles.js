import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    square: {
        width: Dimensions.get('window').width/9, 
        height: Dimensions.get('window').width/9, 
        lineHeight: Dimensions.get('window').width/9,
        color: "black",
        backgroundColor: "red",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        borderWidth: 1,
        borderColor: "black"
    },
    // focus: {
    //     width: Dimensions.get('window').width/9, 
    //     height: Dimensions.get('window').width/9, 
    //     lineHeight: Dimensions.get('window').width/9,
    //     backgroundColor: "red",
    //     textAlign: "center",
    //     fontWeight: "bold",
    //     fontSize: 30,
    //     borderWidth: 2,
    //     borderColor: "white"
    // }
});

export default styles;