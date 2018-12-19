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
    chapter: null,
};
export default initState;
