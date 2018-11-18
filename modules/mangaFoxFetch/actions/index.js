import { msItemParser } from '../../../utils/Utils';
import { mangaPath } from '../config/Network';


export const actionTypes = {
    FETCH_MANGA_DATA: 'FETCH_MANGA_DATA',
    FETCH_MANGA_LIST: 'FETCH_MANGA_LIST',
    SET_MANGA_LIST: 'SET_MANGA_LIST',
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

export const fetchMangaListAsync = (url) => {
    return function(dispatch) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const blocks = text.split('<li').map((i) => {
                    const matched = i.match(/<img(.*)a>/);
                    const imgsrc = matched && matched[0].match(/src="(.*\.jpg|png)"/);
                    const name = i.match(/title="(.*?)"><img\s/);
                    const link = i.match(/<a href="\/manga\/(.+?)\/"/);
                    const itemScore = i.match(/<span class="item-score">(\d+\.\d+)<\/span>/);
                    const block = { 
                        img: imgsrc && imgsrc[1],
                        name: name && name[1],
                        link: link && mangaPath + link[1], 
                        itemScore: itemScore && itemScore[1] 
                    };
                    // console.log(link && link[1]);
                    return block;
                });
                const filteredBlocks = blocks.filter((item) => item && item.name !== null);
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