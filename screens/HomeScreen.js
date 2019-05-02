/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    TouchableOpacity,
    View,
    ViewPagerAndroid,
} from 'react-native';
import { connect } from 'react-redux';
// need to import actions or the app will crush /?/
import '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/Home';
import HotRelease from '../components/HotRelease';
import siteNames from '../utils/sitenames';


class Home extends React.Component {

    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
    };


    keyExtractor = (item, index) => item.name || index.toString();
    
    openMangaSite = (link) => {
        const { navigation: { navigate } } = this.props;
        navigate(screenNames.Site.name, { moduleName: link });
    }

    createSiteLinks = () => {
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
                  <HotRelease moduleName={link} openMangaLink={this.openMangaLink}  />
                </View>
                <View style={styles.hotRelease}>
                  <HotRelease moduleName={link} openMangaLink={this.openMangaLink} />
                </View>
              </View>
            );
        });
    }

    openMangaLink = (manga, moduleName) => {
      const { navigation: { navigate } } = this.props;
      navigate(screenNames.ChaptersList.name, { manga, moduleName });
    }

    render() {
      // TODO only Android for now, implement nested scroll view for ios for the future
        return (
          <ViewPagerAndroid 
            style={styles.container}
          >
            {this.createSiteLinks()}
          </ViewPagerAndroid>
        );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps)(Home);