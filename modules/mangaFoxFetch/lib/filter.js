// lib for manga filtration

export default class Filter {
    constructor(genres) {
        if (genres) {
        // this._filterGenre = genres.map((item) => { return { name: item.name, value: item.value, isActive: false }; });
        this._filterGenre = genres.reduce((accumulator, item) => {
            accumulator[item.name] = { name: item.name, value: item.value, isActive: false };
            return accumulator;
        } ,{});
    }
        this._filterName = '';
        this._filterAuthorName = '';
    }

    initFilter(genres) {
        this._filterGenre = genres.reduce((accumulator, item) => {
            accumulator[item.name] = { name: item.name, value: item.value, isActive: false };
            return accumulator;
        } ,{});
    }
    
    addFilterGenre = () => {

    }

    generateFilterRequest = () => {
        // encodeURIComponent();
    }
}