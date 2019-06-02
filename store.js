export const initState = {
    mangaData: null,
    mangaList: {
        isLoading: true,
        list: null,
    },
    mangaGenres: null,
    mangaChapters: { isLoading: true, mangaChaptersList: null },
    isLoading: false,
    imagesInfo: {
        isLoading: true,
        imagesArray: null,
    },
    filter: {
        filterUrl: null,
    },
    chapterPromise: null,
    moduleName: 'mangaFox',
    hotCategories: {},
    readingNowCategories: {},
};
export default initState;
