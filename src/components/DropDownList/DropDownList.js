
'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import {
  ActionSheet,
} from '../../components';

import {
  Options
 } from '../Options';

 import Images from '../Images';

import GenderDropDownList from './GenderDropDownList';

const styles = StyleSheet.create({

  containerDefault: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },

  container: {
    flexDirection: 'row',
  },

  fullscreen: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  value: {
    flex: 1,
    color: 'black',
  },

  placeholderValue: {
    flex: 1,
    color: '#a3a3a3',
  }
});

class DropDownList extends Component {

  static Gender = GenderDropDownList;

  lastValue = null;

  constructor(props) {
    super(props);
    /*
    this.state= {
      value: this.props.value,
    }
    this.lastValue = this.props.value;
    */
  }

  collapseOut() {
    this.refs.options.show();
  }

  collapseIn() {
    this.refs.options.hide();
  }

/*
  val(value){
    if (value === undefined) {
      return this.state.value;
    }
    this.setState({
      value: value
    });
  }
*/

  val () {
    return this.props.value;
  }

  _onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
   // this.state.collapse = false;
  }

   _onPress() {
    var _this = this;
    Keyboard.dismiss();
    this.collapseOut();
  }

  _onSelectItem(item) {
    /*
    if (item !== this.state.value) {
      this.setState({
        value: item
      });
      if (this.props.onSelectItem) {
        this.props.onSelectItem(item);
      }
    }
    */
      if (!!this.props.onSelectItem) {
        this.props.onSelectItem(item);
      }
    
  }

  _getText() {
    //let value = this.state.value;
    let value = this.props.value;
    return !!value ? ( value.text ? value.text : (value.value ? value.value : item)) : this.props.placeholder;
  }

 

  componentWillUpdate(nextProps, nextState) {
    /*
    let value = nextProps.value, valueUpdated = true, lastValue = this.lastValue;
    if (value && lastValue) {
      if ((value.value || lastValue.value) && value.value !== lastValue.value) {
        this.lastValue = value;
      } else if ((value.text || lastValue.text) && value.text !== lastValue.text) {
        this.lastValue = value;
      } else if (lastValue !== value) {
        this.lastValue = value;
      } else {
        valueUpdated = false;
      }
    } else {
      this.lastValue = value;
    }

    if (valueUpdated) {
      this.state.value = value;
    }
    */
  }

  render() {
    let {style, value, placeholder, children, collapse, ...props} = this.props, 
      containerStyle=[styles.containerDefault, this.props.style, styles.container];
    let valueStyle = !!value //this.state.value 
      ?  styles.value: styles.placeholderValue, text = this._getText();

    props.value = value; //this.state.value;
    props.visible = this.props.collapse === true;
    props.onRequestClose = () => this._onRequestClose();
    props.onSelectItem = (item) => this._onSelectItem(item);

    return (
      <View style={containerStyle}>
        <TouchableOpacity style={[styles.fullscreen, {flexDirection: 'row', alignItems: 'center'}]} onPress={() => this._onPress()}>
          <Text ref="value" style={valueStyle}>{text}</Text>
          {/* <Image source={Images.BackChevron_Gray_16x9}/> */}
        </TouchableOpacity>
        <Options {...props} ref="options"/>
        {children}
      </View>
    );
  }
}

export default DropDownList;



        