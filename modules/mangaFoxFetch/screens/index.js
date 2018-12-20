import Chapter from './Chapter';
import ChaptersList from './ChaptersList';
import Main from './Main';
import { screenNames } from '../config/consts';

const screensArray = [
    { name: screenNames.Main.name, screen: Main }, 
    { name: screenNames.Chapter.name, screen: Chapter },
    { name: screenNames.ChaptersList.name, screen: ChaptersList }
];

export const entry = screenNames.Main.name;

// first is main screen
export default screensArray;