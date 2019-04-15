/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import styles from './styles/MangaList';

// componentWillMount () {
  // this._panResponder = PanResponder.create({
    // onPanResponderTerminationRequest: () => false,
    // onStartShouldSetPanResponderCapture: () => true,
  // });
// }



const MangaList = ({ list }) => {
  const keyExtractor = (item, index) => item.name || index.toString();
    return (
      list && (
        <FlatList
          data={list}
          keyExtractor={keyExtractor}
          renderItem={({item}) => {
            if (!item.name) {
                return false;
            }
            return (
              <TouchableOpacity onPress={() => { this.openMangaLink(item); }} style={styles.touchableOpacity}>
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
        }}
        />
        )
      );
};


export default MangaList;