'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
    Modal,
} from 'react-native';
import {
  Button,
  ClqsixTextInput,
  Text,
  CustomNavigator,
  FullScreen,
  ScrollViewWrapper,
  Options,
  Images,
} from '../../components';
import {
  AuthAPI
} from '../../utils'
class Notify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarImage : null,
    }
  }
  render() {
    return (
      <FullScreen>
      
      </FullScreen>
    );
  }
};
const styles = StyleSheet.create({  
});
export default Notify;