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
    SAVE_CHAPTER_IMAGES: 'SAVE_CHAPTER_IMAGES',
    SET_LOADING_CHAPTER: 'SET_LOADING_CHAPTER',
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
        dispatch(setLoadingState(true, 'mangaList'));
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


export const setMangaChapter = (chapter) => {
    return {
        type: actionTypes.SET_LOADING_CHAPTER,
        payload: { chapter },
    };
};

export const deleteMangaChapter = (chapter) => {
    return {
        type: actionTypes.DELETE_LOADING_CHAPTER,
        payload: { chapter },
    };
};


export const fetchChapter = (url) => {
    return (dispatch, getState) => {
        let cancel;
        let innerPromise;
        let { mangaFoxReducer: { chapter } } = getState();
        if (chapter) {
            chapter.cancel('Rejected by another request');
            dispatch(setMangaChapter(null));
        }
        const chapterObject = { promise: new Promise(async (resolve) => {
            cancel = (reason) => {
                if (innerPromise) {
                    innerPromise.cancel('Rejected by another request');
                }
                dispatch(setMangaChapter(null));
                resolve(reason);
            };
            const myHeaders = new Headers();
            dispatch(setLoadingState(true, 'imagesInfo'));
            myHeaders.append('Content-Type', 'text/html');
            const respText = await (await fetch(url,{
                mode: 'no-cors',
                method: 'get',
                headers: myHeaders
            })).text();
            const chapterId = respText.match(/chapterid[\s\S]=(.*?);/);
            const content = respText.match(/meta name="og:url" content="(.*?)"/);
            const changedContent = content && content[1].replace('mangafox.me','fanfox.net');
            innerPromise = recursiveTimeoutFetchChapter({ url, chapterId, changedContent, dispatch });
            innerPromise.promise.then((info) => {
                dispatch(setMangaChapter(null));
                if (info) {
                    dispatch(saveChapterImages(info));
                    resolve();
                }
            }).catch((err) => console.log('err', err));
        }), cancel};
        dispatch(setMangaChapter(chapterObject));
    };
};

export const saveChapterImages = (imagesArray) => {
    return {
        type: actionTypes.SAVE_CHAPTER_IMAGES,
        payload: { imagesArray },
    };
};

export const rejectChapterLoad = () => {
    return async (dispatch, getState) => {
        const { mangaFoxReducer: { chapter } } = getState();
        if (chapter) {
            chapter.cancel('Rejected by exit from the chapter reader');
            dispatch(setMangaChapter(null));
        }
    }; 
};

const recursiveTimeoutFetchChapter = ({ url, chapterId, changedContent, dispatch }) => {
    let timeout;
    let cancel;
    return { promise: new Promise((resolve, reject) => {
    console.log('in promise');
    let images = [];
    cancel = (reason) => {
        console.log('in promise cancellation');
        clearTimeout(timeout);
        reject(reason);
    };
    let accumulator = [];
    let page = 1;
    timeout = () => {
        setTimeout(async () => {
            const chapterUrl = `${changedContent}chapterfun.ashx?cid=${chapterId ? chapterId[1] : ''}&page=${page}&key=`;
            // console.log('timeout for ch', chapterUrl);
            images = await fetchImage({ chapterUrl, url });
            const slicedArray = accumulator.slice(accumulator.length - images.length, accumulator.length);
            const preparedImages = images.reduce((reduce, item) => {
                if (slicedArray.some((someItem) => item.url === someItem.url)) {
                    return reduce;
                }
                return [...reduce, item];
                }, []);

            if (images && images.length <= 1) {
                accumulator = [...accumulator,  ...preparedImages ];
                resolve(accumulator);
                return;
            }
            accumulator = [...accumulator, ...preparedImages];
            page += 1;
            // page % 4 === 0 && dispatch(saveChapterImages(accumulator));
            timeout();
        }, 100);
    };
    timeout();
}).catch((err) => {
    clearTimeout(timeout);
    console.log(err); 
}), cancel };
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
                }, 500);
            });
            clearInterval(interval);
        }
        const blob = await blobResp.blob();
        var reader = new FileReader();
        reader.onload = function() {
            const ev = eval(reader.result);
            const img = 'http:' + ev[0];
            ev[1] ? resolve([{ url: img }, { url: ev[1] }]) : resolve([{ url: img }]);
        };
        reader.readAsText(blob);
    });
};