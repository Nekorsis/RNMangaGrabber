/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Progress from 'react-native-progress';


import { fetchChapter, rejectChapterLoad } from '../actions';
import { setLoadingState } from '../actions/common';
import { screenNames } from '../constants/consts';
import NovelReader from '../components/common/NovelReader';
import styles from './styles/Chapter';

class Header extends React.Component {
    render() {
        const { chapter } = this.props;
        return (
            <View style={{ alignItems: 'stretch', flex: 1, justifyContent: 'center'}}>
                <Text>{chapter.name}</Text>
            </View>
        );
    }
}

class Chapter extends React.Component {
    static navigationOptions = ({ navigation: { state: { params: { chapter } = {} } } }) => {
        return {
            headerTitle: <Header chapter={chapter} />,
        };
      };

    state = { preload: false, list: [] };

    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        fetchChapter: PropTypes.func.isRequired,
        changeLoadingState: PropTypes.func.isRequired,
        rejectChapterLoad: PropTypes.func.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        const { imagesPreload: { imagesPreviewList: prevPreviewList }, images: prevImages, navigation, changeLoadingState } = this.props;
        const { imagesPreload: { imagesPreviewList: nextPreviewList }, images,
        navigation: { state: { params: { chapter } = {} } } } = nextProps;
        if (prevPreviewList !== nextPreviewList) {
            return false;
        }
        if (this.state.preload === true && (chapter === navigation.state.params.chapter) && JSON.stringify(images) === JSON.stringify(prevImages) ) {
            return false;
        }
        // if (this.state.preload && 
        //     (images.imagesList[0] === prevImages.imagesList[0]) 
        //     && (chapter === navigation.state.params.chapter)) {
        //     return false;
        // }
        return true;
    }

    componentDidUpdate(prevProps) {
        const { navigation: { state: { params: { moduleName, chapter, index } = {} } }, fetchChapter, changeLoadingState,
        mangaChaptersList, imagesPreload: { imagesPreviewList,  preloadIndex } } =  this.props;
        const { navigation } =  prevProps;
        if (chapter !== navigation.state.params.chapter) {
            console.log('componentDidUpdate via chapter change', preloadIndex, index);
            if(preloadIndex === index) {
                this.setState({ preload: true, list: imagesPreviewList });
                if (mangaChaptersList.length > index + 1) {
                    fetchChapter(mangaChaptersList[index + 1].link, moduleName, index + 1, true, true);
                }
                changeLoadingState(false, 'imagesInfo.imagesArray');
                return;
            }
            changeLoadingState(true, 'imagesInfo.imagesArray');
            fetchChapter(chapter.link, moduleName, index);
        }
      }

    componentDidMount() {
        const { navigation: { state: { params: { moduleName, chapter, index } = {} } }, fetchChapter, changeLoadingState,
        mangaChaptersList } =  this.props;
        changeLoadingState(true, 'imagesInfo.imagesArray');
        fetchChapter(chapter.link, moduleName, index);
        if (mangaChaptersList.length > index + 1) {
            fetchChapter(mangaChaptersList[index + 1].link, moduleName, index + 1, true, true);
        }
    }

    componentWillUnmount() {
        const { changeLoadingState, rejectChapterLoad } = this.props;
        console.log('componentWillUnmount');
        changeLoadingState(true, 'imagesInfo.imagesArray');
        rejectChapterLoad();
    }

    keyExtractor = (item, index) => item.name || index.toString();

    onLastImage = () => {
        const { navigation: { navigate, state: { params: { moduleName, index } = {} } }, 
            mangaChaptersList, changeLoadingState } = this.props;
        changeLoadingState(true, 'imagesInfo.imagesArray');
        if (mangaChaptersList.length > index + 1) {
            navigate(screenNames.Chapter.name, { moduleName, index: index + 1, chapter: mangaChaptersList[index + 1] });
        }
    }

    renderCorrectView = () => {
        const { navigation: { state: { params: { isNovel = false } = {} } }, images: { imagesList } } =  this.props;
        const { list, preload } = this.state;
        const imagesArray = preload ? list : imagesList;
        console.log('tick');
        return (
            isNovel ? 
                <NovelReader text={imagesArray} /> : 
                <ImageViewer onEndImagesArray={this.onLastImage} imageUrls={imagesArray} />
            );
    }

    render() {
        const { images: { isLoading, progressBar }, err } = this.props;
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
                <View style={styles.progressContainer}>
                    <Progress.Circle size={80} showsText progress={progressBar} />
                </View>
                : this.renderCorrectView()
                }
            </View>
            );
    }
}

Chapter.displayName = 'ChapterScreen';

const mapStateToProps = ({ 
    appReducer: {
        mangaChapters: { mangaChaptersList },
        imagesInfoPreload: {
            imagesArray: { list: imagesPreviewList, index: preloadIndex }
        },
        imagesInfo: {
            err,
            imageCount,
            progressBar,
            imagesArray: { list: imagesList, isLoading }, 
        }}}) => ({
    images: { imagesList, isLoading, progressBar },
    imagesPreload: { imagesPreviewList, preloadIndex },
    mangaChaptersList,
    err,
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
    changeLoadingState: bindActionCreators(setLoadingState, dispatch),
    rejectChapterLoad: bindActionCreators(rejectChapterLoad, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);