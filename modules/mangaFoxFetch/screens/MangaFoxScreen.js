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
import { mangaDirectoryUrl } from '../config/Network';
import { fetchMangaListAsync, fetchMangaGenresAsync, searchMangaAsync, setGenreCheckbox } from '../actions';

//const DomParser = require('react-native-html-parser').DOMParser;

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { finderIsOpened: false, currentPage: 1, isLoading: false };
    }

    keyExtractor = (item, index) => item.name || index.toString();

    componentDidMount() {
        this.props.getMangaList(mangaDirectoryUrl);
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
        const nextPage = currentPage + 1;
        this.setState({ currentPage: nextPage, isLoading: true });
        await this.props.getMangaList(mangaDirectoryUrl + `/${nextPage}.html`);
        this.setState({ isLoading: false });
    }

    onPressPrevPage = async () => {
        const { currentPage } = this.state;
        if(currentPage < 2) {
            return;
        }
        const nextPage = currentPage - 1;
        this.setState({ currentPage: nextPage, isLoading: true });
        await this.props.getMangaList(mangaDirectoryUrl + `/${nextPage}.html`);
        this.setState({ isLoading: false });
    }

    generateGenreCheckboxes = () => {
        const { mangaGenres } = this.props.store;
        if (mangaGenres === null || mangaGenres === undefined) {
            return;
        }
        return (<FlatList
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
    />);
    }

    changeCheckbox = (index) => {
        const { mangaGenres } = this.props.store;
        if (mangaGenres && mangaGenres[index]) {
            this.props.changeGenreCheckbox(index, !mangaGenres[index].isActive);
        }
    }

    // Find should be independent from component?
    onPressStartSearch = () => {
        const { mangaGenres } = this.props.store;
        const searchCategories = mangaGenres.filter((item) => item.isActive);
        if (searchCategories.length > 1) {
            const addedGenres = searchCategories.reduce((accumulator, item, index) => {
                if(index === 0) {
                    accumulator = accumulator + `${item.value}%`;
                    return accumulator;
                }
                accumulator = accumulator + `2C${item.value}%`;
                return accumulator;
            }, '');
            const filterQ = `title=&genres=${addedGenres}&st=0&sort=&stype=1&name_method=cw&name=&author_method=cw&author=&artist_method=cw&artist=&type=&rating_method=eq&rating=&released_method=eq&released=`;
            this.props.searchManga(filterQ);
        }

    }

    render() {
        const { mangaList, mangaGenres } = this.props.store;
        console.log('rerender');
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <View style={styles.contentContainer}>
                        {mangaList && <FlatList
                            data={mangaList}
                            keyExtractor={this.keyExtractor}
                            renderItem={({item}) => {
                                if (!item.name) {
                                    return false;
                                }
                                return (
                                    <TouchableOpacity style={styles.touchableOpacity}>
                                        <Image
                                            style={styles.itemImage}
                                            source={{uri: item.img}}
                                        />
                                        <Text style={styles.itemScore}>{item.itemScore}</Text>
                                        <View style={styles.itemTextContainer}>
                                            <Text style={styles.itemText} onPress={() => { this.openMangaLink(item) }}>{`${item.name}`}</Text>
                                        </View>
                                    </TouchableOpacity>

                                );
                            }}
                        />}
                    </View>
                    { this.state.finderIsOpened ? 
                        <View style={styles.finderOpened}>
                            <TouchableOpacity style={styles.innerFinderOpened} onPress={() => this.setState({ finderIsOpened: !this.state.finderIsOpened })}>
                                <Button
                                    onPress={this.state.isLoading ? () => null : this.onPressPrevPage}
                                    title="Prev Page"
                                    color="#841584"
                                    accessibilityLabel="Learn more about this purple button"
                                />
                                <Button
                                    onPress={this.state.isLoading ? () => null : this.onPressNextPage}
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
                            </TouchableOpacity>
                            {mangaGenres &&
                            <View style={styles.checkboxes}>
                                {this.generateGenreCheckboxes()}
                            </View>
                            }
                        </View>
                        :
                        <View style={styles.finder}>
                            <TouchableOpacity style={styles.innerFinder} onPress={() => this.setState({ finderIsOpened: !this.state.finderIsOpened })}>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
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
        flex: 0.9,

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
    welcomeContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    finder: {
        borderColor: 'orange',
        borderTopWidth: 10,
        left: '90%',
        backgroundColor: 'green',
        height: '100%',
        width: '10%',
        position: 'absolute',
    },
    finderOpened: {
        left: '30%',
        backgroundColor: 'green',
        height: '100%',
        width: '70%',
        // alignSelf: 'flex-end',
        // flex: 1,
        // height: 50,
        position: 'absolute',
    },
    innerFinderOpened: {
        backgroundColor: 'red',
        flex: 0.2,
        display: 'flex',
        flexDirection: 'row',
    },
    innerFinder: {
        backgroundColor: 'red',
        flex: 1,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
