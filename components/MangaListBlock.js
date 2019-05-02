/* eslint-disable react/jsx-filename-extension */
import React, { Fragment } from 'react';
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

class MangaList extends React.Component {
  static propTypes = {
    // navigation: PropTypes.shape({}).isRequired,
    moduleName: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    setScrolling: PropTypes.func.isRequired,
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
  // openMangaLink = (manga) => {
  //   const { navigation: { navigate }, moduleName } = this.props;
  //   navigate(screenNames.ChaptersList.name, { manga, moduleName });
  // }

  render() {
    const { list, setScrolling, blockName } = this.props;
    return (
      list.length > 0 ? (
        <Fragment>
          <Text style={styles.blockName}>
            {blockName}
          </Text>
          <ScrollView
            horizontal
            style={styles.flatList}
            onResponderGrant={
              () => {
                console.log('onResponderGrant');
                setScrolling(false); 
              }
            }
            onTouchStart={() => { 
              setScrolling(false);
            }}
            onMomentumScrollEnd={() => { 
              setScrolling(true);
            }}
            onScrollEndDrag={() => { 
              setScrolling(true); 
            }}
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

