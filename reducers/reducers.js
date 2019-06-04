import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { initState as initialState } from '../store';
import AppNavigator from '../navigation/AppNavigator';
import { actionTypes } from '../actions/common';

// import modules from '../modules';

// creating object with module navigators
// currently isn't in use
// const modulesReducersObj = modules.reduce((accumulator, mod) => {
//     const { reducer, reducerName, moduleName } = mod;
//     return { ...accumulator, [reducerName || `${moduleName}Reducer`]: reducer };
// }, {});

const initialNavigatorState = AppNavigator.router.getStateForAction(NavigationActions.init());

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_MANGA_LIST: {
            return { ...state, mangaList: { ...state.mangaList, isLoading: false, list: action.payload.list } };
        }
        case actionTypes.CHANGE_MODULE_NAME: {
            const { moduleName } = action.payload;
            return { ...state, moduleName };
        }
        case actionTypes.SET_MANGA_GENRES: {
            return { ...state, mangaGenres: action.payload.mangaGenres };
        }
        case actionTypes.SET_LOADING_STATE: {
            const { isLoading, name } = action.payload;
            return isLoading ? { ...state, [name] : {...state[name], isLoading, err: null } } :
             { ...state, [name] : {...state[name], isLoading } };
        }
        case actionTypes.SET_GENRE_CHECKBOX: {
            const { index, isActive } = action.payload;
            if(state.mangaGenres && state.mangaGenres[index]) {
                return { ...state,
                    mangaGenres: state.mangaGenres.map((item, arrayIndex) => {
                        if (arrayIndex === index) {
                            return { ...item, isActive };
                        }
                        return item;
                    }),
                };
            } else {
                return state;
            }
        }
        case actionTypes.SET_LOADING_CHAPTER: {
            const { chapterPromise } = action.payload;
            return { ...state, chapterPromise };
        }
        case actionTypes.SET_CHAPTERS_LIST: {
            const { mangaChaptersList } = action.payload;
            return { ...state, mangaChapters: { mangaChaptersList, isLoading: false }, };
        }
        case actionTypes.SAVE_CHAPTER_IMAGES: {
            const { imagesArray, imagesArray: { err } } = action.payload;
            return err ? { ...state, imagesInfo: { ...state.imagesInfo, err } }
            : { ...state, imagesInfo: { ...state.imagesInfo, imagesArray, isLoading: false, err: false } };
            // return { ...state, imagesInfo: { ...state.imagesInfo, imagesArray, isLoading: false, err } };
        }
        case actionTypes.SET_HOT_CATEGORY: {
            const { moduleName, hotInfo } = action.payload;
            return { ...state, hotCategories: { ...state.hotCategories, [moduleName]: hotInfo } };
        }
        case actionTypes.SET_CATEGORY: {
            const { moduleName, list, category } = action.payload;
            return { ...state, [category]: { ...state[category], [moduleName]: list } };
        }
        case actionTypes.SET_READING_CATEGORY: {
            const { moduleName, readingInfo } = action.payload;
            return { ...state, readingNowCategories: { ...state.readingNowCategories, [moduleName]: readingInfo } };
        }
        case actionTypes.SET_ERROR: {
            const { err } = action.payload;
            return { ...state, err };
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
    // ...modulesReducersObj,
});

export default reducer;
