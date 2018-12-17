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
    ScrollView,
    TouchableWithoutFeedback,
    Touchable,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMangaListAsync, fetchMangaGenresAsync, searchMangaAsync, setGenreCheckbox } from '../actions';
import right_arrow from '../../../assets/images/right_arrow.png'
import Filter from '../lib/Filter'; 

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.filter = new Filter();
        this.state = { finderIsOpened: false, currentPage: 1 };
    }

    keyExtractor = (item, index) => item.name || index.toString();

    componentDidMount() {
        const { getMangaList } = this.props;
        getMangaList(this.filter.getFilterString());
        this.initializeFilter();
    }

    initializeFilter = async () => {
        const { getMangaGenres } = this.props;
        getMangaGenres();
    }

    openMangaLink = (manga) => {
        this.props.navigation.navigate('ChaptersList', { manga });
    }

    // TODO handle next page when searching;
    onPressNextPage = async () => {
        const { currentPage } = this.state;
        const { getMangaList } = this.props;
        const nextPage = currentPage + 1;
        this.setState({ currentPage: nextPage});
        this.filter.setPage(nextPage);
        await getMangaList(this.filter.getFilterString());
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
        await getMangaList(this.filter.getFilterString());
    }

    generateGenreCheckboxes = () => {
        const { mangaGenres } = this.props.store;
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
                          {/* {item.name && item.name.length < 5 ? item.name : item.name.slice(0, 9)} */}
                          {item.name}
                        </Text>
                      </View>
                    );
                }}
          />
        );
    }

    changeCheckbox = (index) => {
        const { mangaGenres } = this.props.store;
        if (mangaGenres && mangaGenres[index]) {
            this.props.changeGenreCheckbox(index, !mangaGenres[index].isActive);
            if (mangaGenres[index].isActive) {
                this.filter.removeGenre(mangaGenres[index]);
            } else {
                this.filter.addGenre(mangaGenres[index]);
            }
        }
    }

    //TODO move filter to actions
    onPressStartSearch = () => {
        const { store: { mangaGenres }, getMangaList } = this.props;
        this.setState({ currentPage: 1 });
        console.log('completed filter string', this.filter.getFilterString());
        this.filter.setPage(1);
        getMangaList(this.filter.getFilterString());
    }

    handleRightArrowPress = () => {
        console.log('handleRightArrowPress');
        this.scrollView.scrollToEnd()
    }

    render() {
        const { mangaList : { isLoading, list }, mangaGenres } = this.props.store;
        console.log('rerender');
        return (
          <ScrollView ref={(ref) => this.scrollView = ref} pagingEnabled horizontal style={styles.container}>
            <View style={styles.contentContainer}>
                {list && (
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
                )}
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
    store: state.mangaFoxReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaList: bindActionCreators(fetchMangaListAsync, dispatch),
    getMangaGenres: bindActionCreators(fetchMangaGenresAsync, dispatch),
    searchManga: bindActionCreators(searchMangaAsync, dispatch),
    changeGenreCheckbox: bindActionCreators(setGenreCheckbox, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const { width } = Dimensions.get('window');
console.log('width', width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        // flex: 0.9,
        width: width,
        // paddingTop: 30
    },
    findButton: {
        flex: 0.2,
    },
    flatListCheckboxes: {
        // display: 'flex',
        // flexDirection: 'row',
    },
    checkboxes: {
        display: 'flex',
        flex: 1,
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    checkbox: {
        marginBottom: 5,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        minWidth: 80,
        display: 'flex',
        maxWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    checkboxText: {
        textAlign: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        // right: '100%',
    },
    itemText: {
        alignSelf: 'flex-end',
    },
    itemScore: {
        position: 'absolute',
        left: '50%',
    },
    rightButtonImage: {
        width: 50,
        height: 50,
    },
    rightButtonTouch: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: '50%',
        right: 0,
        width: 50,
        height: 50,
    },
    touchableOpacity: {
        marginTop: 25,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
        display: 'flex',
        flexDirection: 'row',
    },
    itemTextContainer: {
        maxWidth: '75%',
        display: 'flex',
        flexDirection: 'row',
    },
    innerFinderOpened: {
        backgroundColor: 'lightblue',
        width: width,
        display: 'flex',
        flexDirection: 'column',
    },
});
