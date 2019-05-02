/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
// need to import actions or the app will crush /?/
import '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/Home';
import HotRelease from '../components/HotRelease';
import siteNames from '../utils/sitenames';


class Home extends React.Component {
    state = { enabled: true };

    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
    };

    setScrolling = (enabled) => this.setState({ enabled });

    keyExtractor = (item, index) => item.name || index.toString();
    
    openMangaSite = (link) => {
        const { navigation: { navigate } } = this.props;
        this.setScrolling(true);
        navigate(screenNames.Site.name, { moduleName: link });
    }

    createSiteLinks = () => {
      const { navigation } = this.props;
        return siteNames.map((link, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <View style={styles.siteContainer} key={index}>
                <TouchableOpacity onPress={() => { this.openMangaSite(link); }} style={styles.touchableOpacity}>
                  <Text style={styles.blockName}>
                    {link.toUpperCase()}
                  </Text>
                </TouchableOpacity>
                <View style={styles.hotRelease}>
                  <HotRelease moduleName={link} setScrolling={this.setScrolling} navigation={navigation} />
                </View>
                {/* <View style={styles.hotRelease}>
                  <HotRelease moduleName={link} setScrolling={this.setScrolling} />
                </View> */}
              </View>
            );
        });
    }

    onScrollEndDrag = ({ nativeEvent }) => { 
    }

    openMangaLink = (manga, moduleName) => {
      const { navigation: { navigate } } = this.props;
      this.setScrolling(true);
      navigate(screenNames.ChaptersList.name, { manga, moduleName });
    }

    render() {
      const { enabled } = this.state;

      //TODO change manga selection to panel side

      return (
        <FlatList
          scrollEnabled={enabled} 
          data={siteNames}
          horizontal
          onScrollEndDrag={this.onScrollEndDrag}
          keyExtractor={this.keyExtractor}
          style={styles.container}
          renderItem={({item}) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <View style={styles.siteContainer}>
                      <TouchableOpacity onPress={() => { this.openMangaSite(item); }} style={styles.touchableOpacity}>
                        <Text style={styles.blockName}>
                          {item.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.hotRelease}>
                        <HotRelease moduleName={item} setScrolling={this.setScrolling} openMangaLink={this.openMangaLink} />
                      </View>
                      {/* <View style={styles.hotRelease}>
                        <HotRelease moduleName={link} setScrolling={this.setScrolling} />
                      </View> */}
                    </View>
                  );
              }}
        />
      );
        // return (
        //   <ScrollView 
        //     scrollEnabled={enabled} 
        //     horizontal
        //     style={styles.container}
        //     onScrollEndDrag={this.onScrollEndDrag}
        //   >
        //     {this.createSiteLinks()}
        //   </ScrollView>
        // );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps)(Home);