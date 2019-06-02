import HotCategoryStyles from '../styles/HotCategory';
import { funcNames, listNames } from '../../../constants/consts';

export const blocksHorizontal = [[
    {
        blockName: 'hotCategory', 
        name: 'Hot Releases',
        limit: 10,
        styles: HotCategoryStyles,
        viewStyles: HotCategoryStyles.viewStyles,
        get: funcNames.getHotCategory,
        listName: listNames.hotCategory,
    },
    {
        blockName: 'hotCategory', 
        name: 'Hot ReleasesSSSSS',
        limit: 10,
        styles: HotCategoryStyles,
        viewStyles: HotCategoryStyles.viewStyles,
        get: funcNames.getHotCategory,
        listName: listNames.hotCategory,
    },
], [{
    blockName: 'hotCategory', 
    name: 'Hot Releases',
    limit: 10,
    styles: HotCategoryStyles,
    get: funcNames.getHotCategory,
    viewStyles: HotCategoryStyles.viewStyles,
    listName: listNames.hotCategory,
}]];

export const blocksVertical = [[
    {
        blockName: 'hotCategory', 
        name: 'Hot Releases',
        limit: 10,
        styles: HotCategoryStyles,
        get: funcNames.getHotCategory,
        viewStyles: HotCategoryStyles.viewStyles,
        listName: listNames.hotCategory,
    }
]];
