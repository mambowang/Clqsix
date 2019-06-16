'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
   
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
} from 'react-native';



class CustomNavigator extends Component {

  constructor(props) {
    super(props);
  }

  _onLeftButtonPress() {
    if (this.props.onLeftButtonPress) {
      this.props.onLeftButtonPress();
    }
  }

  _onRightButtonPress() {
    if (this.props.onRightButtonPress) {
      this.props.onRightButtonPress();
    }
  }

  render() {
    var containerStyle = [styles.containerIOSDefault,  this.props.style, styles.containerIOS];
    var title = this.props.children || this.props.title;
    return (
      <View style={containerStyle}>
       
          { this.props.leftButton &&
            <TouchableOpacity onPress={() => this._onLeftButtonPress()}>
             <View style={styles.leftButton}>
              { this.props.leftButton }
              </View>
            </TouchableOpacity>
          }
        
        <View style={styles.title}> 
          { title || <Text></Text> }
        </View>
        
          { this.props.rightButton && 
            <TouchableOpacity onPress={() => this._onRightButtonPress()}>
            <View style={styles.rightButton}>
              { this.props.rightButton }
              </View> 
            </TouchableOpacity>
          }
        
      </View>
    );
  }
};

const styles = StyleSheet.create({
  containerIOSDefault: {
    height: 64,
    paddingTop: 20,
    paddingHorizontal: 5,

  },

  containerIOS: {
    flexDirection:'row',
  },

  leftButton: {
    flex:1,alignItems: 'flex-start', justifyContent:'center', paddingHorizontal: 10, paddingVertical: 12,
  },

  title: {
    flex:1, alignItems: 'center', justifyContent:'center', flexDirection:'row', paddingVertical: 6,
  },

  rightButton: {
    flex:1,alignItems: 'center', justifyContent:'center',paddingHorizontal: 10, paddingVertical: 12,
  }


});

export default CustomNavigator;