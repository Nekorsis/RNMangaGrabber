import { initState as initialState } from './../store.js';
import { actionTypes } from '../../actions/index';

const mangaFoxReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_MANGA_LIST: {
        return {...state, mangaList: action.payload.mangaList };
    }
    default:
        break;
    }
    return state;
};

export default mangaFoxReducer;
