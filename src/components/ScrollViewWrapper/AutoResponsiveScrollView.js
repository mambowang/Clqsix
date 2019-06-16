'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

import {
  AutoResponsive
} from '../AutoResponsive';

const guid = require('guid');

let styles = StyleSheet.create({
  container: {
    flexDirection:'column',
  },
});

class AutoResponsiveScrollView extends React.Component {

  width = -1;

  constructor(props) {
    super(props);
  }
  

  render() {
    let {itemMargin, children, items, renderItem, ...props} = this.props;
    props.style=[this.props.style, styles.container];
    let autoResProps = {
      itemMargin : itemMargin,
      items: items,
      renderItem: renderItem,
    }

    return (
      <ScrollView {...props}>
        {children}
        <AutoResponsive {...autoResProps} />
      </ScrollView>
    );
  }
}

module.exports = AutoResponsiveScrollView;
