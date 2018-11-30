import { msItemParser } from '../../../utils/Utils';
import { mangaPath, searchPath } from '../config/Network';


export const actionTypes = {
    FETCH_MANGA_DATA: 'FETCH_MANGA_DATA',
    FETCH_MANGA_LIST: 'FETCH_MANGA_LIST',
    SET_MANGA_LIST: 'SET_MANGA_LIST',
    SET_MANGA_GENRES: 'SET_MANGA_GENRES',
};

export const saveMangaData = (mangaData) => {
    return {
        type: actionTypes.FETCH_MANGA_DATA,
        mangaData,
    };
};

export const fetchMangaDataAsync = (url) => {
    return function(dispatch) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            console.log(response.text().then(resp => console.log(resp)));
        }).catch((err) => {
            console.log(err);
        });
    };
};

export const fetchMangaGenresAsync = (callback) => {
    return function(dispatch) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(searchPath,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const searchBlock = text.match(/<ul class="tagbt">(.+?)<\/ul>/);
                const genreBlocks = searchBlock && searchBlock[0].match(/<li>(.+?)<\/li>/g);
                const genreObjects = genreBlocks.map((item) => {
                    const dataVal = item.match(/data-val="(.+?)"/);
                    const name = item.match(/title="(.+?)"/);
                    return { value: dataVal && dataVal[1], name: name && name[1] };
                });
                dispatch(setMangaGenres(genreObjects));
                callback(genreObjects);
            });
        }).catch((err) => {
            console.log(err);
        });
    };
};

export const fetchMangaListAsync = (url) => {
    return (dispatch) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const blocks = text.split('<li').reduce((accumulator, value) => {
                    const imgsrc = value.match(/img.+?src="(.+?)".+?<\/a>/);
                    const name = value.match(/title="(.*?)"><img\s/);
                    const link = value.match(/<a href="\/manga\/(.+?)\/"/);
                    const itemScore = value.match(/<span class="item-score">(\d+\.\d+)<\/span>/);
                    if (!imgsrc || !name ) {
                        return accumulator;
                    }
                    const block = { 
                        img: imgsrc && imgsrc[1],
                        name: name && name[1],
                        link: link && mangaPath + link[1], 
                        itemScore: itemScore && itemScore[1] 
                    };
                    accumulator = [...accumulator, block];
                    return accumulator;
                    //
                }, []);
                // const filteredBlocks = blocks.filter((item) => item && item.name !== null);
                return dispatch(setMangaList(blocks));
            });
        }).catch((err) => {
            console.log(err);
        });
    };
};


export const setMangaList = (mangaList) => {
    return {
        type: actionTypes.SET_MANGA_LIST,
        payload: { mangaList },
    };
};

export const setMangaGenres = (mangaGenres) => {
    return {
        type: actionTypes.SET_MANGA_GENRES,
        payload: { mangaGenres },
    };
};

export const searchMangaAsync = (filter) => {
    return (dispatch) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(searchPath + filter,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const blocks = text.split('<li').reduce((accumulator, value) => {
                    const imgsrc = value.match(/img.+?src="(.+?)".+?<\/a>/);
                    const name = value.match(/title="(.*?)"><img\s/);
                    const link = value.match(/<a href="\/manga\/(.+?)\/"/);
                    const itemScore = value.match(/<span class="item-score">(\d+\.\d+)<\/span>/);
                    if (!imgsrc || !name ) {
                        return accumulator;
                    }
                    const block = { 
                        img: imgsrc && imgsrc[1],
                        name: name && name[1],
                        link: link && mangaPath + link[1], 
                        itemScore: itemScore && itemScore[1] 
                    };
                    accumulator = [...accumulator, block];
                    return accumulator;
                }, []);
                return dispatch(setMangaList(blocks));
            });
        }).catch((err) => {
            console.log(err);
        });
    };
};