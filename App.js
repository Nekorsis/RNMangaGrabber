/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';


import HarwareNavigation from './HarwareNavigation';
import routes from './navigation/AppNavigator';
import reducer from './reducers/reducers';
import vars from './screens/styles/vars';

const reactNavigationMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);

const store = createStore(
    reducer,
    applyMiddleware(thunk, reactNavigationMiddleware),
);

export const ReduxifiedNav = reduxifyNavigator(routes, 'root');

export default class App extends React.Component {
  state = {
      isLoadingComplete: false,
  };

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
              <HarwareNavigation ReduxifiedNav={ReduxifiedNav} />
            </View>
          </Provider>
        );
    }
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: vars.white,
    },
});
