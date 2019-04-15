import {
    StyleSheet,
} from 'react-native';

import vars from './vars';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: vars.white,
    },
    touchableOpacity: {
        marginTop: 25,
    },
    siteImage: {
        width: vars.width,
        height: 200,
        backgroundColor: vars.red,
    },
    siteContainer: {
        width: vars.width,
        height: vars.height,
    }
});