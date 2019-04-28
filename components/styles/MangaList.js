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
        // backgroundColor: 'red',
        // width: vars.width ,
    },
    itemImage: {
        width: 200,
        height: 200,
    },
    itemText: {
        alignSelf: 'flex-end',
    },
    itemScore: {
        position: 'absolute',
        left: '50%',
    },
    touchableOpacity: {
        // marginTop: 25,
        flex: 1,
        marginRight: 10,
        borderRightColor: vars.red,
        borderRightWidth: 2,
    },
    blockName: {
        fontWeight: 'bold',
        fontSize: 25,
        fontStyle: 'italic',
    },
    itemTextContainer: {
        maxWidth: '75%',
        display: 'flex',
        flexDirection: 'row',
    },
});