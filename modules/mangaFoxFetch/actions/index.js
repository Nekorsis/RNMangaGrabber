import { mangaPath, searchPath } from '../config/Network';
import { repeatMaxCounter, moduleName } from '../config/consts';
import { 
    setMangaGenres, 
    setLoadingState, 
    setMangaList, 
    saveChapterImages, 
    setMangaChapter, 
    setMangaChaptersList,
    setCategory,
} from '../../../actions/common';

const imgSrcRegex = /img.+?src="(.+?)".+?<\/a>/;
const nameRegex = /title="(.*?)"><img\s/;
const linkRegex = /<a href="\/manga\/(.+?)\/"/;
const itemScoreRegex = /<span class="item-score">(\d+\.\d+)<\/span>/;

export const fetchCategoryAsync = (path, category, customParser) => {
    return async function(dispatch) {
        // eslint-disable-next-line no-undef
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');
        let list;
        try {
            const response = await fetch(path, {
                mode: 'no-cors',
                method: 'get',
                headers: myHeaders
            });
            
            const textifiedResponse = await response.text();

            console.log(customParser);
            
            if(customParser) {
                list = customParser(textifiedResponse);
            } else {
                list = textifiedResponse.split('<li').reduce((accumulator, value) => {
                    const imgsrc = value.match(imgSrcRegex);
                    const name = value.match(nameRegex);
                    const link = value.match(linkRegex);
                    const itemScore = value.match(itemScoreRegex);
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
            }
            dispatch(setCategory(moduleName, list, category));
        }
        catch (err) {
            throw new Error(err);
        }
    };
};

export const fetchMangaGenresAsync = (callback) => {
    return async function(dispatch) {
        // eslint-disable-next-line no-undef
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');

        try {
            const response = await fetch(searchPath, {
                mode: 'no-cors',
                method: 'get',
                headers: myHeaders
            });

            const textifiedResponse = await response.text();
            const searchBlock = textifiedResponse.match(/<div class="tag-box">(.+?)<\/div>/);
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
            dispatch(setLoadingState(false, 'mangaList'));
            return blocks;
        }
        catch (err) {
            dispatch(setLoadingState(false, 'mangaList'));
            console.log(err);
        }
    };
};

export const fetchMangaListAsync = (url) => {
    return async function(dispatch) {
        dispatch(setLoadingState(true, 'mangaList'));
        // eslint-disable-next-line no-undef
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'text/html');

        try {
            const response = await fetch(url, {
                mode: 'no-cors',
                method: 'get',
                headers: myHeaders
            });

            const textifiedResponse = await response.text();

            

            const blocks = textifiedResponse.split('<li').reduce((accumulator, value) => {
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
            dispatch(setLoadingState(false, 'mangaList'));
            return dispatch(setMangaList(blocks));
        }
        catch (err) {
            console.log(err);
            dispatch(setLoadingState(false, 'mangaList'));
        }
    };
};

export const searchMangaAsync = (filter) => {
    return (dispatch) => {
        // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
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

export const fetchChapter = (url) => {
    return (dispatch, getState) => {
        try {
        let cancel;
        let innerPromise;
        let { appReducer: { chapterPromise } } = getState();
        if (chapterPromise) {
            chapterPromise.cancel('Rejected by another request');
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
            // eslint-disable-next-line no-undef
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
            innerPromise = recursiveTimeoutFetchChapter({ url, chapterId, changedContent });
            innerPromise.promise.then((info) => {
                dispatch(setMangaChapter(null));
                if (info.err) {
                    dispatch(saveChapterImages({ err: info.err }));
                    resolve(info);
                }
                if (info) {
                    dispatch(saveChapterImages(info));
                    resolve(info);
                }
            }).catch((err) => { 
                console.log('reject innerPromise');
                dispatch(saveChapterImages({ err }));
            });
        }), cancel};
        dispatch(setMangaChapter(chapterObject));
    } catch(err) {
        console.log('reject');
        dispatch(saveChapterImages({ err }));
    }
    };
};

const recursiveTimeoutFetchChapter = ({ url, chapterId, changedContent }) => {
    let timeout;
    let cancel;
    return { promise: new Promise((resolve, reject) => {
    let images = [];
    cancel = (reason) => {
        clearTimeout(timeout);
        reject(reason);
    };
    let accumulator = [];
    let page = 1;
    timeout = () => {
        try {
        setTimeout(async () => {
            const chapterUrl = `${changedContent}chapterfun.ashx?cid=${chapterId ? chapterId[1] : ''}&page=${page}&key=`;
            images = await fetchImage({ url, chapterUrl });
            if(images && images.err) {
                clearTimeout(timeout);
                reject(images.err);
                return;
            }
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
    } catch (err) {
        clearTimeout(timeout);
        reject(err);
        }
    };
    timeout(); 
}).catch((err) => {
    clearTimeout(timeout);
    return { err };
}), cancel };
};

const fetchImage = ({ url, chapterUrl }) => {
    return new Promise(async (resolve, reject) => {
        try { 
        // eslint-disable-next-line no-undef
        const blobHeaders = new Headers();
        blobHeaders.append('Content-Type', 'text/html');
        blobHeaders.append('Referer', url);
        let blobResp = await fetch(chapterUrl, {
            mode: 'no-cors',
            method: 'GET',
            headers: blobHeaders,
        });
        if (blobResp._bodyText.length <= 0) {
            let interval;
            let repeatCounter = 0;
            blobResp = await new Promise((fetchResolve) => {
                let blobResponse;
                interval = setInterval(async () => {
                    blobResponse = await fetch(chapterUrl, {
                        mode: 'no-cors',
                        method: 'GET',
                        headers: blobHeaders,
                    });
                    repeatCounter += 1 ;
                    if (blobResponse._bodyText.length >= 0 || repeatCounter >= repeatMaxCounter) {
                        fetchResolve(blobResponse);
                        // clearInterval(interval);
                    }
                }, 500);
            });
            clearInterval(interval);
        }
        eval(blobResp._bodyText);
        const regex = /http:.*/;
        // eval defines d var, webpack likes to dcompress vars and we can't use d right away, so i define array 
        const arrrr = d;
        const fixedImgArray = arrrr.map((imgsrc) => {
            return { url: imgsrc.match(regex) ? imgsrc : 'http:' + imgsrc };
        });
        resolve(fixedImgArray);
        } catch(err) {
            reject(err);
        }
    }).catch((err) => {
        return { err };
    });
};

export default { 
    fetchMangaGenresAsync, 
    fetchMangaListAsync, 
    searchMangaAsync, 
    fetchChapter, 
    getMangaChaptersList,
    fetchCategoryAsync,
};