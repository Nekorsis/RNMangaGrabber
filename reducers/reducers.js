import { combineReducers } from 'redux';
import { NavigationActions, createStackNavigator } from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { initState as initialState } from './../store.js';
import AppNavigator from './../navigation/AppNavigator.js';


const initialNavigatorState = AppNavigator.router.getStateForAction(NavigationActions.init());


// const AppNav = createStackNavigator(AppNavigator);

// const navReducer = createNavigationReducer(AppNav);

const appReducer = (state = initialState.appReducer, action) => {
    switch (action.type) {
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
