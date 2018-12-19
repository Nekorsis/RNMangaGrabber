import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { initState as initialState } from '../store.js';
import AppNavigator from '../navigation/AppNavigator.js';
import { actionTypes } from '../actions/actions';
import mangaFoxReducer from '../modules/mangaFoxFetch/lib/reducers/reducers';

import modules from '../modules';

// creating object with module navigators
const modulesReducersObj = modules.reduce((accumulator, mod) => {
    const { reducer, moduleName } = mod;
    return { ...accumulator, [moduleName + 'Reducer']: reducer };
}, {});

const initialNavigatorState = AppNavigator.router.getStateForAction(NavigationActions.init());

const appReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.FETCH_MANGA_DATA: {
        return {...state, mangaData: action.mangaData };
    }
    default:
        break;
    }
    return state;
};
const navReducer = (state = initialNavigatorState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
};

const reducer = combineReducers({
    appReducer,
    nav: navReducer,
    ...modulesReducersObj,
});

export default reducer;
