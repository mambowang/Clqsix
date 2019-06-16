'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes
} from 'react-native';

class Footer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.content, this.props.style || {}]}>
          {this.props.children}
        </View>
      </View>
    );
  }
  
}

Footer.propTypes = {
  style: ViewPropTypes.style,
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },

  content: {
    flex: 1,
  }

});

export default Footer;