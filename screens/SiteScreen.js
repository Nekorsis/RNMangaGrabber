/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Button,
    CheckBox,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMangaListAsync, fetchMangaGenresAsync, searchMangaAsync, setGenreCheckbox, changeModuleName } from '../actions';
import right_arrow from '../assets/images/right_arrow.png';
import { screenNames } from '../constants/consts';
import Filter from '../utils/filter'; 
import styles from './styles/Main';

class Main extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        getMangaList: PropTypes.func.isRequired,
        store: PropTypes.shape({}).isRequired,
        changeGenreCheckbox: PropTypes.func.isRequired,
        changeModule: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.filter = new Filter();
        this.state = { currentPage: 1 };
    }

    componentDidMount() {
        const { getMangaList, navigation: { state: { params: { moduleName } = {} } }, store, changeModule } = this.props;
        this.moduleName = moduleName;
        // getting module name from params, used when we will dispatch actions.
        if(store.moduleName !== moduleName) {
            changeModule(moduleName);
            getMangaList(this.filter.getFilterString(), moduleName);
            this.initializeGenres();
        }
        // getMangaList(this.filter.getFilterString(), moduleName);
        // this.initializeGenres();
    }

    keyExtractor = (item, index) => item.name || index.toString();

    initializeGenres = async () => {
        const { getMangaGenres } = this.props;
        getMangaGenres(this.moduleName);
    }

    openMangaLink = (manga) => {
        const { navigation: { navigate } } = this.props;
        navigate(screenNames.ChaptersList.name, { manga, moduleName: this.moduleName });
    }

    onPressNextPage = async () => {
        const { currentPage } = this.state;
        const { getMangaList } = this.props;
        const nextPage = currentPage + 1;
        this.setState({ currentPage: nextPage});
        this.filter.setPage(nextPage);
        await getMangaList(this.filter.getFilterString(), this.moduleName);
    }

    onPressPrevPage = async () => {
        const { currentPage } = this.state;
        const { getMangaList } = this.props;
        if(currentPage < 2) {
            return;
        }
        const nextPage = currentPage - 1;
        this.setState({ currentPage: nextPage });
        this.filter.setPage(nextPage);
        await getMangaList(this.filter.getFilterString(), this.moduleName);
    }

    generateGenreCheckboxes = () => {
        const { store: { mangaGenres } } = this.props;
        if (mangaGenres === null || mangaGenres === undefined) {
            return;
        }
        return (
          <FlatList
            style={styles.flatListCheckboxes}
            numColumns={3}
            data={mangaGenres}
            keyExtractor={this.keyExtractor}
            renderItem={({item}) => {
                    return (
                      <View key={item.index} style={styles.checkbox}>
                        <CheckBox value={item.isActive} onValueChange={() => this.changeCheckbox(item.index)} />
                        <Text style={styles.checkboxText}>
                          {item.name}
                        </Text>
                      </View>
                    );
                }}
          />
        );
    }

    changeCheckbox = (index) => {
        const { store: { mangaGenres }, changeGenreCheckbox } = this.props;
        if (mangaGenres && mangaGenres[index]) {
            changeGenreCheckbox(index, !mangaGenres[index].isActive);
            if (mangaGenres[index].isActive) {
                this.filter.removeGenre(mangaGenres[index]);
            } else {
                this.filter.addGenre(mangaGenres[index]);
            }
        }
    }

    onPressStartSearch = () => {
        const { getMangaList } = this.props;
        this.setState({ currentPage: 1 });
        this.filter.setPage(1);
        getMangaList(this.filter.getFilterString());
    }

    handleRightArrowPress = () => {
        this.scrollView.scrollToEnd();
    }

    generateMangaList = () => {
      const { store: { mangaList : { list } } } = this.props;
      return (
      list && (
        <FlatList
          data={list}
          keyExtractor={this.keyExtractor}
          renderItem={({item}) => {
            if (!item.name) {
                return false;
            }
            return (
              <TouchableOpacity onPress={() => { this.openMangaLink(item); }} style={styles.touchableOpacity}>
                <Image
                  style={styles.itemImage}
                  source={{uri: item.img}}
                />
                <Text style={styles.itemScore}>{item.itemScore}</Text>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemText}>{`${item.name}`}</Text>
                </View>
              </TouchableOpacity>
            );
        }}
        />
        )
      );
    }

    render() {
        const { store: { mangaList : { isLoading }, mangaGenres } } = this.props;
        return (
          <ScrollView ref={(ref) => this.scrollView = ref} pagingEnabled horizontal style={styles.container}>
            <View style={styles.contentContainer}>
              {this.generateMangaList()}
              <TouchableOpacity style={styles.rightButtonTouch} onPress={this.handleRightArrowPress}>
                <Image
                  source={right_arrow}
                  style={styles.rightButtonImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.innerFinderOpened}>
              <Button
                onPress={isLoading ? () => null : this.onPressPrevPage}
                title="Prev Page"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={isLoading ? () => null : this.onPressNextPage}
                title="Next Page"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                style={styles.findButton}
                onPress={this.onPressStartSearch}
                title="Find"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
              {mangaGenres && (
                <View style={styles.checkboxes}>
                    {this.generateGenreCheckboxes()}
                </View>
                )}
            </View>
          </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaList: bindActionCreators(fetchMangaListAsync, dispatch),
    getMangaGenres: bindActionCreators(fetchMangaGenresAsync, dispatch),
    searchManga: bindActionCreators(searchMangaAsync, dispatch),
    changeGenreCheckbox: bindActionCreators(setGenreCheckbox, dispatch),
    changeModule: bindActionCreators(changeModuleName, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Main);