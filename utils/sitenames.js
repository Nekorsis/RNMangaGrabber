import modules from '../modules';

export default modules.map((mod) => {
    const { moduleName, mangaDirectoryUrl, searchPath, scrollFilter, isNovel } = mod;
    return { moduleName, mangaDirectoryUrl, searchPath, scrollFilter, isNovel };
}, {});