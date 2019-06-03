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


import { fetchHotCategoryAsync, fetchReadingCategoryAsync } from '../actions';
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
        getHotCategory: PropTypes.func.isRequired,
        getReadingCategory: PropTypes.func.isRequired,
        defineError: PropTypes.func.isRequired,
    };

    state = { modalVisible: true }

    keyExtractor = (item, index) => item.name || index.toString();
    
    openMangaSite = (mod) => {
        const { navigation: { navigate } } = this.props;
        navigate(screenNames.Site.name, mod);
    }
  
    setModal(isVisible) {
      this.setState({ modalVisible: isVisible });
    }

    getHot = moduleName => () => {
      const { getHotCategory } = this.props;
      return getHotCategory(moduleName);
    }

    getReading = moduleName => () => {
      const { getReadingCategory } = this.props;
      getReadingCategory(moduleName);
    }

    // createSiteLinks = () => {
      
    //   // change and make this code for blocks of manga and other stuff, sites move to the side menu
    //     return modules.map((mod, index) => {
    //       const { moduleName, isNovel, blocksMetadata: { hotCategory, readingNow } } = mod;

    //       const { store: { hotCategories: { [moduleName] : hotInfo }, readingNowCategories: { [moduleName]: readingNowInfo } } } = this.props;
    //         return (
    //           // eslint-disable-next-line react/no-array-index-key
              // <View style={homeStyles.siteContainer} key={index}>
              //   <TouchableOpacity onPress={() => { this.openMangaSite(mod); }} style={homeStyles.touchableOpacity}>
              //     <Text style={homeStyles.blockName}>
              //       {moduleName.toUpperCase()}
              //     </Text>
              //   </TouchableOpacity>
    //             {hotCategory &&  
    //               (
    //               <View style={homeStyles.hotRelease}>
    //                 <MangaListBlock 
    //                   blockName={hotCategory.name}
    //                   styles={hotCategory.styles}
    //                   list={hotInfo} 
    //                   getList={this.getHot(moduleName)} 
    //                   openMangaLink={this.openMangaLink(moduleName, isNovel)}
    //                 />
    //               </View>
    //               )}
    //             {readingNow &&
    //               (
    //               <View style={homeStyles.hotRelease}>
    //                 <MangaListBlock 
    //                   blockName={readingNow.name}
    //                   styles={readingNow.styles}
    //                   list={readingNowInfo} 
    //                   getList={this.getReading(moduleName)} 
    //                   openMangaLink={this.openMangaLink(moduleName, isNovel)}
    //                 />
    //               </View>
    //               )}
    //           </View>
    //         );
    //     });
    // }

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
      console.log('createBlocks');
      const { store: { moduleName } } = this.props;
      const moduleBlock = modules[moduleName];
      const { blocksHorizontal, searchPath, mangaDirectoryUrl  } = moduleBlock;
      const blocksHoriz = blocksHorizontal.map((block, index) => {
        const blocks = block.map((item) => {
          const { styles, name: blockName, listName, get, viewStyles } = item;
          const { store: { [listName] : { [moduleName] : list } } } = this.props;
          const getList = this[get](moduleName);
          return this.createBlock({ viewStyles, category: { styles, blockName }, list, getList, key: blockName });
        });
        if(index === 0) {
          return (
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

    getStore = (listName, moduleName) => this.props.store[listName][moduleName];

    onRequestClose = () => {
      // const { defineError } = this.props;
      console.log('onRequestClose');
      // defineError(null);
    }

    render() {
      const { store: { err, moduleName }, defineError } = this.props;
      const { modalVisible } = this.state;
      

      // TODO only Android for now, implement nested scroll view for ios for the future
      // TODO change logic, move site selection to the side menu, viewpager will be only
      // for small blocks with manga of selected site
      // renderSite blocks like hot releases
      return (
        err && modalVisible ? (
          <View style={{marginTop: 22}}> 
            <Modal
              animationType="slide"
              transparent={false}
              visible={!!err}
              onRequestClose={this.onRequestClose}
            >
              <View style={{ marginTop: 22 }}>
                <View>
                  <Text>{err.toString()}</Text>
                  <TouchableHighlight
                    onPress={() => {
                      this.setModal(false);
                      defineError(null);
                    }}
                  >
                    <Text>Hide Modal</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
          ) : ( 
            <ViewPagerAndroid 
              style={homeStyles.container}
            >
              {this.createBlocks()}
              {/* <ModuleBlocks 
              moduleName={moduleName} 
              homeStyles={homeStyles} 
              getHot={this.getHot} 
              getStore={this.getStore} 
              navigation={this.props.navigation}
              screenNames={screenNames}
            /> */}
            </ViewPagerAndroid>
      )
      );
    }
}

const mapDispatchToProps = dispatch => ({
  getHotCategory: bindActionCreators(fetchHotCategoryAsync, dispatch),
  defineError: bindActionCreators(setError, dispatch),
  getReadingCategory: bindActionCreators(fetchReadingCategoryAsync, dispatch),
});

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);