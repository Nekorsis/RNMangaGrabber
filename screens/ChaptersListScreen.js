/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
    Button,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { getMangaChaptersList, fetchAll } from '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/ChaptersList';

class ChaptersList extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        getMangaChaptersList: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { navigation: { state: { params: { manga, moduleName } = {} } }, getMangaChaptersList } =  this.props;
        if (manga) {
            getMangaChaptersList(manga.link, moduleName);
        }
    }

    openChapter = (chapter) => {
        const { navigation: { navigate, state: { params: { moduleName } = {} } } } =  this.props;
        navigate(screenNames.Chapter.name, { chapter, moduleName });
    }

    keyExtractor = (item, index) => item.name || index.toString();

    downloadAllNovel = () => {
      const { navigation: { state: { params: { moduleName } = {} } }, store: { mangaChapters: { mangaChaptersList } = {} }, downloadAll } = this.props;
      console.log(moduleName);
      downloadAll(moduleName, mangaChaptersList);
    }

    render() {
        const { store: { mangaChapters: { mangaChaptersList, isLoading } = {} } } = this.props;
        return (
            isLoading ? 
              <ActivityIndicator /> 
            : (
              <React.Fragment>
                <View>
                  <Button
                    onPress={this.downloadAllNovel}
                    title="Download All"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                  />
                </View>
                <View>
                  <FlatList
                    data={mangaChaptersList}
                    keyExtractor={this.keyExtractor}
                    renderItem={({item}) => {
                        return (
                          <TouchableOpacity style={styles.touchableOpacity} onPress={() => this.openChapter(item)}>
                            <View style={styles.itemTextContainer}>
                              <Text style={styles.itemText}>{`${item.name}`}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                    }}
                  />
                </View>
              </React.Fragment>
));
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaChaptersList: bindActionCreators(getMangaChaptersList, dispatch),
    downloadAll: bindActionCreators(fetchAll, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChaptersList);