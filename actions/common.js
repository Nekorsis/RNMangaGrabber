export const actionTypes = {
    SET_MANGA_LIST: 'SET_MANGA_LIST',
    SET_MANGA_GENRES: 'SET_MANGA_GENRES',
    SET_GENRE_CHECKBOX: 'SET_GENRE_CHECKBOX',
    SET_CHAPTERS_LIST: 'SET_CHAPTERS_LIST',
    SET_LOADING_STATE: 'SET_LOADING_STATE',
    SAVE_CHAPTER_IMAGES: 'SAVE_CHAPTER_IMAGES',
    CHANGE_MODULE_NAME: 'CHANGE_MODULE_NAME',
    SET_LOADING_CHAPTER: 'SET_LOADING_CHAPTER',
    SET_HOT_CATEGORY: 'SET_HOT_CATEGORY',
    SET_ERROR: 'SET_ERROR',
    SET_READING_CATEGORY: 'SET_READING_CATEGORY',
};

export const setError = (err) => {
    return {
        type: actionTypes.SET_ERROR,
        payload: { err },
    };
};

export const setMangaGenres = (mangaGenres) => {
    return {
        type: actionTypes.SET_MANGA_GENRES,
        payload: { mangaGenres },
    };
};

export const setLoadingState = (isLoading, name) => {
    return {
        type: actionTypes.SET_LOADING_STATE,
        payload: { isLoading, name },
    };
};

export const setMangaList = (list) => {
    return {
        type: actionTypes.SET_MANGA_LIST,
        payload: { list },
    };
};

export const saveChapterImages = (imagesArray) => {
    return {
        type: actionTypes.SAVE_CHAPTER_IMAGES,
        payload: { imagesArray },
    };
};

export const setMangaChapter = (chapterPromise) => {
    return {
        type: actionTypes.SET_LOADING_CHAPTER,
        payload: { chapterPromise },
    };
};

export const setMangaChaptersList = (mangaChaptersList) => {
    return {
        type: actionTypes.SET_CHAPTERS_LIST,
        payload: { mangaChaptersList },
    };
};

export const setHotCategory = (moduleName, hotInfo) => {
    return {
        type: actionTypes.SET_HOT_CATEGORY,
        payload: { moduleName, hotInfo },
    };
};

export const setReadingCategory = (moduleName, readingInfo) => {
    return {
        type: actionTypes.SET_READING_CATEGORY,
        payload: { moduleName, readingInfo },
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