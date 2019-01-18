/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMangaChaptersList } from '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/ChaptersList';

class ChaptersList extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        getMangaChaptersList: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { navigation: { state: { params: { manga } = {} } }, getMangaChaptersList } =  this.props;
        if (manga) {
            getMangaChaptersList(manga.link);
        }
    }

    openChapter = (chapter) => {
        const { navigation: { navigate } } =  this.props;
        navigate(screenNames.Chapter.name, { chapter });
    }

    keyExtractor = (item, index) => item.name || index.toString();

    render() {
        const { store: { mangaChapters: { mangaChaptersList, isLoading } = {} } } = this.props;
        return (
            !isLoading && (
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
));
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaChaptersList: bindActionCreators(getMangaChaptersList, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChaptersList);