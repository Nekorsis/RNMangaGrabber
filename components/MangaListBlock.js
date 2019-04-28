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
import styles from './styles/MangaList';


class MangaList extends React.Component {
  keyExtractor = (item, index) => item.name || index.toString();

  render() {
    const { list, setScrolling, blockName } = this.props;
    console.log(list && list[list.length -1]);
    return (
      list ? (
        <Fragment>
          <Text style={styles.blockName}>
            {blockName}
          </Text>
          <ScrollView
            horizontal
            style={styles.flatList}
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
                          <TouchableOpacity style={styles.touchableOpacity} key={this.keyExtractor(item.name, index)}>
                            <Image
                              style={styles.itemImage}
                              source={{uri: item.img}}
                            />
                            <Text style={styles.itemScore}>{item.itemScore}</Text>
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