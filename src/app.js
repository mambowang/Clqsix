'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,  Text,  View,} from 'react-native';
import {  Alert,  FullScreen,} from './components';
import {RootNav} from './router';
class App extends Component {
  navigator = null;
  constructor(props) {
    super(props);
    this.state = {
      routeId : null,
      pageId : null,
      overlay: false,     
    };
  }
  render() {
    return (<RootNav />); 
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(App)
