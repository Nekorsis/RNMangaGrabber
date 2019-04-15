/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchHotCategoryAsync } from '../actions';
import MangaListBlock from './MangaListBlock';
import styles from '../screens/styles/Home';

// const HotRelease = ({ moduleName, store }) => {

//   const { hotCategories: { [moduleName]: hotInfo } = {} } = store;

//   console.log(hotInfo);

//   useEffect(() => {
//     getHotCategory(moduleName);
//   });

//   return (
//   <ScrollView pagingEnabled style={styles.container}>

//   </ScrollView>
//   )

// }

class HotRelease extends React.Component {
  componentDidMount() {
    const { moduleName, getHotCategory } = this.props;
    
    getHotCategory(moduleName);
  }
  render() {
    const { moduleName, store, setScrolling } = this.props;
    const { hotCategories: { [moduleName]: hotInfo } = {} } = store;

    return (
      hotInfo ?(
        <MangaListBlock list={hotInfo} setScrolling={setScrolling} />
      )
      : <ActivityIndicator />
    );
  }
} 

HotRelease.propTypes = {
  store: PropTypes.shape({}).isRequired,
  moduleName: PropTypes.string.isRequired,
  getHotCategory: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
  getHotCategory: bindActionCreators(fetchHotCategoryAsync, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotRelease);