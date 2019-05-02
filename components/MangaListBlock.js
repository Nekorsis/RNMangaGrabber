/* eslint-disable react/jsx-filename-extension */
import React, { Fragment, PureComponent } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles/MangaList';

class MangaList extends PureComponent {
  static propTypes = {
    moduleName: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    blockName: PropTypes.string.isRequired,
    openMangaLink: PropTypes.func.isRequired,
  };
  static defaultProps = {
    list: [],
  };

  keyExtractor = (item, index) => item.name || index.toString();

  touchableOpacityOnPress = (item) => () => {
    const { openMangaLink, moduleName } = this.props;
    return openMangaLink(item, moduleName);
  }

  render() {
    const { list, blockName } = this.props;
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
            {list.map((item, index) => {
              return (
                <TouchableOpacity 
                  onPress={this.touchableOpacityOnPress(item)} 
                  style={styles.touchableOpacity} 
                  key={this.keyExtractor(item.name, index)}
                >
                  <Image
                    style={styles.itemImage}
                    source={{uri: item.img}}
                  />
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemText}>{`${item.name}`}</Text>
                  </View>
                </TouchableOpacity>
              );
          })}
          </ScrollView>
        </Fragment>
        ) :
        <ActivityIndicator />
      );
  }
}

export default MangaList;

