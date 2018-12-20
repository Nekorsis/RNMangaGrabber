/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchChapter, setLoadingState, rejectChapterLoad } from '../actions';
import { reducerName } from '../config/consts';
import styles from '../styles/Chapter';

class Chapter extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        fetchChapter: PropTypes.func.isRequired,
        changeLoadingState: PropTypes.func.isRequired,
        rejectChapterLoad: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { navigation: { state: { params: { chapter } = {} } }, fetchChapter } =  this.props;
        fetchChapter(chapter.link);
    }

    componentWillUnmount() {
        const { changeLoadingState, rejectChapterLoad } =  this.props;
        changeLoadingState(true, 'imagesInfo');
        rejectChapterLoad();
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
    store: state[reducerName],
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
    changeLoadingState: bindActionCreators(setLoadingState, dispatch),
    rejectChapterLoad: bindActionCreators(rejectChapterLoad, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);