/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ActivityIndicator,
    Text,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { fetchChapter, rejectChapterLoad } from '../actions';
import { setLoadingState } from '../actions/common';
import NovelReader from '../components/common/NovelReader';
import styles from './styles/Chapter';

class Chapter extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        fetchChapter: PropTypes.func.isRequired,
        changeLoadingState: PropTypes.func.isRequired,
        rejectChapterLoad: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { navigation: { state: { params: { chapter, moduleName } = {} } }, fetchChapter } =  this.props;
        fetchChapter(chapter.link, moduleName);
    }

    componentWillUnmount() {
        const { changeLoadingState, rejectChapterLoad } = this.props;
        changeLoadingState(true, 'imagesInfo');
        rejectChapterLoad();
    }

    keyExtractor = (item, index) => item.name || index.toString();

    renderCorrectView = () => {
        const { navigation: { state: { params: { isNovel = false } = {} } }, store: { imagesInfo: { imagesArray } } } =  this.props;
        return (isNovel ? <NovelReader text={imagesArray} /> : <ImageViewer imageUrls={imagesArray} />);
    }

    renderNavigation = () => {
    }

    render() {
        const { store: { imagesInfo: { isLoading, err } } } = this.props;
        if (isLoading && err) {
            return (
              <View> 
                <Text> 
                  {err.toString()} 
                </Text>
              </View>
            );
        }
        return (
            <View style={styles.container}>
                {isLoading ? 
                <View>
                    <ActivityIndicator size="large" color="#0000ff" />

                </View>
                : this.renderCorrectView()
                }
            </View>
            );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
    changeLoadingState: bindActionCreators(setLoadingState, dispatch),
    rejectChapterLoad: bindActionCreators(rejectChapterLoad, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);