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
import { MangaStreamUrl } from '../constants/Network';
import { msItemParser } from '../utils/Utils';

//const DomParser = require('react-native-html-parser').DOMParser;

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaData: null
        };
    }
    componentDidMount() {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        const getName = (s) => {
            const isNew = s.includes('class="active"');
            if (isNew) {
                const start = s.search('</i>');
                const temp = s.slice(start);
                const end = temp.search('<strong>');
                const res = temp.slice(4, end);
                return res;
            }
            const start = s.search('</span>');
            const temp = s.slice(start);
            const end = temp.search('<strong>');
            const res = temp.slice(7, end);
            return res;
        };
        fetch(MangaStreamUrl,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const start = 6540; const end = 4745;
                const sss = text.slice(start);
                const result = sss.slice(0, end);
                const arr = result.split('<li').map((i, index) => {
                    const testOb = {
                        name: getName(i),
                        date: msItemParser(i, 'date', 'class="pull-right"', '</span>'),
                        link: msItemParser(i, 'link', 'href=', '>'),
                    };
                    return index !== 0 && testOb;
                });
                this.setState({mangaData: arr.filter(i => i)});
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    openMangaLink = (url) => {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
    render() {
        const { mangaData } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <View style={styles.contentContainer}>
                        {mangaData && <FlatList
                            data={mangaData}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity>
                                        <Text>{item.name}</Text>
                                        <Text>{item.date}</Text>
                                        <Text onPress={() => {this.openMangaLink(`${MangaStreamUrl}${item.link}`);}}>{`${MangaStreamUrl}${item.link}`}</Text>
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
