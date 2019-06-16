'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import ActionSheetContainer from './ActionSheetContainer'
import ActionSheetContent from './ActionSheetContent'
import ActionSheetTitlebar from './ActionSheetTitlebar'

const styles = StyleSheet.create({
  containerDefault: {
    backgroundColor: '#fff',
  },

  container: {
    flexDirection: 'row',
  },
});

class ActionSheet extends Component {

  static Container = ActionSheetContainer;
  static Content = ActionSheetContent;
  static Titlebar = ActionSheetTitlebar;

  constructor(props) {
    super(props);
  }

  show() {
    this.refs.inner.show();
  }

  hide() {
    this.refs.inner.hide();
  }

  render() {
    let {style, children, ...props} = this.props, containerStyle = [styles.containerDefault, this.props.style, styles.container];
    return (
      <ActionSheetContainer {...props} ref="inner">
        <View style={containerStyle}>
          <ActionSheetContent>
            { children }
          </ActionSheetContent>
        </View>
      </ActionSheetContainer>
    );
  }
}

export default ActionSheet;



        