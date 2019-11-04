/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    TouchableOpacity,
    View,
    ViewPagerAndroid,
    Image,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import {  fetchCategoryAsync } from '../actions';
import { setError } from '../actions/common';
import { screenNames } from '../constants/consts';
import homeStyles from './styles/Home';
import MangaListBlock from '../components/common/MangaListBlock';
import modules from '../modules';
import right_arrow from '../assets/images/right_arrow.png';
// import ErrorHoc from '../components/common/ErrorHoc';
// import ModuleBlocks from '../components/common/ModuleBlocks';

class Home extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
        defineError: PropTypes.func.isRequired,
        getListCategory: PropTypes.func.isRequired,
    };

    state = { modalVisible: true }
      
    setModal(isVisible) {
      this.setState({ modalVisible: isVisible });
    }

    keyExtractor = (item, index) => item.name || index.toString();

    openMangaSite = (mod) => {
      const { navigation: { navigate } } = this.props;
      navigate(screenNames.Site.name, mod);
  }

    getCategory = (moduleName, path, blockName, customParser) => () => {
      const { getListCategory } = this.props;
      return getListCategory(moduleName, path, blockName, customParser);
    }

    createBlock = ({ viewStyles, category, list, moduleName, isNovel, getList, key }) => (
      <View style={viewStyles} key={key}>
        <MangaListBlock 
          blockName={category.blockName}
          styles={category.styles}
          list={list} 
          getList={getList} 
          openMangaLink={this.openMangaLink(moduleName, isNovel)}
        />
      </View>
    );

    createBlocks = () => {
      const { store: { moduleName } } = this.props;
      const moduleBlock = modules[moduleName];
      const { blocksHorizontal, searchPath, mangaDirectoryUrl  } = moduleBlock;
      const blocksHoriz = blocksHorizontal.map((block, index) => {
        const blocks = block.map((item) => {
          const { styles, name: blockName, listName, viewStyles, path, customParser } = item;
          const { store: { [listName] : { [moduleName] : list } } } = this.props;
          const getList = this.getCategory(moduleName, path, listName, customParser);
          return this.createBlock({ viewStyles, category: { styles, blockName }, list, getList, key: blockName, moduleName });
        });
        if(index === 0) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <View style={homeStyles.siteContainer} key={index}>
              <TouchableOpacity onPress={() => { this.openMangaSite({ moduleName, searchPath, mangaDirectoryUrl }); }} style={homeStyles.touchableOpacity}>
                <Text style={homeStyles.blockName}>
                  {moduleName.toUpperCase()}
                  <Image
                    source={right_arrow}
                    style={homeStyles.rightButtonImage}
                  />
                </Text>
              </TouchableOpacity>
              {blocks}
            </View>
          );
        }
        return blocks;
      });
      return blocksHoriz;
    }

    openMangaLink = (moduleName, isNovel)  => (manga) => {
      const { navigation: { navigate } } = this.props;
      navigate(screenNames.ChaptersList.name, { manga, moduleName, isNovel });
    }

    onRequestClose = () => {
      const { defineError } = this.props;
      defineError(null);
    }

    render() {
      const { store: { err } } = this.props;
      const { modalVisible } = this.state;
      

      // TODO only Android for now, implement nested scroll view for ios for the future
      // TODO change logic, move site selection to the side menu, viewpager will be only
      // for small blocks with manga of selected site
      // renderSite blocks like hot releases
      return (
        err && modalVisible ? (
          <View> 
          </View>
          ) : ( 
            <ViewPagerAndroid 
              style={homeStyles.container}
            >
              {this.createBlocks()}
            </ViewPagerAndroid>
      )
      );
    }
}

const mapDispatchToProps = dispatch => ({
  getListCategory: bindActionCreators(fetchCategoryAsync, dispatch),
  defineError: bindActionCreators(setError, dispatch),
});

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);