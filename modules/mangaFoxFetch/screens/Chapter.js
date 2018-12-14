import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Button,
    CheckBox,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchChapter } from '../actions';

class Chapter extends React.Component {
    componentDidMount() {
        const { params: { chapter } = {} } =  this.props.navigation.state;
        this.props.fetchChapter(chapter.link);
    }

    keyExtractor = (item, index) => item.name || index.toString();

    render() {
        return (
            <View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    store: state.mangaFoxReducer,
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);