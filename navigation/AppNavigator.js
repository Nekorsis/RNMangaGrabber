
import { createStackNavigator } from 'react-navigation';
// import HomeScreen from '../screens/HomeScreen';
import HomeScreen from '../modules/mangaFoxFetch/screens/Main';
import modules from '../modules';

// creating object with module navigators
const modulesObject = modules.reduce((accumulator, mod) => {
    const { screens } = mod;
    const convertedScreens = screens.reduce((accuScreen, obj) => {
        const moduleString = obj.name;
        accuScreen[moduleString] = { screen: obj.screen };
        return accuScreen;
    }, {});
    return { ...accumulator, ...convertedScreens };
}, {});

export default createStackNavigator({ Home: { screen: HomeScreen }, ...modulesObject});

// export default createStackNavigator({
    // Home: {
    //     screen: HomeScreen
    // },
//     WebView: { screen: WebViewScreen },
//     ChaptersList: { screen: ChaptersList },
//     Chapter: { screen: Chapter },
// });
