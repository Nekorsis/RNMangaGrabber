import {
    StyleSheet,
} from 'react-native';

import vars from './vars';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: vars.white,
        display: 'flex',
    },
    contentContainer: {
        width: vars.width,
    },
    flatList: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'blue',
        maxHeight: '35%',
        // backgroundColor: 'red',
        // width: vars.width ,
    },
    itemImage: {
        width: 150,
        height: 150,
    },
    itemText: {
        textAlign: 'center',
        width: 150,

    },
    itemScore: {
        position: 'absolute',
        left: '50%',
    },
    touchableOpacity: {
        // marginTop: 25,
        flex: 1,
        // maxWidth: 250,
        marginRight: 10,
        borderRightColor: vars.red,
        borderLeftColor: vars.green,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    blockName: {
        fontWeight: 'bold',
        fontSize: 25,
        fontStyle: 'italic',
    },
    // itemTextContainer: {
    //     maxWidth: '80%',
    //     display: 'flex',
    //     flexDirection: 'row',
    // },
});