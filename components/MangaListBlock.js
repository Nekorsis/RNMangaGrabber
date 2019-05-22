/* eslint-disable react/jsx-filename-extension */
import React, { Fragment, PureComponent } from 'react';
import {
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

// import styles from './styles/MangaList';
import MappedList from './MappedList';

class MangaList extends PureComponent {
  static propTypes = {
    moduleName: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    blockName: PropTypes.string.isRequired,
    openMangaLink: PropTypes.func.isRequired,
    styles: PropTypes.shape({}).isRequired
  };
  static defaultProps = {
    list: [],
  };

  keyExtractor = (item, index) => item.name || index.toString();

  render() {
    const { list, blockName, styles } = this.props;
    return (
      list.length > 0 ? (
        <Fragment>
          <Text style={styles.blockName}>
            {blockName}
          </Text>
          <ScrollView
            nestedScrollEnabled
            horizontal
            style={styles.flatList}
          >
            <MappedList {...this.props} />
          </ScrollView>
        </Fragment>
        ) :
        <ActivityIndicator />
      );
  }
}

export default MangaList;

