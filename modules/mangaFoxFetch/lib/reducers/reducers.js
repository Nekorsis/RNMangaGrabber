import { initState as initialState } from '../store';
import { actionTypes } from '../../actions/index';

const mangaFoxReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_MANGA_LIST: {
        return { ...state, mangaList: { ...state.mangaList, isLoading: false, list: action.payload.list } };
    }
    case actionTypes.SET_MANGA_GENRES: {
        return { ...state, mangaGenres: action.payload.mangaGenres };
    }
    case actionTypes.SET_LOADING_STATE: {
        const { isLoading, name } = action.payload;
        if (!state[name]) {
            console.error(`SET_LOADING_STATE, ${name} is not exist in state`);
            return state;
        }
        return { ...state, [name] : {...state[name], isLoading } };
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
    case actionTypes.SET_CHAPTERS_LIST: {
        const { mangaChaptersList } = action.payload;
        return { ...state, mangaChapters: { mangaChaptersList, isLoading: false }, };
    }
    case actionTypes.SAVE_CHAPTER_IMAGES: {
        const { imagesArray } = action.payload;
        return { ...state, imagesInfo: { ...state.imagesInfo, imagesArray, isLoading: false } };
    }
    default:
        break;
    }
    return state;
};

export default mangaFoxReducer;
