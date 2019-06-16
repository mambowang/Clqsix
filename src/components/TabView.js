'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  ViewPropTypes
} from 'react-native';

import {
  SeparatorLineColor,
} from '../styles/GlobalStyles';

import {
  StyleAPI
} from '../utils';

var guid = require('guid');
 import PropTypes from 'prop-types';

class Tab extends React.Component {

  measure(fnCallback) {
    if (!!this.refs.inner) this.refs.inner.measure(fnCallback);
  }

  _onLayout(e) {
    if (!!this.props.onLayout) this.props.onLayout(e);
  }


  render() {
    let {style, ...props} = this.props;
    if (this.props.selected === true) {
      props.style = [style, styles.tab];
    } else {
      props.style = [style, styles.unselectedTab];
    }
    props.onLayout = (e) => this._onLayout(e);
    return (
      <View ref="inner" {...props}/>
    );
  }
}

class TabView extends Component {
  static Item = Tab;

  static propTypes = {
    ...ViewPropTypes,
  };

  _onLayout(e) {
    if (!!this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  render() {
    let minContentHeight = !!this.props.minContentHeight ? this.props.minContentHeight : 0;
    let barStyle=[];
    if (!!this.props.barStyle) barStyle.push(this.props.barStyle);
    barStyle.push({flexShrink:1, flexDirection:'row', width:'100%'});
    if (!this.props.barTinitColor) barStyle.push({backgroundColor:this.props.barTinitColor});
    return (
      <View style={[this.props.style, {flexDirection:'row'}]}>
        <View style={{height:minContentHeight, maxHeight:minContentHeight, flexShrink:1, width:0, opacity: 1, overflow:'hidden', backgroundColor:'red'}}></View>
        <View style={{flexGrow:1, flexDirection:'column'}}>
          <View style={barStyle}>
            {
              this.props.children.map((item, i) => {
                let text = (item.props.selected && item.props.selectedText) ? item.props.selectedText : (!!item.props.text ? item.props.text : '');
                let textStyle = [];
                if (!! this.props.textStyle) textStyle.push(this.props.textStyle);
                if (!! item.props.textStyle) textStyle.push(item.props.textStyle);
                if (item.props.selected) {
                  if (this.props.selectedTextStyle) textStyle.push(this.props.selectedTextStyle);
                  if (item.props.selectedTextStyle) textStyle.push(item.props.selectedTextStyle);
                }

                let tabItemStyle = [{alignItems:'center',justifyContent:'center'}];
                if (!! this.props.itemStyle) tabItemStyle.push(this.props.itemStyle);
                if (!! item.props.style) tabItemStyle.push(this.props.itemStyle);
                if (item.props.selected) {
                  if (!!this.props.selectedItemStyle) textStyle.push(this.props.selectedItemStyle);
                  if (item.props.selectedStyle) textStyle.push(item.props.selectedStyle);
                }
                tabItemStyle.push({flexGrow:1});
                return (
                  <TouchableOpacity key={i} style={[tabItemStyle]} onPress={() => !item.props.selected && item.props.onPress && item.props.onPress()}>
                    { ((item.props.selectedIcon && item.props.selected) && <Image source={item.props.selectedIcon} />) || (item.props.icon && <Image source={item.props.icon} />) }
                    <Text style={textStyle}>{text}</Text>
                  </TouchableOpacity>
                );
              }, this)
            }
          </View>
          <View style={{width:'100%', flexGrow:1}}>
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}
var styles = StyleSheet.create({
  tab: {
    // TODO(5405356): Implement overflow: visible so position: absolute isn't useless
    flexGrow: 1,
    width: '100%',
    borderWidth: 0,
  },

  unselectedTab: {
    // TODO(5405356): Implement overflow: visible so position: absolute isn't useless
    overflow:'hidden',
    opacity:1,
    top: 0,
    left: 0,
    borderWidth: 0,
    height: 0,
    width: 0,
  }
});

export default TabView;


