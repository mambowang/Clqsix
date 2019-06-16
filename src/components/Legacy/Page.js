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

import Images from '../Images';
import KeyboardSpacer from '../KeyboardSpacer';

import {
  DefaultBackgroundColor,
} from '../../styles/GlobalStyles';



var navigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) => {
    return (
      <TouchableOpacity onPress={() => {
          if (index === 0) navigator.props.navigator.pop()
          else navigator.pop()
        }} style={styles.navLeftButton}>
        <Image source={Images.BackChevronLeft_Black_9x16}/>
      </TouchableOpacity>
    );
  },

  RightButton: (route, navigator, index, navState) => {
    return null;
  },

  Title: (route, navigator, index, navState) => {
    return null;
  }
};


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowActivityIndicator : (this.props.showActivityIndicator && this.props.showActivityIndicator === true)
    }
  }

  renderLeftButtonInNavigator (route, navigator, index, navState) {
    
  }

  showActivityIndicator() {
    this.setState({isShowActivityIndicator: true});
  }

  hideActivityIndicator() {
    this.setState({isShowActivityIndicator: false});
  }

  render() {
    const {style, children, ...props} = this.props;
    const useKeyboardSpacer = !this.props.keyboardSpacer || this.props.keyboardSpacer !== false;
    return (
      <View style={[styles.container, style, styles.containerImportant]} {...props}>
        {children}
        {this.state.isShowActivityIndicator && this.renderActivityIndicator()}
        {useKeyboardSpacer && <KeyboardSpacer />}
      </View>
    );
  }

  renderActivityIndicator() {
    return (
      <View style={[styles.fullscreen]}>
        <View style={[styles.fullscreen, styles.mask]} />
        <ActivityIndicator/>
      </View>
    )
  }

  static NavigationBarRouteMapper = navigationBarRouteMapper;
}

Page.propTypes = {

};

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: DefaultBackgroundColor,
  },

  containerImportant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navLeftButton: {
    backgroundColor:'transparent',
    height:44, 
    alignItems:'center', 
    justifyContent:'center', 
    paddingLeft: 15,
  },

  navLeftButtonText: {
    color:'black', fontWeight: '500', fontSize: 16
  },

  activityIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems:'center',
    justifyContent:'center',
    zIndex: 9999,
  },

  mask: {
    backgroundColor: 'white',
    opacity: 0.2,
  },

});

export default Page;