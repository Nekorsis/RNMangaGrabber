import modules from '../modules';


export const actionTypes = {
    SET_MANGA_LIST: 'SET_MANGA_LIST',
    SET_MANGA_GENRES: 'SET_MANGA_GENRES',
    SET_GENRE_CHECKBOX: 'SET_GENRE_CHECKBOX',
    SET_CHAPTERS_LIST: 'SET_CHAPTERS_LIST',
    SET_LOADING_STATE: 'SET_LOADING_STATE',
    SAVE_CHAPTER_IMAGES: 'SAVE_CHAPTER_IMAGES',
    CHANGE_MODULE_NAME: 'CHANGE_MODULE_NAME',
    SET_LOADING_CHAPTER: 'SET_LOADING_CHAPTER',
};

const funcNames = { 
    fetchMangaGenresAsync: 'fetchMangaGenresAsync',
    fetchMangaListAsync: 'fetchMangaListAsync',
    searchMangaAsync: 'searchMangaAsync',
    getMangaChaptersList: 'getMangaChaptersList',
    fetchChapter: 'fetchChapter',
};

// getting all of the module actions.
const modulesReducersActions = modules.reduce((accumulator, mod) => {
    const { moduleName, actions } = mod;
    return { ...accumulator, [moduleName]: actions };
}, {});

const funcCaller = (funcName, getState, name, dispatch, ...extra) => {
    let { appReducer: { moduleName } } = getState();
    if (!(name || moduleName)) {
        console.log('need to run default parser funcCaller for func: ' + funcName);
        return;
    }
    return name ?  modulesReducersActions[name][funcName](...extra)(dispatch, getState) :
          modulesReducersActions[moduleName][funcName](...extra)(dispatch, getState);
};

export const fetchMangaGenresAsync = (name) => {
    return function(dispatch, getState) {
        return funcCaller(funcNames.fetchMangaGenresAsync, getState, name, dispatch);
    };
}

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


export const setMangaList = (list) => {
    return {
        type: actionTypes.SET_MANGA_LIST,
        payload: { list },
    };
};

export const setMangaGenres = (mangaGenres) => {
    return {
        type: actionTypes.SET_MANGA_GENRES,
        payload: { mangaGenres },
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

export const setMangaChaptersList = (mangaChaptersList) => {
    return {
        type: actionTypes.SET_CHAPTERS_LIST,
        payload: { mangaChaptersList },
    };
};

export const setLoadingState = (isLoading, name) => {
    return {
        type: actionTypes.SET_LOADING_STATE,
        payload: { isLoading, name },
    };
};


export const setMangaChapter = (chapterPromise) => {
    return {
        type: actionTypes.SET_LOADING_CHAPTER,
        payload: { chapterPromise },
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

export const saveChapterImages = (imagesArray) => {
    return {
        type: actionTypes.SAVE_CHAPTER_IMAGES,
        payload: { imagesArray },
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