'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types'

class SimpleButton extends Component {
  render() {
    //add by rgs on activeOpacity = {1}
    let {activeOpacity, ...props} = this.props;
    return (
      <TouchableOpacity activeOpacity = {activeOpacity || 0} onPress={this.props.onPress && this.props.onPress.bind(this)}>
        <View style={[styles.container, this.props.style || {}]}>
          <Text style={[styles.text, this.props.textStyle || {}]}>
            {this.props.text || 'Simple Button'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

SimpleButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#0095F7',
        borderWidth: 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: 'darkgrey',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.0,
        shadowRadius:1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
      fontFamily: 'SF UI Text',
      color: 'white',
      fontSize: 15,
    }

});

export default SimpleButton;