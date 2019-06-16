'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

class ActionSheetContent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {style, ...props} = this.props;
    props.style = [style, styles.container];
    return (
      <View {...props} />
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flexDirection: 'column',
    flex: 1,
  },
});

export default ActionSheetContent;



        