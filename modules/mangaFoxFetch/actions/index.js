import { mangaPath, searchPath } from '../config/Network';
import { repeatMaxCounter } from '../config/consts';


export const actionTypes = {
    FETCH_MANGA_DATA: 'FETCH_MANGA_DATA',
    FETCH_MANGA_LIST: 'FETCH_MANGA_LIST',
    SET_MANGA_LIST: 'SET_MANGA_LIST',
    SET_MANGA_GENRES: 'SET_MANGA_GENRES',
    SET_GENRE_CHECKBOX: 'SET_GENRE_CHECKBOX',
    SET_CHAPTERS_LIST: 'SET_CHAPTERS_LIST',
    SET_LOADING_STATE: 'SET_LOADING_STATE',
};

export const saveMangaData = (mangaData) => {
    return {
        type: actionTypes.FETCH_MANGA_DATA,
        mangaData,
    };
};

export const fetchMangaGenresAsync = (callback) => {
    return function(dispatch) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        return fetch(searchPath, {
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        }).then((response) => {
            response.text().then((text) => {
                const searchBlock = text.match(/<div class="tag-box">(.+?)<\/div>/);
                const genreBlocks = searchBlock && searchBlock[0].match(/<a(.+?)<\/a>/g);
                const blocks = genreBlocks.reduce((accumulator, item, index) => {
                    const dataVal = item.match(/data-val="(.+?)"/);
                    const name = item.match(/title="(.+?)"/);
                    if (!dataVal || !name ) {
                        return accumulator;
                    }
                    const block = { 
                        value: dataVal && dataVal[1],
                        name: name && name[1],
                        isActive: false, 
                        index,
                    };
                    accumulator = [...accumulator, block];
                    return accumulator;
                }, []);
                dispatch(setMangaGenres(blocks));
                if (callback) {
                    callback(blocks);
                }
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
                }, []);
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

export const getMangaChaptersList = (url) => {
    return (dispatch) => {
        dispatch(setLoadingState(true, 'mangaChapters'));
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        // autocheck for adult manga
        myHeaders.append('Cookie', 'isAdult=1;');
        return fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders,
        }).then((response) => {
            response.text().then((text) => {
                try {
                    const searchBlock = text.match(/<ul class="detail-main-list">(.+?)<\/ul>/);
                    const genreBlocks = searchBlock && searchBlock[0].match(/<li(.+?)<\/li>/g);
                    const blocks = genreBlocks.reduce((accumulator, value) => {
                        const name = value.match(/title="(.*?)"/);
                        const link = value.match(/<a href="\/manga\/(.+?.html)"/);
                        if (!link || !name ) {
                            return accumulator;
                        }
                        const block = { 
                            name: name && name[1],
                            link: link && mangaPath + link[1],
                        };
                        accumulator = [...accumulator, block];
                        return accumulator;
                    }, []);
                    dispatch(setMangaChaptersList(blocks.reverse()));
                } catch(err) {
                    console.log(err);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
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

export const fetchChapter = (url) => {
    return async (dispatch) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        const respText = await (await fetch(url,{
            mode: 'no-cors',
            method: 'get',
            headers: myHeaders
        })).text();
        const chapterId = respText.match(/chapterid[\s\S]=(.*?);/);
        const content = respText.match(/meta name="og:url" content="(.*?)"/);
        const changedContent = content && content[1].replace('mangafox.me','fanfox.net');
        // const chapterUrl = `${changedContent}chapterfun.ashx?cid=${chapterId ? chapterId[1] : ''}&page=1&key=`;
        let intervalImages;
        const imagesArray = await new Promise((resolve) => {
            let images = [];
            let accumulator = [];
            let page = 1;
            intervalImages = setInterval(async () => {
                const chapterUrl = `${changedContent}chapterfun.ashx?cid=${chapterId ? chapterId[1] : ''}&page=${page}&key=`;
                images = await fetchImage({ chapterUrl, url });
                if (images && images.length <= 1) {
                    // clearInterval(intervalImages);
                    const isDublicate = accumulator[accumulator.length - 1] === images[0];
                    isDublicate ? resolve(accumulator) : resolve([...accumulator,  ...images ]);
                }
                accumulator = [...accumulator, ...images];
                page += 2;
            }, 2000);
        });
        clearInterval(intervalImages);
        console.log('imagesArray', imagesArray);
    };
};

const fetchImage = ({ url ,chapterUrl }) => {
    return new Promise(async (resolve) => {
        const blobHeaders = new Headers();
        blobHeaders.append('Content-Type', 'text/html');
        blobHeaders.append('Referer', url);
        let blobResp = await fetch(chapterUrl, {
            mode: 'no-cors',
            method: 'get',
            headers: blobHeaders,
        });
        if (blobResp._bodyBlob._data.size <= 0) {
            let interval;
            let repeatCounter = 0;
            blobResp = await new Promise((fetchResolve) => {
                let blobResponse;
                interval = setInterval(async () => {
                    blobResponse = await fetch(chapterUrl, {
                        mode: 'no-cors',
                        method: 'get',
                        headers: blobHeaders,
                    });
                    repeatCounter += 1 ;
                    if (blobResponse._bodyBlob._data.size >= 0 || repeatCounter >= repeatMaxCounter) {
                        fetchResolve(blobResponse);
                        // clearInterval(interval);
                    }
                }, 2000);
            });
            clearInterval(interval);
        }
        const blob = await blobResp.blob();
        var reader = new FileReader();
        reader.onload = function() {
            const ev = eval(reader.result);
            console.log('ev', ev);
            const img = 'http:' + ev[0];
            ev[1] ? resolve([img, ev[1]]) : resolve([img]);
            // resolve([img, ev[1]]);
        };
        reader.readAsText(blob);
    });
};