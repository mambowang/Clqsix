'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types'


class Header extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.children) {
      return (
        <View style={styles.container}>
          <View style={[styles.content, this.props.style || {}]}>
            {this.props.children}
          </View>
        </View>
      );
    } else if (this.props.title) {
      if (Platform.OS !== 'ios') {
        return (
          <View style={styles.title}><Text style={styles.titleText}>{this.props.title}</Text></View>
        );
      } else {
        return (
          <View style={[styles.title, styles.titleIOS]}><Text style={styles.titleText}>{this.props.title}</Text></View>
        );
      }
    }
  }
  
}

Header.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },

  titleIOS: {
    marginTop: 20,
    height: 44,
  },

  titleText: {
    fontFamily: 'SF UI Text',
    fontWeight: 'bold', 
    fontSize: 17,
    color: 'black',
  },
});

export default Header;