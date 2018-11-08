
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';

export default createStackNavigator({
    Home: {
        screen: HomeScreen
    },
    WebView: { screen: WebViewScreen },
});
