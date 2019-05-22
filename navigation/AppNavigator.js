
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import ChaptersListScreen from '../screens/ChaptersListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import SiteScreen from '../screens/SiteScreen';

// creating object with module navigators
// const modulesObject = modules.reduce((accumulator, mod) => {
//     const { screens } = mod;
//     const convertedScreens = screens.reduce((accuScreen, obj) => {
//         accuScreen[obj.name] = { screen: obj.screen };
//         return accuScreen;
//     }, {});
//     return { ...accumulator, ...convertedScreens };
// }, {});

export default createStackNavigator({ 
    Home: { screen: HomeScreen }, 
    ChaptersList: { screen: ChaptersListScreen }, 
    Chapter: { screen: ChapterScreen }, 
    Site: { screen: SiteScreen } 
});

// export default createStackNavigator({ 
//     Home: { screen: HomeScreen }, 
//     ChaptersList: { screen: ChaptersListScreen }, 
//     Chapter: { screen: ChapterScreen }, 
//     Site: { screen: SiteScreen } 
// }, { defaultNavigationOptions: {} });