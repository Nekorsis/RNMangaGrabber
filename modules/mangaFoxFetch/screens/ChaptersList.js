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
import { getMangaChaptersList } from '../actions';

//const DomParser = require('react-native-html-parser').DOMParser;

class ChaptersList extends React.Component {
    componentDidMount() {
        const { params: { manga } = {} } =  this.props.navigation.state;
        if (manga) {
            this.props.getMangaChaptersList(manga.link);
        }
    }

    keyExtractor = (item, index) => item.name || index.toString();

    render() {
        const { mangaChapters: { mangaChaptersList, isLoading } = {} } = this.props.store;
        return (
            !isLoading &&
            <View>
                <FlatList
                    data={mangaChaptersList}
                    keyExtractor={this.keyExtractor}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity style={styles.touchableOpacity}>
                                <View style={styles.itemTextContainer}>
                                    <Text style={styles.itemText}>{`${item.name}`}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    store: state.mangaFoxReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaChaptersList: bindActionCreators(getMangaChaptersList, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChaptersList);

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
        width: 150,
        height: 150,
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
        borderColor: 'blue',
        borderTopWidth: 10,
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
