/* eslint-disable react/jsx-filename-extension */
import React, { Fragment } from 'react';
import {
    Image,
    Text,
    TouchableWithoutFeedback,
    View,
    ScrollView,
    PanResponder,
} from 'react-native';
import styles from './styles/MangaList';


class MangaList extends React.Component {
  keyExtractor = (item, index) => item.name || index.toString();

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log(gestureState);
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  render() {
    const { list, setScrolling } = this.props;
    return (
      list && (
        <ScrollView
          horizontal
          style={styles.flatList}
          onTouchStart={() => { 
            setScrolling(false); }}
            onMomentumScrollEnd={() => { setScrolling(true); }}
          onScrollEndDrag={() => { setScrolling(true); }}
          setScrolling
        >
          {list.map((item, index) => {
                      return (
                        <TouchableWithoutFeedback style={styles.touchableOpacity} key={this.keyExtractor(item.name, index)}>
                          <View>
                            <Image
                              style={styles.itemImage}
                              source={{uri: item.img}}
                            />
                            <Text style={styles.itemScore}>{item.itemScore}</Text>
                            <View style={styles.itemTextContainer}>
                              <Text style={styles.itemText}>{`${item.name}`}</Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      );
        })}
        </ScrollView>
        )
      );
  }
}


export default MangaList;