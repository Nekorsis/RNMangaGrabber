import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { mangaStreamUrl, mangaDirectoryUrl } from '../config/Network';
import { fetchMangaDataAsync, fetchMangaListAsync } from '../actions';

//const DomParser = require('react-native-html-parser').DOMParser;

class HomeScreen extends React.Component {
    componentDidMount() {
        this.props.getMangaList(mangaDirectoryUrl);
    }

    openMangaLink = (url) => {
        this.props.navigation.navigate('WebView', { viewUrl: url });
        // Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        const { mangaList } = this.props.store;
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <View style={styles.contentContainer}>
                        {mangaList && <FlatList
                            data={mangaList}
                            renderItem={({item}) => {
                                if (item.name === null) {
                                    return false;
                                }
                                return (
                                    <TouchableOpacity>
                                        <Image
                                            style={{width: 200, height: 200}}
                                            source={{uri: item.img}}
                                        />
                                        <Text>{item.name}</Text>
                                        <Text>{item.itemScore}</Text>
                                        <Text onPress={() => {this.openMangaLink(`${item.link}`);}}>{`${item.link}`}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />}
                    </View>   
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    store: state.mangaFoxReducer,
});

const mapDispatchToProps = dispatch => ({
    getMangaData: bindActionCreators(fetchMangaDataAsync, dispatch),
    getMangaList: bindActionCreators(fetchMangaListAsync, dispatch),
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
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
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
