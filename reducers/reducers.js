import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { initState as initialState } from './../store.js';
import AppNavigator from './../navigation/AppNavigator.js';
import { actionTypes } from '../actions/actions';

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
});

export default reducer;
