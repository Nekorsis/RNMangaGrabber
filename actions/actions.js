import { msItemParser } from '../utils/Utils';

export const actionTypes = {
    FETCH_MANGA_DATA: 'FETCH_MANGA_DATA',
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
        const getName = (s) => {
            const isNew = s.includes('class="active"');
            if (isNew) {
                const start = s.search('</i>');
                const temp = s.slice(start);
                const end = temp.search('<strong>');
                const res = temp.slice(4, end);
                return res;
            }
            const start = s.search('</span>');
            const temp = s.slice(start);
            const end = temp.search('<strong>');
            const res = temp.slice(7, end);
            return res;
        };
        return fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const start = 6540; const end = 4745;
                const sss = text.slice(start);
                const result = sss.slice(0, end);
                const arr = result.split('<li').map((i, index) => {
                    const testOb = {
                        name: getName(i),
                        date: msItemParser(i, 'date', 'class="pull-right"', '</span>'),
                        link: msItemParser(i, 'link', 'href=', '>'),
                    };
                    return index !== 0 && testOb;
                });
                return dispatch(saveMangaData(arr.filter(i => i)));
                // return arr.filter(i => i);
            });
        }).catch((err) => {
            console.log(err);
        });
    };
};