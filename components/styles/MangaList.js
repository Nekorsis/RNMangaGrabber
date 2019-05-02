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
        borderRadius: 8,
        borderColor: 'blue',
        maxHeight: '35%',
        marginHorizontal: 1,
        borderStyle: 'solid',
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
        flex: 1,
        marginRight: 10,
        borderRightColor: vars.red,
        borderLeftColor: vars.green,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        alignItems: 'center',
        borderRadius: (5),
    },
    blockName: {
        fontWeight: 'bold',
        fontSize: 25,
        fontStyle: 'italic',
    },
});