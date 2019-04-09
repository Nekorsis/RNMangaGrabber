/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Button,
    CheckBox,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeModuleName } from '../actions';
import { screenNames } from '../constants/consts';
import styles from './styles/Main';
import siteNames from '../utils/sitenames';
import siteImages from '../assets/images/siteimages';

class Home extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({}).isRequired,
        store: PropTypes.shape({}).isRequired,
    };
    
    openMangaSite = (link) => {
        const { navigation: { navigate } } = this.props;
        navigate(screenNames.Site.name, { moduleName: link });
    }

    createSiteLinks = (sites) => {
        return sites.map((link, index) => {
            return (
                <View key={index}>
                <TouchableOpacity onPress={() => { this.openMangaSite(link); }} style={styles.touchableOpacity}>
                    <Image style={{ backgroundColor: 'red' }} source={siteImages[link]}/>
                    <Text> {link} </Text>
                </TouchableOpacity>
                </View>
            );
        });

    }

    render() {
        return (
          <ScrollView style={styles.container}>
          {this.createSiteLinks(siteNames)}
          </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    store: state.appReducer,
});

export default connect(mapStateToProps)(Home);