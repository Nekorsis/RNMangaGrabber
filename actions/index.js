import modules from '../modules';
import { 
    setMangaChapter, 
    actionTypes,
} from './common';

const funcNames = { 
    fetchMangaGenresAsync: 'fetchMangaGenresAsync',
    fetchMangaListAsync: 'fetchMangaListAsync',
    searchMangaAsync: 'searchMangaAsync',
    getMangaChaptersList: 'getMangaChaptersList',
    fetchChapter: 'fetchChapter',
    fetchHotCategoryAsync: 'fetchHotCategoryAsync',
};

// getting all of the module actions.
const modulesReducersActions = modules.reduce((accumulator, mod) => {
    const { moduleName, actions } = mod;
    return { ...accumulator, [moduleName]: actions };
}, {});

const funcCaller = (funcName, getState, name, dispatch, ...extra) => {
    const moduleName = name || getState().appReducer.moduleName;
    // TODO simplify
    if (!(name || moduleName)) {
        console.log('need to run default parser funcCaller for func: ' + funcName);
        return;
    }

    const moduleBlock = modulesReducersActions[moduleName];
    if (!moduleBlock) {
        console.log('missing module: ' + name);
        return;
    }

    const func = moduleBlock[funcName];
    if (!func) {
        console.log('missing func: ' + funcName);
        return;
    }

    return func(...extra)(dispatch, getState);
};

export const fetchMangaGenresAsync = (name) => {
    return function(dispatch, getState) {
        return funcCaller(funcNames.fetchMangaGenresAsync, getState, name, dispatch);
    };
};

export const fetchHotCategoryAsync = (name) => {
    return function(dispatch, getState) {
        return funcCaller(funcNames.fetchHotCategoryAsync, getState, name, dispatch, name);
    };
};

export const changeModuleName = (moduleName) => {
    return {
        type: actionTypes.CHANGE_MODULE_NAME,
        payload: { moduleName },
    };
};

export const fetchMangaListAsync = (url, name) => {
    return (dispatch, getState) => {
        return funcCaller(funcNames.fetchMangaListAsync, getState, name, dispatch, url);
    };
};

export const searchMangaAsync = (filter, name) => {
    return (dispatch, getState) => {
        return funcCaller(funcNames.searchMangaAsync, getState, name, dispatch, filter);
    };
};

export const getMangaChaptersList = (url, name) => {
    return (dispatch, getState) => {
        return funcCaller(funcNames.getMangaChaptersList, getState, name, dispatch, url);
    };
};

export const setGenreCheckbox = (index, isActive) => {
    return {
        type: actionTypes.SET_GENRE_CHECKBOX,
        payload: { index, isActive },
    };
};

export const deleteMangaChapter = (chapterPromise) => {
    return {
        type: actionTypes.DELETE_LOADING_CHAPTER,
        payload: { chapterPromise },
    };
};


export const fetchChapter = (url, name) => {
    return (dispatch, getState) => {
        return funcCaller(funcNames.fetchChapter, getState, name, dispatch, url);
    };
};

export const rejectChapterLoad = () => {
    return (dispatch, getState) => {
        const { appReducer: { chapterPromise } } = getState();
        if (chapterPromise) {
            chapterPromise.cancel('Rejected by exit from the chapter reader');
            dispatch(setMangaChapter(null));
        }
    }; 
};