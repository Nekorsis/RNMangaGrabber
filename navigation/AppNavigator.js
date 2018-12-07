
import { createStackNavigator } from 'react-navigation';
// import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';
import HomeScreen from '../modules/mangaFoxFetch/screens/MangaFoxScreen';
import ChaptersList from '../modules/mangaFoxFetch/screens/ChaptersList';

export default createStackNavigator({
    Home: {
        screen: HomeScreen
    },
    WebView: { screen: WebViewScreen },
    ChaptersList: { screen: ChaptersList },
});
