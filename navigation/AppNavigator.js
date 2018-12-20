
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../modules/mangaFoxFetch/screens/Main';
import modules from '../modules';

// creating object with module navigators
const modulesObject = modules.reduce((accumulator, mod) => {
    const { screens } = mod;
    const convertedScreens = screens.reduce((accuScreen, obj) => {
        accuScreen[obj.name] = { screen: obj.screen };
        return accuScreen;
    }, {});
    return { ...accumulator, ...convertedScreens };
}, {});

export default createStackNavigator({ Home: { screen: HomeScreen }, ...modulesObject});