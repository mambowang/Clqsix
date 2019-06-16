'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import {
  StyleAPI
} from '../utils';


class Row extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    let { style, children,  ...props} = this.props;
    let { alignItems, justifyContent, flexDirection, ...containerStyle} = StyleAPI.mergeStyle(this.props.style);

    if (!justifyContent) {
      justifyContent = 'center';
    }

    if (!alignItems) {
      alignItems = 'center';
    }

    if (flexDirection !== 'row') {
      flexDirection = 'column';
    }

    let contentStyle =  {alignItems : alignItems, justifyContent: justifyContent , flexDirection: flexDirection, flex: 1};

    if (flexDirection == 'row') {
      containerStyle = [style, {flexDirection: 'row', alignItems: alignItems, justifyContent: justifyContent}];
    } else {
      containerStyle = [style, {flexDirection: 'row', alignItems: justifyContent, justifyContent: justifyContent}];
    }

    return (
      <View style={[containerStyle,]}>
        <View style={[contentStyle,]}>
          {children}
        </View>
      </View>
    );
  }
}

class FullScreen extends Component {
  
  static Row = Row;

  constructor(props) {
    super(props);
    this.state = {
        isShow: this.props.isShow
    }
  }

  show () {
    this.setState({
      isShow : true
    });
  }

  hide () {
    this.setState({
      isShow : false
    });
  }

  render() {
    if (this.state.isShow === false) {
      return null;
    }
    var props = Object.assign({}, this.props);
    props.style = [this.props.style, styles.fullscreen];
    return (
      <View {...props}/>
    );
  }

}

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
export default FullScreen;



        