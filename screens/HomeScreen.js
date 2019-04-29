/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
// need to import actions or the app will crush /?/
import '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/Home';
import vars from './styles/vars';
import HotRelease from '../components/HotRelease';
import siteNames from '../utils/sitenames';
import siteImages from '../assets/images/siteimages';

const width = vars.width / 3;

class Home extends React.Component {
    state = { enabled: true, currentPage: 0 };

    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
    };

    setScrolling = (enabled) => this.setState({ enabled });
    
    openMangaSite = (link) => {
        const { navigation: { navigate } } = this.props;
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

    render() {
      const { enabled } = this.state;
        return (
          <ScrollView 
            scrollEnabled={enabled} 
            horizontal
            pagingEnabled
            style={styles.container}
            onScrollEndDrag={this.onScrollEndDrag}
          >
            {this.createSiteLinks()}
          </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps)(Home);