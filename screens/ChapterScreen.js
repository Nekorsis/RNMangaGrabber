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

    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        fetchChapter: PropTypes.func.isRequired,
        changeLoadingState: PropTypes.func.isRequired,
        rejectChapterLoad: PropTypes.func.isRequired,
    };

    componentDidUpdate(prevProps) {
        const { navigation: { state: { params: { moduleName, chapter } = {} } }, fetchChapter } =  this.props;
        const { navigation } =  prevProps;
        if (chapter !== navigation.state.params.chapter) {
            fetchChapter(chapter.link, moduleName);
        }
      }

    componentDidMount() {
        const { navigation: { state: { params: { moduleName, chapter } = {} } }, fetchChapter } =  this.props;
        fetchChapter(chapter.link, moduleName);
    }

    componentWillUnmount() {
        const { changeLoadingState, rejectChapterLoad } = this.props;
        changeLoadingState(true, 'imagesInfo');
        rejectChapterLoad();
    }

    keyExtractor = (item, index) => item.name || index.toString();

    onLastImage = () => {
        const { navigation: { navigate, state: { params: { moduleName, index } = {} } }, 
            store: { mangaChapters: { mangaChaptersList } } } =  this.props;
        if (mangaChaptersList.length > index + 1) {
            navigate(screenNames.Chapter.name, { moduleName, index: index + 1, chapter: mangaChaptersList[index + 1] });
        }
    }

    renderCorrectView = () => {
        const { navigation: { state: { params: { isNovel = false } = {} } }, store: { imagesInfo: { imagesArray } } } =  this.props;
        return (
            isNovel ? 
                <NovelReader text={imagesArray} /> : 
                <ImageViewer onEndImagesArray={this.onLastImage} enablePreload imageUrls={imagesArray} />
            );
    }

    renderNavigation = () => {
    }

    render() {
        const { store: { imagesInfo: { isLoading, err }, mangaChapters: { progressBar } } } = this.props;
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

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
    fetchChapter: bindActionCreators(fetchChapter, dispatch),
    changeLoadingState: bindActionCreators(setLoadingState, dispatch),
    rejectChapterLoad: bindActionCreators(rejectChapterLoad, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chapter);