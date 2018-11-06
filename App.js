import React, { Component, PureComponent  } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { NavigationActions } from 'react-navigation';
import { BackHandler } from 'react-native';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import AppNavigator from './AppNavigator';
import reducer from './reducers/reducers.js';

const reactNavigationMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const createStoreWithMiddleware = applyMiddleware(thunk, reactNavigationMiddleware)(createStore);

// const store = createStore(
//     reducer,
//     applyMiddleware(thunk, reactNavigationMiddleware),
// );
const store = createStoreWithMiddleware(reducer);

export const AppNav = reduxifyNavigator(AppNavigator, 'root');
// const mapStateToProps = (state) => ({
//     state: state.nav,
// });
// const AppWithNavigationState = connect(mapStateToProps)(AppNav);

class Navigation extends PureComponent {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
onBackPress = () => {
    const { dispatch, state } = this.props;
    if (state.index === 0) {
        return false;
    }
    dispatch(NavigationActions.back());
    return true;
};
render() {
    const navigation = {
        state: this.props.state,
        dispatch:this.props.dispatch,
    };
    return <AppNav
        // state={this.props.state}
        // dispatch={this.props.dispatch}
    />;
}
}

const mapStateToPropss = state => ({
    state: state.nav,
});
const ConnectedApp = connect(mapStateToPropss)(Navigation);

export default class App extends React.Component {
  state = {
      isLoadingComplete: false,
  };

  render() {
      if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
          return (
              <Provider store={store}>
                  <AppLoading
                      startAsync={this._loadResourcesAsync}
                      onError={this._handleLoadingError}
                      onFinish={this._handleFinishLoading}
                  />
              </Provider>
          );
      } else {
          return (
              <Provider store={store}>
                  <View style={styles.container}>
                      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                      {/* <AppNavigator /> */}
                      <ConnectedApp />
                  </View>
              </Provider>
          );
      }
  }

  _loadResourcesAsync = async () => {
      return Promise.all([
          Asset.loadAsync([
              require('./assets/images/robot-dev.png'),
              require('./assets/images/robot-prod.png'),
          ]),
          Font.loadAsync({
              // This is the font that we are using for our tab bar
              ...Icon.Ionicons.font,
              // We include SpaceMono because we use it in HomeScreen.js. Feel free
              // to remove this if you are not using it in your app
              'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          }),
      ]);
  };

  _handleLoadingError = error => {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(error);
  };

  _handleFinishLoading = () => {
      this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
