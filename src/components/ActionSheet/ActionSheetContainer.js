'use strict';

import React, { Component } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  mask: {
    backgroundColor: '#000000',
    opacity: 0.6,
  },
});


class ActionSheetContainer extends Component {

  lastVisible = null;

  constructor(props) {
    super(props);
    /*
    this.state={
      visible: null
    }
    this.lastVisible = this.props.visible;
    */
    this.state = {
      visible: this.props.visible
    }
  }

  
  show() {
    if (this.state.visible !== true) {
      this.setState({
        visible: true
      });
    }
  }

  hide() {
    if (this.state.visible !== false) {
      this.setState({
        visible: false
      })
    }
  }
  

  componentWillUpdate(newprops) {
    /*
    if (this.state.visible === null){
      this.lastVisible = newprops.visible;
    } else if (this.lastVisible === null || this.lastVisible === undefined) { 
      if (newprops.visible !== null && newprops.visible !== undefined) {
        this.lastVisible = newprops.visible;
        this.state.visible = null;
      }
    } else if (this.lastVisible !== newprops.visible) {
      this.lastVisible = newprops.visible;
      this.state.visible = null;
    }
    */
  }

  render() {    
    let {style, children, ...props} = this.props;
    props.transparent = this.props.transparent !== false;
    props.animationType = this.props.animationType ||  'slide';
    props.visible = this.state.visible === true;// this.state.visible === null ? this.props.visible === true : this.state.visible === true;
    return (
      <Modal {...props}>
        <View style={[styles.mask, this.props.backgroundStyle, styles.fullscreen]}/>
        <View style={[styles.container, style, styles.fullscreen]}>
          {this.props.isStatic!==true &&<TouchableOpacity style={styles.fullscreen} onPress={() => this._onRequestClose()} />}
          {children} 
        </View>
      </Modal>
    );
  }

  _onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
    this.hide();
  }
}

export default ActionSheetContainer;



        