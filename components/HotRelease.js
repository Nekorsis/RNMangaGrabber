/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchHotCategoryAsync } from '../actions';
import MangaListBlock from './MangaListBlock';

const BLOCK_NAME = 'Hot Releases';

class HotRelease extends React.Component {
  componentDidMount() {
    const { moduleName, getHotCategory } = this.props;
    
    getHotCategory(moduleName);
  }

  render() {
    const { moduleName, store, ...extra } = this.props;
    const { hotCategories: { [moduleName]: hotInfo } = {} } = store;

    return (
      <MangaListBlock 
        blockName={BLOCK_NAME} 
        list={hotInfo} 
        moduleName={moduleName}
        {...extra}
      />
    );
  }
} 

HotRelease.propTypes = {
  store: PropTypes.shape({}).isRequired,
  moduleName: PropTypes.string.isRequired,
  getHotCategory: PropTypes.func.isRequired,
  openMangaLink: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    store: state.appReducer,
});

const mapDispatchToProps = dispatch => ({
  getHotCategory: bindActionCreators(fetchHotCategoryAsync, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotRelease);