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
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchChapter, setLoadingState, rejectChapterLoad } from '../actions';

class Chapter extends React.Component {
    componentDidMount() {
        const { params: { chapter } = {} } =  this.props.navigation.state;
        this.props.fetchChapter(chapter.link);
    }

    componentWillUnmount() {
        this.props.changeLoadingState(true, 'imagesInfo');
        this.props.rejectChapterLoad();
    }

    keyExtractor = (item, index) => item.name || index.toString();

    render() {
        const { store: { imagesInfo: { isLoading, imagesArray } } } = this.props;
        return (
          <View style={styles.container}>
            {!isLoading &&
                <ImageViewer imageUrls={imagesArray} />
                }
          </View>
        );
    }
}

const mapStateToProps = state => ({
    store: state.mangaFoxReducer,
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
    changeLoadingState: bindActionCreators(setLoadingState, dispatch),
    rejectChapterLoad: bindActionCreators(rejectChapterLoad, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});