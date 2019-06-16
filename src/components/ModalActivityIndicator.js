'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

class ModalActivityIndicator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.modal !== false) {
      return this.renderModal();
    }
    return this.renderModaless();
  }

  renderModal() {
    let {visible, ...props} = this.props;
    props.visible = visible === true;
    props.onRequestClose = () => {if (!!this.props.onRequestClose) this.props.onRequestClose()};
    props.transparent = this.props.transparent !== false;
    return (
      <Modal {...props}>
        <View style={[styles.fullscreen, styles.mask]} />
        <View style={[styles.fullscreen,]}><ActivityIndicator animating size="large" /></View>
      </Modal>
    )
  }

  renderModaless() {
    if (this.props.visible !== true) return null;
    let {visible, transparent, children, style, ...props} = this.props;
    props.style=[style, styles.fullscreen];
    if (transparent === false) {
      props.style.push({backgroundColor:'white'});
    }
    return (
      <View {...props}>
        <View style={[styles.fullscreen, styles.mask]} />
        <ActivityIndicator animating size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({

  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems:'center',
    justifyContent:'center',
  },

  mask: {
    backgroundColor: 'white',
    opacity: 0.3,
  },

});

export default ModalActivityIndicator;